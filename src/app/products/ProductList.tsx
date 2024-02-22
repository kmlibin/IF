import React from 'react'

interface ProductListProps {
    products: {
        name: string,
        type: string,
        price: number
    }[]
}
const ProductList = ({products}: ProductListProps) => {
  return (
    <div className="flex w-full">
      {products &&
        products.map((item: any) => (
          <div key={item.price} className="w-1/4 flex flex-col">
            <div>{item.name}</div>
            <div>{item.type}</div>
            <div>{item.price}</div>
          </div>
        ))}
      <div>home</div>
    </div>
  )
}

export default ProductList