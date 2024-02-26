'use client'
import logo from "../../../public/kmllogo.png";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useCart } from "./CartContext";

export default function Navbar() {
  const [cart] = useCart();
  console.log(cart)
  return (
    <nav className="flex justify-evenly items-center">
      <div className="w-1/6">
        <Image src={logo} alt="logo" height={100} width={100} />
      </div>
      <ul className="flex w-5/6 justify-evenly items-end">
        {["home", "products", "work", "skills", "contact"].map((item) => (
          <li className="" key={`link-${item}`}>
            <Link href="/products">{item}</Link>
          </li>
        ))}
        <li className="">
          <Link href="/cart">Cart {cart && cart.length}</Link>
        </li>
      </ul>
    </nav>
  );
}
