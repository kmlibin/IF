import React from "react";
import Image from "next/image";
import quilt from "../../../public/quilt.jpg";
import Link from "next/link";
import { getProducts } from "../actions";


export default async function ProductList() {
  const products = await getProducts();

  return (
    <div className="flex w-full gap-4 justify-center items-center min-h-[70vh]">
      {products &&
        products.map((item: any) => (
          <div key={item.price} className="w-1/4 flex flex-col">
            <Image src={quilt} alt="quilt" />
            <Link href={`/products/${item.id}`}>
              <div>{item.name}</div>
            </Link>
            <div>{item.type}</div>
            <div>{item.price}</div>
          </div>
        ))}
    </div>
  );
}
