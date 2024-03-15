"use server";
import client from "../utils/paypal/client";
import { Auth, signInWithEmailAndPassword } from "firebase/auth";
import { revalidatePath } from "next/cache";
import paypal from "@paypal/checkout-server-sdk";

import {
  collection,
  addDoc,
  getDoc,
  updateDoc,
  doc,
} from "firebase/firestore/lite";
import { db } from "@/app/firebase/config";
import { auth } from "@/app/firebase/config";
import { CartItem } from "../types";
import { fetchPricesFromFirebase } from "../firebase/queries";

export async function login(email: string, password: string) {
  try {
    const response = await signInWithEmailAndPassword(auth, email, password);
    let admin;
    //after successful login, get the users information from the users collection, stored by uid
    if (auth.currentUser) {
      const uid = auth.currentUser.uid;
      const userDoc = await getDoc(doc(db, "users", uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();

        //set admin to true so can return to frontend
        if (userData.isAdmin) {
          admin = true;
        }
      }

      // store auth token and store it in local storage
      const token = await auth.currentUser.getIdToken();
      return { token, admin };
    }
    console.log("Login success!");
  } catch (error: any) {
    console.log("Login failed:", error.message);
    return error.message;
  }
}

export async function logout() {
  try {
    auth.signOut();
    console.log("Logout success!");
    console.log(auth)
  } catch (error) {
    console.error("Logout failed:", error);
  }
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
