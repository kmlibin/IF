'use client'
import React from 'react'
import Link from 'next/link'
import { deleteProduct } from '@/app/actions'
import Image from 'next/image'

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

type AdminProductCardsProps = {
    products: Product[]
}

const AdminProductCards = ({products}: AdminProductCardsProps) => {

  const handleDelete = async(id: string) => {
    const deleteResponse = await deleteProduct(id)
  }
  return (
    <div className="flex flex-wrap -mx-4">
    {products.map((product) => (
      <div
        key={product.id}
        className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 px-4 mb-8"
      >
        <div className="border rounded-lg overflow-hidden">
          {product.data.images && product.data.images.length > 0 ? (
            <img
              src={product.data.images[0]}
              alt={product.data.name}
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="w-full h-48 bg-gray-200"></div>
          )}
          <div className="p-4">
            <h2 className="text-lg font-semibold">{product.data.name}</h2>
            {/* <p>Quantity: {product.data.quantity}</p> */}
            <p>Price: ${product.data.price}</p>
            <div className="mt-4 flex justify-between">
              <Link
                href={`/admin/${product.id}/edit`}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
              >
                Edit
              </Link>
              <button className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg" onClick={() => handleDelete(product.id)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
  )
}

export default AdminProductCards