"use server";
import client from "../utils/paypal/client";
import paypal from "@paypal/checkout-server-sdk";
import { collection, addDoc, getDoc, updateDoc, doc } from "firebase/firestore/lite";
import { db } from "@/app/firebase/config";

export const handleAddressValidation = async (userAddress: any) => {
  "use server";
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

//remove what doesn't need to be returned!
//type things correctly
//handle errors

//responsible for initiating the creation of a paypal order
export async function createOrder(orderTotal: any) {
  try {
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
      return { error: response.statusMessage };
    }

    //extract orderID from the response, then return it
    const orderId = response.result.id;

    return { success: "true", orderId, orderTotal };
  } catch (err) {
    console.log("Err at Create Order: ", err);
    return { error: "true" };
  }
}

async function postOrderToFirebase(orderObject: any) {
  try {
    // Reference to the 'orders' collection
    const ordersCollection = collection(db, "orders");

    // Add a new document to the 'orders' collection with the order object
    const docRef = await addDoc(ordersCollection, orderObject);

    console.log("Order successfully added with ID:", docRef.id);
  } catch (error) {
    console.error("Error adding order to Firebase:", error);
    throw error; // Optional: Rethrow the error to handle it further up the call stack
  }
}

//NEED TO:
//I need to split off functions for updating and posting to the database; hopefully can put in server actions
//try/catch or if or something. ONLY post the order if the response is successful.
//figure out how i want to handle errors for user
//need to type things correctly
//revalidate data somewhere since orders changed and product quantities changed. probably in server actions...?
//paypal loadind button states
//redirect user to order confirmation page on success
//needs to send emails, one to the admin, one to the client

//responsible for capturing the payment
export async function payOrder(
  orderId: string,
  email: any,
  name: any,
  address: any,
  products: any,
  orderTotal: any
  
) {
  console.log("runs!");
  console.log(`email ${email} name${name}`)


  // console.log(orderId);
  //initialize client again
  const PaypalClient = client();
  //new request to capture the specified order, using orderID
  const request = new paypal.orders.OrdersCaptureRequest(orderId);
  //@ts-ignore
  request.requestBody({});

  const response = await PaypalClient.execute(request);
  if (!response) {
    return { error: "true" };
  }

   // update quantity of each purchased item in Firebase
   for (const product of products) {
    const productId = product.id;
    const purchasedQuantity = product.quantity;

    // find the document in the products collection
    const productDocRef = doc(db, "products", productId);

    // get the product data and ultimately the quantity
    const productDocSnapshot = await getDoc(productDocRef);
    const currentQuantity = productDocSnapshot?.data()?.quantity;

    // update the quantity in a variable. Math.max(0...ensures that the value CANNOT be negative!)
    const updatedQuantity = Math.max(0, currentQuantity - purchasedQuantity);

    // pass the updated quantity to the document
    await updateDoc(productDocRef, { quantity: updatedQuantity });
  }

  //need to send to firebase ONLY if response is 201 (or whatever it is..check)
 
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
  console.log("success");
  return { success: "true" };
}
