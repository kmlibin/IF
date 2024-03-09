'use client'
import { useState } from "react";
import Summary from "@/app/components/Summary";
import CollectInfo from "./CollectInfo";
import { useCart } from "@/app/components/CartContext";
import { PayPal } from "./PayPal";
import ChooseShipping from "./ChooseShipping";
import { handleAddressValidation } from "@/app/actions";

export default function Checkout() {
  const [finalTotal, setFinalTotal] = useState(0);
  const [shipping, setShipping] = useState<number | undefined>()
  const { state } = useCart();
  const { contactInfo } = state;
  const { cart } = state;
  const { subtotal } = state;

  // console.log(cart);

  console.log(shipping)
  return (
    <div className="flex w-full">
      <div className="flex flex-col w-3/5">
        <CollectInfo handleAddressValidation={handleAddressValidation} />
        <ChooseShipping setShipping={setShipping}/>
        <PayPal finalTotal={finalTotal} contactInfo={contactInfo} cart={cart}/>
      </div>
      <div className="flex flex-col w-2/5">
        <Summary
          cart={cart}
          subtotal={subtotal}
          finalTotal={finalTotal}
          shipping={shipping}
          setFinalTotal={setFinalTotal}
        />
      </div>
    </div>
  );
}
