"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useCart } from "../components/CartContext";
import Product from "../products/[id]/Product";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { createOrder, payOrder } from "../actions";


interface CartPayProps {
  initialOptions: {
    clientId: string;
    currency: string;
    intent: string;
  };
}

const CartPay = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [validAddress, setValidAddress] = useState(false);
const [cost, setCost] = useState("20")
  const { state } = useCart();
  const { cart } = state;


  const client = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";
  const initialOptions = {
    clientId: client,
    currency: "USD",
    intent: "capture",
  };

  console.log(initialOptions)

  useEffect(() => {
    console.log(address)
  },[address])

  const handleAddressValidation = async () => {
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`);
      
      if (response.ok) {
        const data = await response.json();
       console.log(data.results[0].formatted_address)
        if (data.results.length > 0) {
          setValidAddress(true);
        } else {
          setValidAddress(false);
        }
      } else {
        console.error('Error validating address:', response.statusText);
      }
    } catch (error) {
      console.error('Error validating address:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission if the address is valid
    if (validAddress) {
      console.log('Valid address submitted:', address);
      // Additional form submission logic...
    } else {
      console.error('Invalid address:', address);
    }
  };
  return (
    <>

      <PayPalScriptProvider options={initialOptions}>
        <div>
          {cart.map((item) => (
            <Product key={item.id} product={item} />
          ))}
        </div>
        <div>
          <PayPalButtons
            createOrder={async (data, actions) => {
        
              let response = await createOrder(cost);
              if (response.success === "true") {
                return response.orderId; //success
              } else {
                //  error from createOrder function
                console.error("Error creating order:", response.error);
                return undefined; // undefined if createOrder failed
              }
            }}
            onApprove={async (data, actions) => {  
              const products = {cart}
              const shippingAddress = cost
              let response = await payOrder(data.orderID, shippingAddress, products);
              if (response && response.success === "true") {
                console.log("Payment successful");
              } else {
                console.error("Payment failed:", response.error);
              }
            }}
          />
        </div>
      </PayPalScriptProvider>
    </>
  );
};

export default CartPay;
