"use client";
import Image from "next/image";
import { useState } from "react";
import quilt from "../../../../public/quilt.jpg";
import { useCart } from "@/app/components/CartContext";
import { ProductData } from "@/app/types";


interface ProductProps {
  product: ProductData;
}

export default function Product({ product }: ProductProps) {
  const { state, dispatch } = useCart();
  const [selectedQty, setSelectedQty] = useState(1)

  // const [cart, setCart] = useState<any>(null);
  console.log(product);
  console.log(state)

  const addToCart = () => {
    dispatch({
      type: "ADD_TO_CART",
      payload: { id: product.id, data: {name: product.data.name, type: product.data.type, price: product.data.price}, quantity: selectedQty },
    });
  };

  const removeFromCart = () => {
    dispatch({
      type: "REMOVE_FROM_CART",
      payload: { id: product.id, data: product.data, quantity: 0 },
    });
  };

  //set up how many of an item are available...qty is set in backend
  const setQuantity = [];
  for (let i = 1; i <= product.data.quantity; i++) {
    setQuantity.push(<option key={i} value={i}>{i}</option>)
  }
  
console.log(selectedQty)
  return (
    <div>
      {product && (
        <>
          <div>
            <Image src={quilt} alt="quilt" height={200} width={200} />
            <p>{product.data.name}</p>
            <p>{product.data.description}</p>
            <p>{product.data.price}</p>
            <select
              value={selectedQty}
              onChange={(e) => setSelectedQty(Number(e.target.value))}
            >
              {setQuantity}
            </select>
            <button onClick={addToCart}>Add to Cart</button>
            <button onClick={removeFromCart}>Remove From Cart</button>
          </div>
        </>
      )}
    </div>
  );
}
