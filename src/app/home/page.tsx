import React from "react";
import { cookies } from "next/headers";
import ClientComponent from "./ClientComponent";
import { BASE_URL } from "@/actions/globalApi";

export default async function Homepage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  const endpoint = token ? "home" : "home-without-login";

  let data = null;

  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (res.ok) {
      const response = await res.json();
      console.log(`[Server Home] Response data from ${endpoint}:`, response);
      if (response.success) {
        data = response.data?.data || response.data;
      } else {
        console.error(`Failed to fetch ${endpoint} data:`, response.error);
      }
    } else {
      console.error(`Failed to fetch ${endpoint} data: Status ${res.status}`);
    }
  } catch (err) {
    console.error(`Error fetching ${endpoint} data:`, err);
  }

  return <ClientComponent data={data} />;
}
