import { signInWithEmailAndPassword } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore/lite";
import { db } from "@/app/firebase/config";
import { auth } from "@/app/firebase/config";
import { initializeAdminApp } from "../../firebase/firebaseAdmin";

import { NextRequest, NextResponse } from "next/server";

import { getAuth } from "firebase-admin/auth";

export async function POST(req: NextRequest, res: NextResponse) {
  //neex to use firebase admin
  initializeAdminApp();

  const body = await req.json();
  const { email, password } = body;

  //maybe put signinwith email and pass in its own try catch...? is that a thing?
  try {

    //seems to always trip the catch block if credentials don't work...
    await signInWithEmailAndPassword(auth, email, password);

    // after successful login, get the user's uid and use that to look them up in user collection
    if (auth.currentUser) {
      const uid = auth.currentUser.uid;
      const userDoc = await getDoc(doc(db, "users", uid));

      //providing that user exists, look them up to see if they are admin
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.isAdmin) {
          //generate a token
          const token = await auth.currentUser.getIdToken();
          //set custom claims, which are then attached to the user object in firebase admin (admin true)
          await getAuth()
            .setCustomUserClaims(uid, { admin: true })
            .then(() => {
              console.log("custom claims set!");
            });
          //pass the token as a secure cookie to the frontend...also lock out with urls, look up
          const cookieOptions = `token=${token}; Max-Age=86400; Path=/; Secure; HttpOnly; SameSite=Strict`;
          //send a status 200 upon success,a lso set the cookie
          return new Response("Response", {
            status: 200,
            headers: { "Set-Cookie": cookieOptions },
          });
        }
      }
    } else {
      console.log('this was tripped')
      return Response.json(
        { error: "Please provide valid credentials" },
        { status: 401 }
      );
    }
  } catch (err) {
    console.log(err)
    console.log('the final block was tripped')
    return Response.json(
      { error: "Internal Error" },
      { status: 500 }
    );
  }
}
