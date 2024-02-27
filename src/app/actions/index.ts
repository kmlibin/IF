"use server";
import client from "../utils/paypal/client";
import paypal from "@paypal/checkout-server-sdk";

export async function createOrder() {
  try {
    const PaypalClient = client();
    //This code is lifted from https://github.com/paypal/Checkout-NodeJS-SDK
    const request = new paypal.orders.OrdersCreateRequest();

    request.headers["Prefer"] = "return=representation";
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: "10.00",
          },
        },
      ],
    });
    const response = await PaypalClient.execute(request);
    console.log(response)
    if (response.statusCode !== 201) {
      console.log("RES: ", response);
      return { error: "true" };
    }

    // Your Custom Code for doing something with order
    // Usually Store an order in the database like MongoDB

    const orderId = response.result.id; 
console.log(orderId)
    return { success: "true", orderId };
  } catch (err) {
    console.log("Err at Create Order: ", err);
    return { error: "true" };
  }
}

export async function payOrder(orderId: any) {
  console.log('runs!')
  //Capture order to complete payment
  console.log(orderId)
  const PaypalClient = client();
  const request = new paypal.orders.OrdersCaptureRequest(orderId);
  request.requestBody({});
  const response = await PaypalClient.execute(request);
  if (!response) {
    return { error: "true" };
  }

  // Your Custom Code to Update Order Status
  // And Other stuff that is related to that order, like wallet
  // Here I am updateing the wallet and sending it back to frontend to update it on frontend
console.log('success')
  return { success: "true" };
}
