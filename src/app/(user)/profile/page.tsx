"use client";

import React, { useEffect, useState } from "react";
import MyProfile from "./MyProfile";
import { globalServerRequest } from "@/actions/globalApi";

export default function ProfilePage() {
  const [initialProfile, setInitialProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await globalServerRequest({
          endpoint: "profile",
          method: "GET",
        });

        if (response.success) {
          console.log(
            "✅ GET profile raw response:",
            JSON.stringify(response.data, null, 2)
          );
          // Target nested structure if present, otherwise fall back to response.data
          setInitialProfile(response.data?.data || response.data);
        } else {
          console.error("❌ GET profile failed:", response);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Prevent flash of mock hardcoded fallback data while API finishes fetching
  if (loading) {
    return (
      <div
        className="profile-loading-container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <p>Loading Profile Data...</p>
      </div>
    );
  }

  return (
    <div>
      <MyProfile initialData={initialProfile} />
    </div>
  );
}
