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
  const { state, dispatch } = useCart();


  // const [cart, setCart] = useState<any>(null);
  console.log(product);

  const addToCart = () => {
    dispatch({ type: "ADD_TO_CART", payload: { id: product.id, data: product.data } });
  };

  const removeFromCart = () => {
    dispatch({ type: "REMOVE_FROM_CART", payload: product.id });
  };

  console.log(state);

  return (
    <div>

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
