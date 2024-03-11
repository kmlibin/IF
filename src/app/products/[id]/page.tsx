import { getProductById } from "@/app/firebase/queries";
import Product from "./Product";



//keep interfaces in a separate file
interface ProductPageProps {
    params: {
      id: string;
    };
  }

  interface ProductData {
    id: string;
    data: {
      price: number | string,
      type: string,
      name: string,
      id: string,
      quantity: number,
      description: string
    }
  }

//fix typing so it's more specific
export default async function ProductPage(props: ProductPageProps) {
  const { params } = props;
  const productData = await getProductById(params.id);


  
  // console.log(productData)
  return (
    <Product product={productData as ProductData} />
  )
}
