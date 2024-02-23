import React from "react";
import Image from "next/image";
import quilt from "../../../public/quilt.jpg";
import Link from "next/link";


import { collection, getDocs } from "firebase/firestore/lite";
import { db } from "@/app/firebase/config";

interface Product {
    name: string;
    type: string;
    price: number;
  }

export async function getProducts() {
    const productCol = collection(db, "products");
    const productSnapshot = await getDocs(productCol);
    const productsList: { id: string; data: Product }[] = productSnapshot.docs.map(
      (doc) => ({ id: doc.id, data: doc.data() as Product })
    );
    console.log(productsList)
    return productsList
}


export default async function ProductList() {
  const products = await getProducts();

  console.log(products)
  return (
    <div className="flex w-full gap-4 justify-center items-center min-h-[70vh]">
      {products &&
        products.map((item: { id: string; data: Product }) => (
          <div key={item.data.name} className="w-1/4 flex flex-col">
            <Image src={quilt} alt="quilt" />
            <Link href={`/products/${item.id}`}>
              <div>{item.data.name}</div>
            </Link>
            <div>{item.data.type}</div>
            <div>{item.data.price}</div>
          </div>
        ))}
    </div>
  );
}
