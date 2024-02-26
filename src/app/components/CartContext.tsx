"use client";

import React, {
  createContext,
  useState,
  useContext,
  useReducer,
} from "react";

interface CartItem {
  id: string;
  data: {
    price: number | string;
    type: string;
    name: string;
    id: string;
  };
}

type Action =
  | { type: "ADD_TO_CART"; payload: CartItem }
  | { type: "REMOVE_FROM_CART"; payload: string }; // assuming payload is the ID of the item to remove

interface CartState {
  cart: CartItem[];
}

const initialCartState: CartState = {
  cart: [],
};

const cartReducer = (state: CartState, action: Action): CartState => {
  switch (action.type) {
    case "ADD_TO_CART":
      return {
        ...state,
        cart: [...state.cart, action.payload],
      };
    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload),
      };
    default:
      return state;
  }
};

export const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialCartState,
  dispatch: () => null,
});

export const useCart = () => {
  return useContext(CartContext);
};

const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;