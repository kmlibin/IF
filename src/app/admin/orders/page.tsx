
import React from "react";
import { getOrders } from "@/app/firebase/queries";
import Link from "next/link";

export default async function OrdersList() {
  const orders = await getOrders();

  return (
    <div className="flex w-full gap-4 justify-center items-center min-h-[70vh]">
      {orders.map((order) => (
        <div className="flex flex-col">
           <Link href={`/admin/orders/${order.id}`}>
              <div>{order.id}</div>
            </Link>
          <p>{order.data.shipMethod}</p>
          <p>{order.data.CustomerEmail}</p>
          {order.data.products.map((product: any) => (
            
          < div key={product.id}>

            <p>{product.quantity}</p>
            
            <p>{product.data.name}</p>
            <p>{product.data.price}</p>
          </div>
        ))}
        </div>
      ))}
    </div>
  );
}
