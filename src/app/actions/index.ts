"use server";
import client from "../utils/paypal/client";
import paypal from "@paypal/checkout-server-sdk";

//responsible for initiating the creation of a paypal order
export async function createOrder() {
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
            value: "10.00",
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
      return { error: response.statusMessage};
    }

    // Your Custom Code for doing something with order
    // Usually Store an order in the database like MongoDB

    //extract orderID from the response, then return it
    const orderId = response.result.id;

    return { success: "true", orderId };
  } catch (err) {
    console.log("Err at Create Order: ", err);
    return { error: "true" };
  }
}

//responsible for capturing the payment
export async function payOrder(orderId: string) {
  console.log("runs!");
  console.log(orderId);
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
  console.log(response);
  // Your Custom Code to Update Order Status
  // And Other stuff that is related to that order, like wallet
  // Here I am updateing the wallet and sending it back to frontend to update it on frontend
  console.log("success");
  return { success: "true" };
}
