"use client";
import { useCart } from "../components/CartContext";
import Product from "../products/[id]/Product";

export default function Cart() {
  const {state} = useCart();
  const {cart} = state
  console.log(state);
  return (
    <div>
      {cart.map((item) => (
        <Product product={item} />
      ))}
    </div>
  );
}
