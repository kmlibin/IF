import { Auth, signInWithEmailAndPassword } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore/lite";
import { db } from "@/app/firebase/config";
import { auth } from "@/app/firebase/config";
import { initializeAdminApp } from "../../firebase/firebaseAdmin";
import { cookies } from "next/headers";
import { setCookie } from "nookies";
import nookies from "nookies";
import { NextRequest, NextResponse } from "next/server";
import { NextApiResponse } from "next";
import { getAuth } from "firebase-admin/auth";

export async function POST(req: NextRequest, res: NextResponse) {
  initializeAdminApp();
  const cookieStore = cookies();
  const body = await req.json();
  const { email, password } = body;

  try {
    const response = await signInWithEmailAndPassword(auth, email, password);
    let admin = false;

    // After successful login, get the user's information from the users collection
    if (auth.currentUser) {
      const uid = auth.currentUser.uid;
      const userDoc = await getDoc(doc(db, "users", uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.isAdmin) {
          admin = true;
          // const customClaims = { admin: true };
          //  custom token for the user
          // const customToken = await getAuth().createCustomToken(uid)
          // console.log(customToken)
          // const customToken = await getAuth().createCustomToken(
          //   uid,
          //   customClaims
          // );
          // console.log(`customToken = ${customToken}`);
          const token = await auth.currentUser.getIdToken();
          await getAuth()
            .setCustomUserClaims(uid, { admin: true })
            .then(() => {
              console.log("custom claims set!");
            });
          // Store auth token and set cookies

          const cookieOptions = `token=${token}; Max-Age=86400; Path=/; Secure; HttpOnly; SameSite=Strict`;

          return new Response("Hello, Next.js!", {
            status: 200,
            headers: { "Set-Cookie": cookieOptions },
          });
        }
      }
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ err });
  }
}

// interface StoreTokenRequest {
//   token: string;
//   admin: string;
// }

// export async function storeToken(request: StoreTokenRequest) {
//   const cookieStore = cookies()
//   await cookieStore.set(null, 'fromGetInitialProps', request.token, {
//     maxAge: 30 * 24 * 60 * 60,
//     path: '/',
//   })
//   nookies.set(null, 'fromGetInitialProps2', request.admin, {
//     maxAge: 30 * 24 * 60 * 60,
//     path: '/',
//   })
// }

// export async function login(email: string, password: string) {
//   try {
//     const response = await signInWithEmailAndPassword(auth, email, password);
//     let admin;
//     //after successful login, get the users information from the users collection, stored by uid
//     console.log(`currentUser : ${auth.currentUser}`);
//     if (auth.currentUser) {
//       const uid = auth.currentUser.uid;
//       const userDoc = await getDoc(doc(db, "users", uid));

//       if (userDoc.exists()) {
//         const userData = userDoc.data();

//         //set admin to true so can return to frontend
//         if (userData.isAdmin) {
//           admin = true;
//         }
//       }

//       // store auth token and store it in local storage
//       const token = await auth.currentUser.getIdToken();

//       storeToken({token: uid, admin: "admin"});
//       return { token, admin };
//     }
//     console.log("Login success!");
//   } catch (error: any) {
//     console.log("Login failed:", error.message);
//     return error.message;
//   }
// }
