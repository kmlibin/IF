import Product from "../products/[id]/Product";
import { useCart } from "../components/CartContext";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { createOrder, payOrder } from "../actions";
import CartPay from "./CartPay";

export default function Cart() {
    //maybe put this on server and pass as a prop?
  const client = process.env.PAYPAL_CLIENT_ID || "";
  console.log(client) //logs on the server, not on the client

  const initialOptions = {
    clientId: client,
    currency: "USD",
    intent: "capture",
  };

  //   function createOrder(data, actions) {
  //     return fetch("/api/createOrder", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         amount: YOUR_AMOUNT,
  //         currency: YOUR_CURRENCY,
  //       }),
  //     })
  //       .then((res) => res.json())
  //       .then((data) => data.orderID);
  //   }


  return (
    <CartPay initialOptions={initialOptions}/>
    // <PayPalScriptProvider options={initialOptions}>
    //   <div>
    //     {cart.map((item) => (
    //       <Product key={item.id} product={item} />
    //     ))}
    //   </div>
    //   <div>
    //     <PayPalButtons
    //       createOrder={async (data, actions) => {
    //         let response = await createOrder();
    //         if (response.success === "true") {
    //           return response.orderId; // Return orderId if createOrder was successful
    //         } else {
    //           // Handle error from createOrder function
    //           console.error("Error creating order:", response.error);
    //           return undefined; // Return undefined if createOrder failed
    //         }
    //       }}
    //       onApprove={async (data, actions) => {
    //         let response = await payOrder(data.orderID);
    //         if (response && response.success === "true") {
    //           // Handle successful payment
    //           console.log("Payment successful");
    //         } else {
    //           // Handle payment failure
    //           console.error("Payment failed:", response.error);
    //         }
    //       }}
    //     />
    //   </div>
    // </PayPalScriptProvider>
  );
}
