import React from "react";
import Image from "next/image";
import quilt from "../../../public/quilt.jpg";
import Link from "next/link";
import { getProducts } from "../firebase/queries";

interface Product {
  name: string;
  type: string;
  price: number;
}

export default async function ProductList() {
  const products = await getProducts();

  console.log(products);
  return (
    <div className="flex w-full gap-4 justify-center items-center min-h-[70vh]">
      {products &&
        products.map((item: { id: string; data: Product }) => (
          <div key={item.id} className="w-1/4 flex flex-col">
            <Image src={quilt} alt="quilt" height={300} width={300} />
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
