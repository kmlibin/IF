"use client";
import React from "react";
import { useState } from "react";
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

const CartPay = ({ initialOptions }: CartPayProps) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [validAddress, setValidAddress] = useState(false);

  const { state } = useCart();
  const { cart } = state;

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
  <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="address">Address:</label>
        <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} required />
        <button type="button" onClick={handleAddressValidation}>Validate Address</button>
      </div>
      <button type="submit">Submit</button>
    </form>
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
    </>
  );
};

export default CartPay;
