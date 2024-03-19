import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { initializeAdminApp } from "../../firebase/firebaseAdmin";

//this function authorizes a user to view certain pages based on firebase admin. on login, i set a token for that user and custom claims for that user
//custcom claims are stored by their uid. token stored as a cookie, connects their session to their user profile. i get the cookie,
//check that the cookie (token) is valid, then use that uid assoc with that token to see if there are any claims associated with the user.
//i return true or false, which sends back to server action as 200 or 403


//seems like whenver there is any error from firebase, it just defaults to the catch block, bypassing my errors.  hmm. 
export async function GET(req: NextRequest, res: NextResponse) {
  initializeAdminApp();

  const token = req.headers.getSetCookie();
  console.log(`token = ${token}`);

  try {
    if (token) {
      //check that the token is valid (remember, token has uid and claims), then with the uid you can check the claims on the user uid. make sure admin is true
      const authorized = await getAuth()
        .verifyIdToken(token.toString())
        .then((claims) => {
          console.log(claims);
          if (claims.admin === true) {
            return true;
          }
          return false;
        });

      console.log(`decodedToken=${authorized}`);

      //if user is authorized, send a 200 that SA and frontend uses to determine if user is authed
      if (authorized === true) {
        return NextResponse.json({ message: "success" }, { status: 200 });
      } else {
        return NextResponse.json({ error: "failure" }, { status: 403 });
      }
    }
  } catch (error) {
    // for errors that occur during token verification
    console.error("Error verifying JWT token:", error);
    return NextResponse.json({ error: "failure" }, { status: 500 });
  }
}
