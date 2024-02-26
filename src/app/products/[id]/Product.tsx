"use client";
import Image from "next/image";
import { useState } from "react";
import quilt from "../../../../public/quilt.jpg";
import { useCart } from "@/app/components/CartContext";

interface ProductData {
  id: string;
  data: {
    price: number | string;
    type: string;
    name: string;
    id: string;
  };
}

interface ProductProps {
  product: ProductData;
}

export default function Product({ product }: ProductProps) {
  const [cart, setCart] = useCart();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // const [cart, setCart] = useState<any>(null);
  console.log(product);


  //make sure the structures match to the cart context!
  const addToCart = () => {
    setCart((prevCart) => {
      if (!prevCart) {
        return [{ id: product.id, data: product.data }];
      } else {
        return [...prevCart, { id: product.id, data: product.data }];
      }
    });
  };
  const removeFromCart = () => {
    setCart((prevCart) => {
      if (!prevCart) {
        return [];
      } else {
        return prevCart.filter((item) => item.id !== product.id);
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
            <button onClick={addToCart}>Add to Cart</button>
            <button onClick={removeFromCart}>Remove From Cart</button>
          </div>
        </>
      )}
    </div>
  );
}
