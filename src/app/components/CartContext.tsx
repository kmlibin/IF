"use client";

import React, { createContext, useContext, useReducer } from "react";
import { useEffect } from "react";

interface CartItem {
  id: string;
  data: {
    price: number | string;
    type: string;
    name: string;
    id: string;
  };
}

//declare actions
type Action =
  | { type: "ADD_TO_CART"; payload: CartItem }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | { type: "HYDRATE_CART"; payload: CartState };

interface CartState {
  cart: CartItem[];
}

//set init state
const initialCartState: CartState = {
  cart: [],
};

//create reducers
const cartReducer = (state: CartState, action: Action): CartState => {
  switch (action.type) {
    case "ADD_TO_CART":
      const newCart = {
        ...state,
        cart: [...state.cart, action.payload],
      };
      localStorage.setItem("cart", JSON.stringify(newCart));
      return newCart;
    case "REMOVE_FROM_CART":
      const removedCart = {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload),
      };
      localStorage.setItem("cart", JSON.stringify(removedCart));
      return removedCart;

    case "HYDRATE_CART":
      return action.payload;
    default:
      return state;
  }
};

//create the context
export const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialCartState,
  dispatch: () => null,
});

//get access to cartin components
export const useCart = () => {
  return useContext(CartContext);
};

//provider to wrap components
const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);

  //check for local storage to set local state
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      dispatch({ type: "HYDRATE_CART", payload: JSON.parse(storedCart) });
    }
  }, []);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
