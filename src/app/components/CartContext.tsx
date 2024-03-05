"use client";

import { revalidatePath } from "next/cache";
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
  | { type: "REMOVE_FROM_CART"; payload: CartItem }
  | { type: "HYDRATE_CART"; payload: CartState };

interface CartState {
  cart: CartItem[];
  subtotal: number;
}

//set init state
const initialCartState: CartState = {
  cart: [],
  subtotal: 0,
};

//create reducers
const cartReducer = (state: CartState, action: Action): CartState => {
  switch (action.type) {
    case "ADD_TO_CART":
      const updatedCart = [...state.cart, action.payload];
      const updatedSubtotal = updatedCart.reduce(
        (total, item) => total + Number(item.data.price),
        0
      );
      const newCartState = {
        ...state,
        cart: updatedCart,
        subtotal: updatedSubtotal,
      };
      localStorage.setItem("cart", JSON.stringify(newCartState));
      return newCartState;

    case "REMOVE_FROM_CART":
      const removedItem = state.cart.find((item) => item.id === action.payload.id);
      // item not found, return current state
      if (!removedItem) return state;
      const updatedSubtotalRemove =
        state.subtotal - Number(removedItem.data.price);
      const updatedCartRemove = state.cart.filter(
        (item) => item.id !== action.payload.id
      );
      const newCartStateRemove = {
        ...state,
        cart: updatedCartRemove,
        subtotal: updatedSubtotalRemove,
      };
      localStorage.setItem("cart", JSON.stringify(newCartStateRemove));
 
      return newCartStateRemove;

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
