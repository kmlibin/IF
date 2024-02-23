import { collection, getDocs } from "firebase/firestore/lite";
import { db } from "@/app/firebase/config";

interface Product {
    name: string;
    type: string;
    price: number;
  }

 export async function getProducts() {
    const productCol = collection(db, "products");
    const productSnapshot = await getDocs(productCol);
    const productsList: { id: string; data: Product }[] = productSnapshot.docs.map(
      (doc) => ({ id: doc.id, data: doc.data() as Product })
    );
    console.log(productsList)
    return productsList
}
