'use client'
import React from 'react'
import { useCart } from "../components/CartContext";
import Product from "../products/[id]/Product";
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { createOrder, payOrder } from '../actions';
interface CartPayProps {
    initialOptions: {
      clientId: string,
      currency: string,
      intent: string
    }
}


const CartPay = ({initialOptions} : CartPayProps) => {
  console.log(initialOptions)

    const {state} = useCart();
    const {cart} = state
  return  (
    <PayPalScriptProvider options={initialOptions}>
    <div>
      {cart.map((item) => (
        <Product key={item.id} product={item} />
      ))}
    </div>
    <div>
      <PayPalButtons
        createOrder={async (data, actions) => {
          let response = await createOrder();
          if (response.success === "true") {
            return response.orderId; //success
          } else {
            //  error from createOrder function
            console.error("Error creating order:", response.error);
            return undefined; // undefined if createOrder failed
          }
        }}
        onApprove={async (data, actions) => {
          let response = await payOrder(data.orderID);
          if (response && response.success === "true") {
            console.log("Payment successful");
          } else {
            console.error("Payment failed:", response.error);
          }
        }}
      />
    </div>
  </PayPalScriptProvider>
  );
}

export default CartPay