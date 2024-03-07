'use server'
import { collection, getDocs, doc, getDoc } from "firebase/firestore/lite";
import { db } from "@/app/firebase/config";

interface Product {
  name: string;
  type: string;
  price: number;
}

//need to put these in try/catches

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

export async function getProductById(id: string): Promise<{ id: string; data: Product | undefined }> {
  // console.log(`in call ${id}`);
  const productRef = doc(db, "products", id);
  const productSnapshot = await getDoc(productRef);
  if (productSnapshot) {
    const productData = productSnapshot.data() as Product;
    // console.log(productData);
    return { id: productSnapshot.id, data: productData };
  }

  return { id: '', data: undefined }
}

export const handleAddressValidation = async (userAddress: any) => {
  const cleanedAddress = userAddress.replace(/,/g, "");
  console.log(cleanedAddress)
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        cleanedAddress
      )}&key=${process.env.GOOGLE_API_KEY}`
    );

    if (response.ok) {
      const data = await response.json();

      if (data.results.length > 0) {
        let formattedAddress = data.results[0].formatted_address;
        return formattedAddress
      }
    } else {
      console.error("Error validating address:", response.statusText);
    }
  } catch (error) {
    console.error("Error validating address:", error);
  }
};

