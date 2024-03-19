import React from "react";
import { cookies } from "next/headers";
import { authUser } from "../actions";

type Props = {};

async function page(props: Props) {

  const result = await authUser();
 

  // Check if currentUser equals "admin"
  if (result == true) {
    return <div>Only admin can see this</div>;
  } else {
    return <div>You are not authorized to view this page</div>;
  }
}

export default page;
