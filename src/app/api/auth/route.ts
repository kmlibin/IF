import { NextRequest, NextResponse } from "next/server";

import { getAuth} from "firebase-admin/auth";
import { signInWithCustomToken } from "firebase/auth";
import { cookies } from "next/headers";
import {auth} from '../../firebase/config'
import {initializeAdminApp} from '../../firebase/firebaseAdmin';

export async function GET(req: NextRequest, res: NextResponse) { 
  initializeAdminApp()
  console.log(req.headers.getSetCookie())



  // console.log(cookieStore)
  // const body = await req.json()
  // console.log(req.cookies)
const token = req.headers.getSetCookie()
    console.log(`token = ${token}`)
 
  try {
    // console.log(body)
    // get token
    
    // verify token on fb admin
    if(token) {

    //  const sign = await signInWithCustomToken(auth, token.toString())
    //  console.log(`sign = ${sign}`)
       const decodedToken = await getAuth().verifyIdToken(token.toString()); 

   console.log(`decodedToken=${decodedToken}`)
    

    // Check if the decoded token contains the necessary claims (e.g., isAdmin)
    if (decodedToken) {
      console.log('has admin')
      // User is authorized to access the protected route
      return NextResponse.json({ error: 'success' }, { status: 200 })
    } else {
      console.log('no admin')
      // User is not authorized; return an error response
      return NextResponse.json({ error: 'failure' }, { status: 403 })
    } }
  } catch (error) {
    // Handle any errors that occur during token verification
    console.error("Error verifying JWT token:", error);
    return NextResponse.json({ error: 'failure' }, { status: 500 })
  }
}
