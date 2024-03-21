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

  // console.log(productData)
  return <div>{orderId}</div>;
}
