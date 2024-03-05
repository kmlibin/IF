"use server";
import client from "../utils/paypal/client";
import paypal from "@paypal/checkout-server-sdk";
import { collection, addDoc } from "firebase/firestore/lite";
import { db } from "@/app/firebase/config";

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
          // shipping: {
          //   name: {
          //     full_name: "john doe"
          //   },
          //   address: {
          //     address_line_1: "address line 1 works",
          //     admin_area_2: 'Phoenix',
          //     admin_area_1: 'AZ',
          //     postal_code: '85001',
          //     country_code: 'US'
          //   }
          // }
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

    return { success: "true", orderId };
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

//responsible for capturing the payment
export async function payOrder(
  orderId: string,
  email: any,
  name: any,
  address: any,
  products: any
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
  // console.log(response);

  const orderObject = {
    PaypalPaymentId: orderId,
    PayPalemail: response.result.payer.email_address,
    CustomerName: name,
    CustomerEmail: email,
    CustomerAddress: address,
    products,
  };

  await postOrderToFirebase(orderObject);
  console.log("success");
  return { success: "true" };
}
