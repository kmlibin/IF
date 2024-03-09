import { collection, getDocs, doc, getDoc } from "firebase/firestore/lite";
import { db } from "@/app/firebase/config";

interface Product {
  name: string;
  type: string;
  price: number;
}
//RIGHT NOW HANDLE ADDRESS VAIDATION WONT WORK UNLESS YOU PUT USE SERVER AT THE TOP. FIGURE OUT WHERE TO CALL THIS
//need to put these in try/catches
//run these from server components!
export async function getProducts() {
  const productCol = collection(db, "products");
  const productSnapshot = await getDocs(productCol);
  const productsList: { id: string; data: Product }[] =
    productSnapshot.docs.map((doc) => ({
      id: doc.id,
      data: doc.data() as Product,
    }));
  // console.log(productsList);
  return productsList;
}

export async function getProductById(
  id: string
): Promise<{ id: string; data: Product | undefined }> {
  // console.log(`in call ${id}`);
  const productRef = doc(db, "products", id);
  const productSnapshot = await getDoc(productRef);
  if (productSnapshot) {
    const productData = productSnapshot.data() as Product;
    // console.log(productData);
    return { id: productSnapshot.id, data: productData };
  }

  return { id: "", data: undefined };
}

