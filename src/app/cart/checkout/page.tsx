"use client";

import { useEffect, useState } from "react";
import Summary from "@/app/components/Summary";
import { useCart } from "@/app/components/CartContext";

export default function Checkout() {
  const [finalTotal, setFinalTotal] = useState(0);
  const { state } = useCart();
  const { cart } = state;
  const {subtotal} = state;

  console.log(cart)

  return (
    <div className="flex w-full">
      <div className="flex flex-col w-3/5">div 1</div>
      <div className="flex flex-col w-2/5">
        <Summary cart={cart}  subtotal={subtotal} finalTotal={finalTotal} />
      </div>
    </div>
  );
}
