import React from 'react'

import {cookies} from 'next/headers'
import { parseCookies } from "nookies";


type Props = {}

const page = (props: Props) => {
    // const cookieStore = cookies()
    // const currentUser = cookieStore.get('currentUser')
    const cookies = parseCookies();
    const accessToken = cookies.accessToken;
    const currentUser = cookies.currentUser;

    console.log("Access Token:", accessToken);
    console.log("Current User:", currentUser);
  // Check if currentUser equals "admin"
  if (currentUser !== undefined && currentUser === "admin") {
    return <div>Only admin can see this</div>;
  } else {
    return <div>You are not authorized to view this page</div>;
  }
};

export default page