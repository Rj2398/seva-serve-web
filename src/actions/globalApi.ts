export const BASE_URL = "http://seva.tgastaging.com/api/v1/";

interface ApiOptions {
  endpoint: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  payload?: unknown; // Changed from 'any' to 'unknown' for better type safety
  isFormData?: boolean;
}

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
    const targetUrl = `${BASE_URL}${endpoint}`;
    const headers = new Headers();

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

    if (token) {
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

    // Handle cases where response might not be JSON (e.g., 204 No Content)
    let responseData: any;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    if (!response.ok) {
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

    return { success: true, status: response.status, data: responseData };
  } catch (error) {
    console.error(`Global API Error on [${endpoint}]:`, error);
    return { success: false, error: "Network connection to backend failed." };
  }
}
