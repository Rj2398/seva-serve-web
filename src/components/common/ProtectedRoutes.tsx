"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isTokenExpired } from "@/utils/token";
import toast from "react-hot-toast";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const redirectToLogin = (message: string) => {
      localStorage.removeItem("user");
      sessionStorage.clear();
      if (pathname !== "/") {
        toast.error(message);
      } else {
        console.log("please logIn.");
      }
      setTimeout(() => {
        router.replace("/");
      }, 1000);
    };

    const rawUser = localStorage.getItem("user");

    // User not logged in
    if (!rawUser) {
      redirectToLogin("Please log in to access this page.");
      return;
    }

    try {
      const user = JSON.parse(rawUser);

      const token =
        user?.access_token ||
        user?.data?.access_token ||
        user?.token;

      // Token missing
      if (!token) {
        redirectToLogin("Please log in to access this page.");
        return;
      }

      // Token expired
      if (isTokenExpired(token)) {
        redirectToLogin("Your session has expired. Please log in again.");
        return;
      }

      // Authorized
      setAuthorized(true);
    } catch (error) {
      redirectToLogin("Authentication failed. Please log in again.");
    }
  }, [router, pathname]);

  if (!authorized) {
    return null;
    // You can also return a loader here
    // return <div>Loading...</div>;
  }

  return <>{children}</>;
}