import React from 'react'
import Image from 'next/image'
import quilt from '../../../public/quilt.jpg'

interface ProductListProps {
    products: {
        name: string,
        type: string,
        price: number
    }[]
}
const ProductList = ({products}: ProductListProps) => {
  return (
    <div className="flex w-full gap-4 justify-center items-center min-h-[70vh]">
      {products &&
        products.map((item: any) => (
          <div key={item.price} className="w-1/4 flex flex-col">
            <Image src={quilt} alt="quilt"/>
            <div>{item.name}</div>
            <div>{item.type}</div>
            <div>{item.price}</div>
          </div>
        ))}
    </div>
  )
}

export default ProductList