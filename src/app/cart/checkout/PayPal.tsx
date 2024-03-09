"use client";
import React from "react";

import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { createOrder, payOrder } from "../../actions/index";
import { useCart } from "@/app/components/CartContext";

interface CartItem {
  id: string;
  data: {
    name: string;
    type: string;
    price: number | string;
  };
  quantity: number;
}

type ContactInfo = {
  name: string;
  email: string;
  address: string;
};

type PayPalProps = {
  finalTotal: number;
  cart: CartItem[];
  contactInfo: ContactInfo;
}

export const PayPal = ({ finalTotal, contactInfo, cart }: PayPalProps) => {

  const client = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";
  const initialOptions = {
    clientId: client,
    currency: "USD",
    intent: "capture",
  };

  let orderTotal: any;
  //had to confirm that contact info existed in order to send the state in the onapprove. should probably do that for products, but there will be a lot of
  //reworking and conditional rendering as i finish the ui. just trying to get functionality at the moment
  return (
    <>
      {contactInfo.name.length > 1 && finalTotal && (
        <PayPalScriptProvider options={initialOptions}>
          <div>
            <PayPalButtons
              createOrder={async (data, actions) => {
                let response = await createOrder(finalTotal);
                if (response.success === "true") {
                  orderTotal = response.orderTotal;
                  return response.orderId;
                } else {
                  //  error from createOrder function
                  console.error("Error creating order:", response.error);
                  return undefined;
                }
              }}
              onApprove={async (data, actions) => {
                const products =  cart ;
                const { name, email, address } = contactInfo;
                let response = await payOrder(
                  data.orderID,
                  email,
                  name,
                  address,
                  products,
                  orderTotal
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
