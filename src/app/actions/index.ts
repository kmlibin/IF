"use server";
import client from "../utils/paypal/client";
import { storage } from "@/app/firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { revalidatePath } from "next/cache";
import paypal from "@paypal/checkout-server-sdk";

import {
  collection,
  addDoc,
  getDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore/lite";
import { db } from "@/app/firebase/config";
import { auth } from "@/app/firebase/config";
import { CartItem } from "../types";
import { fetchPricesFromFirebase } from "../firebase/queries";
import { cookies } from "next/headers";

export const authUser = async () => {
  let auth;
  const cookieStore = cookies();
  const token = cookieStore.get("token");

  try {
    const res = await fetch("http://localhost:3000/api/auth", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Include the cookie in the request headers
        "Set-Cookie": `${token?.value}`,
      },
    });
    const responseData = await res.json();
    if (res.status == 200) {
      return { auth: true, message: responseData.message };
    } else {
      return { auth: false, error: responseData.error };
    }
  } catch (err) {
    return { auth: false, error: "Internal Service Error" };
  }
};

//remove cookie
//remove custom claims
export async function logout() {
  try {
    await auth.signOut();
    console.log("Logout success!");
  } catch (error) {
    console.error("Logout failed:", error);
  }
  console.log(auth.currentUser);
}

