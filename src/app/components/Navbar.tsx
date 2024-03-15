"use client";
import logo from "../../../public/kmllogo.png";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { logout } from "../actions";
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { state } = useCart();
  const { cart } = state;
  const router = useRouter()

  //get total quantity of items in cart based on the quantity prop with each item
  const totalQuantity = cart.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

  const { setUser } = useAuth();
 

  const handleLogout = async () => {
    try {
      await logout()
      setUser && setUser(null);
      // Clear local storage and cookies
      Cookies.remove("currentUser")
      localStorage.removeItem("userToken");
      localStorage.removeItem("isAdmin");
      router.push("/products")
  //redirect user somwehere
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <nav className="flex justify-evenly items-center">
      <div className="w-1/6">
        <Image src={logo} alt="logo" height={100} width={100} />
      </div>
      <button onClick={handleLogout}>Logout</button>
      <ul className="flex w-5/6 justify-evenly items-end">
        {["home", "products", "work", "skills", "contact"].map((item) => (
          <li className="" key={`link-${item}`}>
            <Link href="/products">{item}</Link>
          </li>
        ))}
        <li className="">
          <Link href="/cart">Cart {cart && totalQuantity}</Link>
        </li>
      </ul>
    </nav>
  );
}
