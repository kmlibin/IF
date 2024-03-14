import Product from "../products/[id]/Product";
import { useCart } from "../../context/CartContext";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { createOrder, payOrder } from "../actions";

export default function Cart() {
  return (
    <>
      <div>checkout page</div>
    </>
  );
}
