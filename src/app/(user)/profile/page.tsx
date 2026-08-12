"use client";

import React, { useEffect, useState } from "react";
import MyProfile from "./MyProfile";
import { globalServerRequest } from "@/actions/globalApi";
import LogoLoader from "@/components/common/LogoLoader";

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

  if (loading) {
    return (
      <LogoLoader />
    );
  }

  return (
    <div>
      <MyProfile initialData={initialProfile} />
    </div>
  );
}
