"use client"
import React, { useState, useEffect, createContext, useContext } from "react";
import { auth } from "@/app/firebase/config";

export const AuthContext = createContext<any>(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any>(null);
  
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((authUser) => {
        setUser(authUser);
      });
  
      return () => unsubscribe();
    }, []);
  
    return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
  };
  

  export default AuthProvider;