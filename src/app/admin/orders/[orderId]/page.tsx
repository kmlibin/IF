import { getOrderById } from "@/app/firebase/queries";

//keep interfaces in a separate file
interface OrderPageProps {
  params: {
    orderId: string;
  };
}

//fix typing so it's more specific
export default async function ProductPage(props: OrderPageProps) {
  const { params } = props;
  const orderId = params.orderId;
  const orderData = await getOrderById(orderId)
  
  if (!orderData.data) {
    return <div>No order found</div>;
  }
  const {
    PayPalPaymentId,
    PayPalemail,
    CustomerEmail,
    shipMethod,
    paidAt,
    CustomerName,
    hasShipped,
    tracking,
    orderTotal,
    CustomerAddress,
    products,
  } = orderData.data


  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Order Details</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex flex-wrap mb-4">
          <div className="w-full md:w-1/2">
            <p><span className="font-bold">PayPal Payment ID:</span> {PayPalPaymentId}</p>
            <p><span className="font-bold">Customer Email:</span> {PayPalemail}</p>
            <p><span className="font-bold">Customer Email:</span> {CustomerEmail}</p>
            <p><span className="font-bold">Shipping Method:</span> {shipMethod}</p>
            <p><span className="font-bold">Paid At:</span> {paidAt}</p>
          </div>
          <div className="w-full md:w-1/2">
            <p><span className="font-bold">Customer Name:</span> {CustomerName}</p>
            <p><span className="font-bold">Has Shipped:</span> {hasShipped ? "Yes" : "No"}</p>
            <p><span className="font-bold">Tracking:</span> {tracking}</p>
            <p><span className="font-bold">Order Total:</span> ${orderTotal}</p>
          </div>
        </div>
        <p><span className="font-bold">Customer Address:</span> {CustomerAddress}</p>
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Products</h2>
          {products.map((product: any, index: number) => (
            <div key={PayPalPaymentId} className="mb-2">
              <p><span className="font-bold">Product Name:</span> {product.data.name}</p>
              <p><span className="font-bold">Price:</span> ${product.data.price}</p>
              <p><span className="font-bold">Type:</span> {product.data.type}</p>
              <p><span className="font-bold">Quantity:</span> {product.quantity}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}



//keep interfaces in a separate file
// interface ProductPageProps {
//     params: {
//       id: string;
//     };
//   }

//   interface ProductData {
//     id: string;
//     data: {
//       price: number | string,
//       type: string,
//       name: string,
//       id: string,
//       quantity: number,
//       description: string
//     }
//   }

// //fix typing so it's more specific
// export default async function ProductPage(props: ProductPageProps) {
//   const { params } = props;
//   const productData = await getProductById(params.id);


  
//   // console.log(productData)
//   return (
//     <Product product={productData as ProductData} />
//   )
// }
