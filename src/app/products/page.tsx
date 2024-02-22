import ProductList from "./ProductList";
import { collection, getDocs } from "firebase/firestore/lite";
import { db } from "@/app/firebase/config";

interface Product {
  name: string;
  type: string;
  price: number;
}
export default async function Products() {
  const productCol = collection(db, "products");
  const productSnapshot = await getDocs(productCol);
  const productsList: Product[] = productSnapshot.docs.map(
    (doc) => doc.data() as Product
  );
  console.log(productsList);

  return <ProductList products={productsList} />;
}
