import React from "react";
import Image from "next/image";
import quilt from "../../../public/quilt.jpg";

interface CartItem {
  id: string;
  data: {
    price: number | string;
    type: string;
    name: string;
    id: string;
  };
}

interface Cart {
  cart: CartItem[];
  subtotal: number;
}
type SummaryProps = {
  cart: CartItem[];
  subtotal: number;
  finalTotal: number;
};

const Summary = ({ cart, subtotal, finalTotal }: SummaryProps) => {
  console.log(cart);
  return (
    <div className="w-5/6 flex flex-col">
      {cart.map((item) => (
        <div
          key={item.id}
          className="flex justify-evenly w-full h-[100px] my-4"
        >
          <Image src={quilt} alt="quilt" height={75} width={105} />
          <p>{item.data.name}</p>
          <p>x 1</p>
          <p>{item.data.price}</p>
        </div>
      ))}
      <div className="flex flex-col w-full justify-end items-end">
        <p>subtotal: {subtotal}</p>
        <p>shipping: $10</p>
        <p>Total: {subtotal + 10}</p>
      </div>
    </div>
  );
};

export default Summary;
