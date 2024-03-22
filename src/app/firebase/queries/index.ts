import { collection, getDocs, doc, getDoc } from "firebase/firestore/lite";
import { db } from "@/app/firebase/config";
import { CartItem } from "@/app/types";

interface Product {
  data: {
    images?: string[];
    name: string;
    quantity: number | string;
    price: number | string;
    keywords?: string[];
    type: string;
    isActive: boolean;
    description: string;
  };
}


interface Order {
  id: string,
  CustomerAddress: string,
  CustomerEmail: string,
  CustomerName: string,
  PayPalemail: string,
  PayPalPaymentId: string,
  hasShipped: boolean,
  orderTotal: number,
  paidAt: string,
  shipMethod: string,
  tracking: string,
  products: {
    data: {
      name: string,
      price: number,
      type: string
    }
    quantity: number
  }[]
}


//need to put these in try/catches
//run these from server components!
export async function getProducts() {
  const productCol = collection(db, "products");
  const productSnapshot = await getDocs(productCol);
  const productsList: { id: string; data: any }[] =
    productSnapshot.docs.map((doc) => ({
      id: doc.id,
      data: doc.data()
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

//validate prices, creates an object of key value pairs where key is id, value is price

export async function fetchPricesFromFirebase(cart: CartItem[]) {
  try {
    const prices: Record<string, number> = {};

    // Iterate over the items in the cart to fetch their prices
    for (const item of cart) {
      const itemId = item.id;
      const productDocRef = doc(db, "products", itemId);
      const productDocSnapshot = await getDoc(productDocRef);

      // check if the document exists and has a price field
      if (productDocSnapshot.exists()) {
        const price = productDocSnapshot.data()?.price;

        // add the price to the prices object
        if (price !== undefined) {
          prices[itemId] = price;
        } else {
          throw new Error(`Price not found for item ${itemId}`);
        }
      } else {
        throw new Error(`Item ${itemId} not found in the database`);
      }
    }

    return prices;
  } catch (err) {
    throw new Error ("Error fetching prices from database");
  }
}

export async function getOrders() {
  const ordersCol = collection(db, "orders");
  const ordersSnapshot = await getDocs(ordersCol);
  const ordersList: { id: string; data: any }[] =
    ordersSnapshot.docs.map((doc) => ({
      id: doc.id,
      data: doc.data(),
    }));
  // console.log(ordersList);
  return ordersList;
}


export async function getOrderById(
  orderId: string
): Promise<{ data: Order | undefined }> {
  // console.log(`in call ${id}`);
  const orderRef = doc(db, "orders", orderId);
  const orderSnapshot = await getDoc(orderRef);
  if (orderSnapshot) {
    const orderData = orderSnapshot.data() as Order;
    // console.log(productData);
    return { data: orderData };
  }

  return { data: undefined };
}