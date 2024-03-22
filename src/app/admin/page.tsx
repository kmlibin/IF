import React from "react";
import { cookies } from "next/headers";
import { authUser } from "../actions";
import { getOrders, getProducts} from "../firebase/queries";
import Link from "next/link";
import AdminProductCards from "./components/AdminProductCards";

interface Product {
  id: string;
  data: {
    images?: string[];
    name: string;
    quantity: number | string;
    price: number | string;
    keywords?: string[];
    type: string;
    isActive: boolean;
    description: string;
  };
}

interface Order {
  id: string;
  data: {
    CustomerAddress: string;
    CustomerEmail: string;
    CustomerName: string;
    PayPalemail: string;
    PayPalPaymentId: string;
    hasShipped: boolean;
    orderTotal: number;
    paidAt: string;
    shipMethod: string;
    tracking: string;
    products: {
      data: {
        name: string;
        price: number;
        type: string;
      };
      quantity: number;
    }[];
  };
}

type Props = {};

async function Dashboard(props: Props) {
  const result = await authUser();

  // Check if currentUser equals "admin"
  if (result?.auth === false) {
    return <div>Not allowed to see this!</div>;
  }

  const products: Product[] = await getProducts();
  const orders: Order[] = await getOrders();

  // console.log(products);

 

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

      {/* Orders */}
      <div className="flex flex-wrap mb-8">
        {orders.map((order) => (
          <div key={order.id} className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 p-4">
            <div className="border rounded-lg p-4">
              <p>Date: {order.data.paidAt}</p>
              <p>Customer Name: {order.data.CustomerName}</p>
              <p>Order Total: ${order.data.orderTotal.toFixed(2)}</p>
              <p>Shipped: {order.data.hasShipped ? "Yes" : "No"}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Products */}
     <AdminProductCards products={products}/>
    </div>
  );
}

export default Dashboard;
