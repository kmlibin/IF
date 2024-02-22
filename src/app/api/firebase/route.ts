import { NextRequest, NextResponse } from "next/server";
import { collection, getDocs } from "firebase/firestore/lite";
import { db } from "@/app/firebase/config";


export async function GET(req: NextRequest, res:NextResponse) {
    const productCol = collection(db, "products");
    const productSnapshot = await getDocs(productCol);
 
    const productsList = productSnapshot.docs.map((doc) => doc.data());
    console.log(productsList);

    return NextResponse.json(productsList);

}
