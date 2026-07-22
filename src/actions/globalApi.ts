// "use client"
import { isTokenExpired } from "@/utils/token";
import { redirect } from "next/navigation";
import { toast } from "react-hot-toast";

export const BASE_URL = "https://seva.tgastaging.com/api/v1/";

interface ApiOptions {
  endpoint: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  payload?: unknown; // Changed from 'any' to 'unknown' for better type safety
  isFormData?: boolean;
}

/**
 * Helper to force logout the user immediately
 */
const forceLogoutClient = () => {
  // console.log("window", window)
  // if (typeof window !== "undefined") {
  console.log("window", window)
  // sessionStorage.clear();
  localStorage.removeItem('user')
  localStorage.removeItem('autoLocation')
  localStorage.removeItem('homeUserData')
  localStorage.removeItem('isLoggedIn')
  localStorage.clear();
  document.cookie =
    "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; Secure";
  window.dispatchEvent(new Event("loginStatusChanged"));
  window.location.href = "/";
  // } else {
  //   redirect("/");
  // }
};

/**
 * Global API request handler that automatically manages Authorization headers.
 * Works on both client-side (using localStorage) and server-side (using cookies).
 */
export async function globalServerRequest({
  endpoint,
  method = "GET",
  payload = null,
  isFormData = false,
}: ApiOptions) {
  try {
    let targetUrl = `${BASE_URL}${endpoint}`;
    const headers = new Headers();

    // 0. Append payload to URL for GET requests
    if (payload && method === "GET") {
      const searchParams = new URLSearchParams();
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        targetUrl += targetUrl.includes("?")
          ? `&${queryString}`
          : `?${queryString}`;
      }
    }

    let token: string | null | undefined = null;

    // 1. Environment-aware Token Retrieval
    if (typeof window !== "undefined") {
      // --- Client Side ---
      const rawUser = localStorage.getItem("user");
      if (rawUser) {
        try {
          const userObj = JSON.parse(rawUser);
          token =
            userObj?.access_token ||
            userObj?.data?.access_token ||
            userObj?.token;
        } catch (e) {
          console.error("Failed to parse user from localStorage", e);
        }
      }
    } else {
      // --- Server Side ---
      try {
        const nextHeaders = await import("next/headers");
        // NOTE: If using Next.js 13/14, change this to: const cookieStore = nextHeaders.cookies();
        const cookieStore = await nextHeaders.cookies();
        token = cookieStore.get("auth_token")?.value;
      } catch (e) {
        console.warn(
          "Could not access cookies on server side context (expected during static builds)."
        );
      }
    }

    // if (token) {
    //   headers.set("Authorization", `Bearer ${token}`);
    // }

    if (token) {
      if (typeof window !== "undefined" && isTokenExpired(token)) {
        localStorage.removeItem("user");
        sessionStorage.clear();

        window.location.href = "/";

        return {
          success: false,
          error: "Token expired",

        }

        toast.error("Session expired. Please log in again.");
      }

      headers.set("Authorization", `Bearer ${token}`);
    }

    // 2. Content-Type Header
    if (!isFormData) {
      headers.set("Content-Type", "application/json");
    }

    // 3. Configure fetch options
    const fetchOptions: RequestInit = {
      method,
      headers,
      cache: "no-store",
    };

    if (payload && method !== "GET") {
      fetchOptions.body = isFormData
        ? (payload as BodyInit)
        : JSON.stringify(payload);
    }

    // DEBUG: Log headers to verify token is present
    console.log(`[API Request] ${method} ${targetUrl}`, {
      headers: Object.fromEntries(headers.entries()),
    });

    // 4. Execute Request
    const response = await fetch(targetUrl, fetchOptions);
    console.log("response targetUrl", response)
    // Handle cases where response might not be JSON (e.g., 204 No Content)
    let responseData: any;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      // responseData = await response.text();
      const rawText = await response.text();
      try {
        responseData = JSON.parse(rawText);
      } catch (e) {
        responseData = rawText;
      }
    }

    if (!response.ok) {
      console.log("object", response.status)
      if (response.status === 401 || response.status === 403 || response.status === 405) {
        forceLogoutClient();
        // console.log("hello")
      }

      return {
        success: false,
        status: response.status,
        error:
          responseData?.message ||
          responseData?.data?.message ||
          (typeof responseData === "string" && responseData.trim().length > 0
            ? responseData
            : `API Error: Status ${response.status}`),
      };
    }
    if (responseData?.status === 401 || responseData?.message?.toLowerCase().includes("unauthorized")) {
      // forceLogoutClient();
    }

    return { success: true, status: response.status, data: responseData };
  } catch (error: any) {
    if (
      error?.message === "NEXT_REDIRECT" ||
      error?.digest?.startsWith("NEXT_REDIRECT") ||
      error?.message?.includes("NEXT_REDIRECT")
    ) {
      throw error;
    }
    console.error(`Global API Error on [${endpoint}]:`, error);
    // forceLogoutClient();
    return { success: false, error: "Network connection to backend failed." };
  }
}
