"use client";
import React from "react";

import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { createOrder, payOrder } from "../../actions/index";

interface CartItem {
  id: string;
  data: {
    price: number | string;
    type: string;
    name: string;
    id: string;
  };
}

type ContactInfo = {
  name: string;
  email: string;
  address: string;
};

interface PayPalProps {
  finalTotal: number;
  cart: CartItem[];
  contactInfo: ContactInfo;
}

export const PayPal = ({ finalTotal, cart, contactInfo }: PayPalProps) => {
  const client = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";
  const initialOptions = {
    clientId: client,
    currency: "USD",
    intent: "capture",
  };

  //had to confirm that contact info existed in order to send the state in the onapprove. should probably do that for products, but there will be a lot of
  //reworking and conditional rendering as i finish the ui. just trying to get functionality at the moment
  return (
    <>
      {contactInfo && (
        <PayPalScriptProvider options={initialOptions}>
          <div>
            <PayPalButtons
              createOrder={async (data, actions) => {
                let response = await createOrder(finalTotal);
                if (response.success === "true") {
                  return response.orderId; //success
                } else {
                  //  error from createOrder function
                  console.error("Error creating order:", response.error);
                  return undefined;
                }
              }}
              onApprove={async (data, actions) => {
                const products = { cart };
                const { name, email, address } = contactInfo;
                let response = await payOrder(
                  data.orderID,
                  email,
                  name,
                  address,
                  products
                );
                if (response && response.success === "true") {
                  console.log("Payment successful");
                } else {
                  console.error("Payment failed:", response.error);
                }
              }}
            />
          </div>
        </PayPalScriptProvider>
      )}
    </>
  );
};