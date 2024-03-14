'use client'
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";

export default function isAuth(Component: any) {
  return function IsAuth(props: any) {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
      // see if user is authenticated and admin
      if (!user || !user.isAdmin) {
        // redirect if not
        router.push("/");
      }
    }, [user, router]);

    return user && user.isAdmin ? <Component {...props} /> : null;
  };
}