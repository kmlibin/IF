import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { cookies } from "next/headers";

export async function GET(req: NextRequest, res: NextResponse) {
  const cookieStore = cookies();
  try {
    // get token
    const token = cookieStore.get("token");
    console.log(token)
    // verify token on fb admin
    if(token) {
       const decodedToken = await getAuth().verifyIdToken(token.value); 
   
    

    // Check if the decoded token contains the necessary claims (e.g., isAdmin)
    if (decodedToken.admin === true) {
      // User is authorized to access the protected route
      return NextResponse.json({ status: 200 });
    } else {
      // User is not authorized; return an error response
      return NextResponse.json({ status: 401 });
    } }
  } catch (error) {
    // Handle any errors that occur during token verification
    console.error("Error verifying JWT token:", error);
    return NextResponse.json({ status: 500 });
  }
}