export const handleAddressValidation = async (userAddress: any) => {
  const cleanedAddress = userAddress.replace(/,/g, "");
  console.log(cleanedAddress);
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        cleanedAddress
      )}&key=${process.env.GOOGLE_API_KEY}`
    );

    if (response.ok) {
      const data = await response.json();

      if (data.results.length > 0) {
        let formattedAddress = data.results[0].formatted_address;
        return formattedAddress;
      }
    } else {
      console.error("Error validating address:", response.statusText);
    }
  } catch (error) {
    console.error("Error validating address:", error);
  }
};

//firebase queries:
async function postOrderToFirebase(orderObject: any) {
  try {
    // Reference to the 'orders' collection
    const ordersCollection = collection(db, "orders");

    // Add a new document to the 'orders' collection with the order object
    const docRef = await addDoc(ordersCollection, orderObject);

    console.log("Order successfully added with ID:", docRef.id);
  } catch (error) {
    console.error("Error adding order to Firebase:", error);
    throw error;
  }
}

//responsible for initiating the creation of a paypal order
export async function createOrder(orderTotal: number, cart: CartItem[]) {
  try {
    //first compare prices between cart and database
    const prices = await fetchPricesFromFirebase(cart);
    //if error was thrown from fetchprices
    if ("error" in prices) {
      return { error: prices.error };
    }
    // make sure prices in cart match prices from db
    for (const item of cart) {
      const itemId = item.id;
      const itemPrice = prices[itemId];

      if (itemPrice === undefined) {
        return { error: `Price not found for item ${itemId} in the database` };
      }

      // compare the prices
      if (itemPrice !== item.data.price) {
        //means there is a mismatch between the database and cart
        return {
          error: `Price mismatch for item ${itemId}. Please refresh the page and try again.`,
        };
      }
    }

    //create paypal order
    //init paypal client
    const PaypalClient = client();
    //new request to create an order
    //  OrdersCreateRequest() creates a POST request to /v2/checkout/orders
    const request = new paypal.orders.OrdersCreateRequest();
    //can retern minimal or representation. minimal includes id, status, and hateoas links. repre returns the complete resource and current state of resource
    request.headers["Prefer"] = "return=representation";
    request.requestBody({
      //capture payment immediately after customer makes the payment...also authorize, but
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: String(orderTotal),
          },
        },
      ],
    });

    //execute request, await response from paypal
    const response = await PaypalClient.execute(request);
    console.log(response);
    //if response isn't created (201)
    if (response.statusCode !== 201) {
      console.log("RES: ", response);
      return { error: `Error creating order: ${response.statusMessage}` };
    }

    //extract orderID from the response, then return it
    const orderId = response.result.id;

    return { success: true, orderId, orderTotal };
  } catch (err) {
    console.log("Err at Create Order: ", err);
    return { error: "Error creating order, please try again later." };
  }
}

//NEED TO:

//might need to put each product as static, so would need to revalidate the id of the product whose quantities changed
//needs to send emails, one to the admin, one to the client

//responsible for capturing the payment
export async function payOrder(
  orderId: string,
  email: string,
  name: string,
  address: string,
  products: CartItem[],
  orderTotal: number
) {
  console.log("runs!");

  try {
    //initialize client again
    const PaypalClient = client();
    //new request to capture the specified order, using orderID
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    //@ts-ignore
    request.requestBody({});

    const response = await PaypalClient.execute(request);
    if (!response) {
      return {
        error:
          "Error with payment. Please try again later or contact email@email to complete transaction",
      };
    }
    //send emails here? like, what if it's paid, but doesn't get posted to firebase? i could see the case for having it in create order function
    //put quantity check in its own function?
    //ONLY send to firebase if the response is completed
    if (response.result && response.result.status == "COMPLETED") {
      // update quantity of each purchased item in Firebase
      for (const product of products) {
        const productId = product.id;
        const purchasedQuantity = product.quantity;

        // find the document in the products collection
        const productDocRef = doc(db, "products", productId);

        // get the product data and ultimately the quantity
        const productDocSnapshot = await getDoc(productDocRef);
        const currentQuantity = productDocSnapshot?.data()?.quantity;

        //make sure there is enough in the database
        if (purchasedQuantity > currentQuantity) {
          return {
            error: `${product.data.name} is not available at the requested quantity`,
          };
        }
        // update the quantity in a variable. Math.max(0...ensures that the value CANNOT be negative!)
        const updatedQuantity = Math.max(
          0,
          currentQuantity - purchasedQuantity
        );

        // pass the updated quantity to the document
        await updateDoc(productDocRef, { quantity: updatedQuantity });
      }

      //create a new date in iso to send to fb
      const paidAt = new Date();
      const paidAtIso = paidAt.toISOString();

      //might not need shipping address, paypal collects it and it displays on their UI.
      const orderObject = {
        PaypalPaymentId: orderId,
        PayPalemail: response.result.payer.email_address,
        CustomerName: name,
        CustomerEmail: email,
        CustomerAddress: address,
        paidAt: paidAtIso,
        orderTotal: orderTotal,
        hasShipped: false,
        shipMethod: "USPS Ground",
        tracking: "none",
        products,
      };

      await postOrderToFirebase(orderObject);
    }

    revalidatePath("/products");
    return { success: true, orderId };
  } catch (err) {
    return {
      error:
        "Error processing payment. Please try again later or contact email@email to complete purchase",
    };
  }
}

//revalidate paths that show products since there is now a new product
export const createProduct = async (formData: any) => {
  const { name, quantity, price, keywords, description, type, images } =
    formData;
  try {
    const newProduct = await addDoc(collection(db, "products"), {
      name,
      description,
      type,
      quantity,
      price,
      keywords,
      images,
      isActive: true,
    });

    if (newProduct.id) {
      console.log("added product successfully");
      return {
        error: false,
        message: "successfully added product to database",
      };
    } else {
      return {
        error: true,
        message: "error adding product to database, try again later",
      };
    }
  } catch (error: any) {
    // figure out fb specific errors
    if (error.code === "permission-denied") {
      return {
        error: true,
        message: "Permission denied. Please try again later.",
      };
    }
    return {
      error: true,
      message: "error adding product to database, try again later",
    };
  }

  //revalidate paths that show products
};

export const uploadImage = async (image: File): Promise<string> => {
  try {
    console.log("Uploading image:", image);
    //create image name
    const imageName = `${Date.now()}-${image.name}`;

    //referene to the location whree image will be stored.
    const imageRef = ref(storage, `images/${imageName}`);
    console.log(imageRef);

    // uploads the file to the place we told it to go
    await uploadBytes(imageRef, image);

    //after it uploads, we need to get the url so we can store it with the associated product in firestore
    const imageUrl = await getDownloadURL(imageRef);

    return imageUrl;
  } catch (error) {
    throw new Error("Error uploading images");
  }
};

export const deleteProduct = async (id: string) => {
  try {
    await deleteDoc(doc(db, "products", id));
    return "Product Deleted Sucessfully";
  } catch (error: any) {
    return error.message;
  }

  //revalidate paths that showed the product.../products /admin
};

export const editProduct = async (productId: string, formData: any) => {
  const {
    name,
    description,
    price,
    type,
    quantity,
    keywords,
    images,
    isActive,
  } = formData;
  const productRef = doc(db, "products", productId);
  if (productRef) {
    await updateDoc(productRef, {
      name,
      description,
      price,
      type,
      quantity,
      keywords,
      images,
      isActive,
    });

    return "Product Edited Successfully"
  }
  return "Unable to Edit Product"
};
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { getAuth } from "firebase-admin/auth";
// import { initializeAdminApp } from "./app/firebase/firebaseAdmin";

// // This function can be marked `async` if using `await` inside
// export async function middleware(request: NextRequest) {
//   initializeAdminApp();

//   const token = request.cookies.get("token");
//   const tokenValue = token?.value;
//   console.log(tokenValue);

//   if (tokenValue) {
//     try {
//       await getAuth()
//         .verifyIdToken(token.toString())
//         .then((claims) => {
//           if (claims.admin === true) {
//             return true
//           }
//         });
//     } catch (error) {
//       return NextResponse.redirect(new URL("/sign-in", request.url));
//     }
//   }
// }

// // See "Matching Paths" below to learn more
// export const config = {
//   matcher: "/admin",
// };
