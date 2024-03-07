"use client";

import { useEffect, useState } from "react";
import Summary from "@/app/components/Summary";
import CollectInfo from "./CollectInfo";
import { useCart } from "@/app/components/CartContext";
import { PayPal } from "./PayPal";

export default function Checkout() {
  const [finalTotal, setFinalTotal] = useState(0);
  const { state } = useCart();
  const { contactInfo } = state;
  const { cart } = state;
  const { subtotal } = state;

  console.log(cart);

  return (
    <div className="flex w-full">
      <div className="flex flex-col w-3/5">
        <CollectInfo />
        <PayPal finalTotal={finalTotal} cart={cart} contactInfo={contactInfo} />
      </div>
      <div className="flex flex-col w-2/5">
        <Summary
          cart={cart}
          subtotal={subtotal}
          finalTotal={finalTotal}
          setFinalTotal={setFinalTotal}
        />
      </div>
    </div>
  );
}
