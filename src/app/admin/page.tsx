import React from "react";
import { cookies } from "next/headers";

type Props = {};

async function page(props: Props) {
  let auth = "false";
  const fetchData = async () => {
    const cookieStore = cookies();
    const token = cookieStore.get("token");

    try {
      const res = await fetch("http://localhost:3000/api/auth", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Include the cookie in the request headers
          "Set-Cookie": `${token?.value}`,
        },
      });
      console.log(res.status);
      if (res.status == 200) {
      
        auth = "true";
        console.log(`auth = ${auth}`)
      } else {
        auth = "false";
      }
    } catch (err) {
      console.log(err);
    }
  };
  fetchData();

  // Check if currentUser equals "admin"
  if (auth === "true") {
    return <div>Only admin can see this</div>;
  } else {
    return <div>You are not authorized to view this page</div>;
  }
}

export default page;
