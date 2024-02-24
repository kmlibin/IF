'use client'
import Image from "next/image";
import { useState } from "react";
import quilt from '../../../../public/quilt.jpg'

interface ProductData {
  id: string;
  data: {
    price: number | string,
    type: string,
    name: string,
    id: string
  }
}

interface ProductProps {
  product: ProductData
}

export default function Product({product} : ProductProps) {
  console.log(product)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [cart, setCart] = useState<any>(null);
  
    const addToCart = (productData: ProductProps) => {
      //need to check if prev exists, because if it doesn't it throws an error because it isn't iterable.
      setCart((prev: ProductProps[] | null) => {
        if (!prev) {
          return [productData];
        } else {
          return [...prev, productData];
        }
      });
    };
  
    console.log(cart);
  
    return (
      <div>
        {loading && <p>Loading...</p>}
        {error && <p>Error fetching product data.</p>}
        {product && (
          <>
            <div>
              <Image src={quilt} alt="quilt" height={200} width={200} />
              <p>{product.data.name}</p>
              <p>{product.data.price}</p>
              <button onClick={() => addToCart({product})}>Add to Cart</button>
            </div>
          </>
        )}
      </div>
    );
  }
  