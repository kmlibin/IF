"use client";
import { useState } from "react";
import { login } from "../actions";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, setUser } = useAuth();
  const router = useRouter();

  console.log(user); // Check if user is logged
  console.log(setUser); // Check if setUser is defined
  
  const handleSignIn = async () => {
    try {
      const { token, admin } = await login(email, password);
      if (admin) {
        localStorage.setItem("isAdmin", "true");
      }

      localStorage.setItem("userToken", token);
      setUser && setUser({ token, isAdmin: admin });
      setEmail("");
      setPassword("");
      router.push("/");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-96">
        <h1 className="text-white text-2xl mb-5">Sign In</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
        />
        <button
          onClick={handleSignIn}
          className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500"
        >
          Sign In
        </button>
      </div>
    </div>
  );
};

export default SignIn;
