import React from "react";
import Image from "next/image";
import quilt from "../../../public/quilt.jpg";
import { CartItem } from "../types";


type SummaryProps = {
  shipping: number | undefined;
  cart: CartItem[];
  subtotal: number;
  finalTotal: number;
  setFinalTotal: React.Dispatch<React.SetStateAction<number>>;
};

const Summary = ({ shipping, cart, subtotal, finalTotal, setFinalTotal }: SummaryProps) => {
  console.log(cart);

  if(subtotal && shipping !== undefined) {
    setFinalTotal(subtotal + shipping)
  }
  
  return (
    <div className="w-5/6 flex flex-col bg-cyan-200">
      {cart.map((item) => (
        <div
          key={item.id}
          className="flex justify-evenly w-full h-[100px] my-4"
        >
          <Image src={quilt} alt="quilt" height={75} width={105} />
          <p>{item.data.name}</p>
          <p>x {item.quantity}</p>
          <p>${item.data.price}</p>
        </div>
      ))}
      <div className="flex flex-col w-full justify-end items-end">
        <p>subtotal: {subtotal}</p>
        <p>shipping: {shipping}</p>
        <p>Total: ${finalTotal}</p>
      </div>
    </div>
  );
};

export default Summary;
