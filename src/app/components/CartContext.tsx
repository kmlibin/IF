"use client";

import React, { createContext, useContext, useReducer } from "react";
import { useEffect } from "react";
import { CartItem, ContactInfo } from "../types";

interface CartState {
  cart: CartItem[];
  subtotal: number;
  contactInfo: ContactInfo;
}
//declare actions
type Action =
  | { type: "ADD_TO_CART"; payload: CartItem }
  | { type: "REMOVE_FROM_CART"; payload: CartItem }
  | { type: "HYDRATE_CART"; payload: CartState }
  | { type: "UPDATE_INFO"; payload: ContactInfo }
  | { type: "CLEAR_INFO" }
  | { type: "CLEAR_CART" };

//set init state
const initialCartState: CartState = {
  cart: [],
  subtotal: 0,
  contactInfo: { name: "", email: "", address: "" },
};

//create reducers
const cartReducer = (state: CartState, action: Action): CartState => {
  switch (action.type) {
    case "ADD_TO_CART":
      //FIRST check if the item is already in the cart. if so, find and update the quantity
      const existingItem = state.cart.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        // If the item exists, update its quantity
        const updatedCart = state.cart.map((item) => {
          if (item.id === existingItem.id) {
            //return the item, but adjust quantity
            return {
              ...item,
              quantity: action.payload.quantity,
            };
          } else {
            return item;
          }
        });

        //make sure the quantity of each item is reflected in the subtotal
        const updatedSubtotal = updatedCart.reduce(
          (total, item) => total + Number(item.data.price) * item.quantity,
          0
        );

        const newCartState = {
          ...state,
          cart: updatedCart,
          subtotal: updatedSubtotal,
        };
        localStorage.setItem("cart", JSON.stringify(newCartState));
        return newCartState;
      } else {
        // SECOND if item does not exist in cart, add it to the cart
        const updatedCart = [
          ...state.cart,
          { ...action.payload, quantity: action.payload.quantity },
        ];

        const updatedSubtotal = updatedCart.reduce(
          (total, item) => total + Number(item.data.price) * item.quantity,
          0
        );
        const newCartState = {
          ...state,
          cart: updatedCart,
          subtotal: updatedSubtotal,
        };
        localStorage.setItem("cart", JSON.stringify(newCartState));
        return newCartState;
      }

    case "REMOVE_FROM_CART":
      //grab item to be removed
      const removedItemId = action.payload.id;

      // item not found, return current state
      if (!removedItemId) return state;

      //filter out item that needs to be removed
      const updatedCartRemove = state.cart.filter(
        (item) => item.id !== removedItemId
      );

      // calculate the new subtotal
      const updatedSubtotalRemove = updatedCartRemove.reduce(
        (total, item) => total + Number(item.data.price) * item.quantity,
        0
      );

      const newCartStateRemove = {
        ...state,
        cart: updatedCartRemove,
        subtotal: updatedSubtotalRemove,
      };
      localStorage.setItem("cart", JSON.stringify(newCartStateRemove));

      return newCartStateRemove;

    case "UPDATE_INFO":
      return { ...state, contactInfo: action.payload };

    case "CLEAR_CART":
      localStorage.removeItem("cart");
      return { ...state, cart: [] };

    case "CLEAR_INFO":
      localStorage.removeItem("contactInfo");
      return { ...state, contactInfo: { name: "", email: "", address: "" } };

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
