"use client";
import React, { useState, useEffect, createContext, useContext } from "react";
import { auth } from "@/app/firebase/config";

interface AuthState {
  user: {
    token: string,
    isAdmin: boolean
  };
  setUser: React.Dispatch<React.SetStateAction<any>>; // Function to set user state
}

export const AuthContext = createContext<AuthState | null>(null);

export const useAuth = () => {
  const authContext = useContext(AuthContext);
  return {
    user: authContext?.user,
    setUser: authContext?.setUser,
  };
};
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  console.log(user);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
    });

    return () => unsubscribe();
  }, []);

  const authState: AuthState = { user: user || {}, setUser: setUser || (() => {}) };

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
