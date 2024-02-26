"use client";

import React, {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

interface Cart {
  id: string;
  data: {
    price: number | string;
    type: string;
    name: string;
    id: string;
  };
}

//responsible for managing the state of the cart
const useCartState = () => {
  const [cart, setCart] = useState<Cart[]>([]);
  return [cart, setCart] as const;
};

//creates the context
export const CartContext = createContext<ReturnType<
  typeof useCartState
> | null>(null);


//easy access to the cart in components
export const useCart = () => {
  const cart = React.useContext(CartContext);
  if (!cart) {
    throw new Error("useCart must be used within a cart provider");
  }
  return cart;
};

//provider to wrap components
const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<Cart[]>([]);

  return (
    <CartContext.Provider
      value={[cart, setCart] as [Cart[], Dispatch<SetStateAction<Cart[]>>]}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
