"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { globalServerRequest } from "@/actions/globalApi";
import toast from "react-hot-toast";
import VerifyProfile from "@/components/modals/verifyProfile";

interface MyProfileProps {
  initialData: any;
}

const MyProfile = ({ initialData }: MyProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [verifyMode, setVerifyMode] = useState<"email" | "phone">("phone");

  const [profileData, setProfileData] = useState({
    name: initialData ? initialData.name ?? "" : "Rogar Walker",
    phone: initialData ? initialData.phone ?? "" : "+1 555 232 254",
    email: initialData ? initialData.email ?? "" : "roger@gmail.com",
    profile_image:
      initialData?.profile_image || "/images/inner-page/user-profile.svg",
    created_at: initialData?.created_at || null,
  });

  // Cleanup object URL memory leaks on unmount
  useEffect(() => {
    return () => {
      if (profileData.profile_image.startsWith("blob:")) {
        URL.revokeObjectURL(profileData.profile_image);
      }
    };
  }, [profileData.profile_image]);

  // Sync state if initialData changes from an external router update
  useEffect(() => {
    if (initialData) {
      setProfileData({
        name: initialData.name ?? "",
        phone: initialData.phone ?? "",
        email: initialData.email ?? "",
        profile_image:
          initialData.profile_image || "/images/inner-page/user-profile.svg",
        created_at: initialData.created_at || null,
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setSelectedFile(file);

      // Revoke older local preview blob URL if it exists to free RAM
      if (profileData.profile_image.startsWith("blob:")) {
        URL.revokeObjectURL(profileData.profile_image);
      }

      const imageUrl = URL.createObjectURL(file);
      setProfileData((prev) => ({
        ...prev,
        profile_image: imageUrl,
      }));
    }
  };

  const formatJoinDate = (dateString?: string) => {
    if (!dateString) return "Oct 2026";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Oct 2026";
      return date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
    } catch (e) {
      return "Oct 2026";
    }
  };

  const handleOpenVerifyModal = (mode: "email" | "phone") => {
    if (isEditing) {
      setVerifyMode(mode);
      if (typeof window !== "undefined" && (window as any).bootstrap) {
        const modal = document.getElementById("verify-profile-screen-1");
        if (modal) {
          const bootstrapModal =
            (window as any).bootstrap.Modal.getInstance(modal) ||
            new (window as any).bootstrap.Modal(modal);
          bootstrapModal.show();
        }
      }
    }
  };

  const handleSave = async () => {
    if (!profileData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!profileData.phone.trim()) {
      toast.error("Phone number is required");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (profileData.email && !emailRegex.test(profileData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", profileData.name.trim());
      formData.append("phone", profileData.phone.trim());
      formData.append("email", profileData.email?.trim() || "");

      // Send file with your backend's specific "profileImg" key
      if (selectedFile) {
        formData.append("profileImg", selectedFile);
      }

      const response = await globalServerRequest({
        endpoint: "profile/update",
        method: "POST",
        payload: formData,
        isFormData: true,
      });

      if (response.success) {
        toast.success("Profile updated successfully");
        const updatedUser = response.data?.data || response.data;

        if (updatedUser) {
          setProfileData({
            name: updatedUser.name ?? "",
            phone: updatedUser.phone ?? "",
            email: updatedUser.email ?? "",
            profile_image:
              updatedUser.profile_image ||
              "/images/inner-page/user-profile.svg",
            created_at: updatedUser.created_at || profileData.created_at,
          });

          // Sync localStorage seamlessly
          const rawUser = localStorage.getItem("user");
          if (rawUser) {
            try {
              const userObj = JSON.parse(rawUser);
              const target = userObj.user ? userObj.user : userObj;

              target.name = updatedUser.name;
              target.phone = updatedUser.phone;
              target.email = updatedUser.email;
              target.profile_image = updatedUser.profile_image;

              localStorage.setItem("user", JSON.stringify(userObj));
              window.dispatchEvent(new Event("loginStatusChanged"));
            } catch (e) {
              console.error("Failed to update user cache in localStorage", e);
            }
          }
        }
        setSelectedFile(null);
        setIsEditing(false);
      } else {
        toast.error(response.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("An unexpected error occurred while saving profile changes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <div className="container home-wraper my-profile">
        <section>
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="browse-wrp">
                  <div className="browse-ctg-head my-con-head">
                    <h2 className="sub-cate-page">
                      <Link href="/home">
                        <img src="/images/home/left-arrow.svg" alt="Back" />
                      </Link>
                      {!isEditing ? "My Profile" : "Edit Profile"}
                    </h2>
                  </div>
                  <div className="my-profile-wrapper">
                    <div className="my-profile-page">
                      <img
                        className="bg-img"
                        src="/images/inner-page/profile-bg-icon.svg"
                        alt=""
                      />
                    </div>

                    <div>
                      <form onSubmit={(e) => e.preventDefault()}>
                        <div className="input-data-file">
                          <div className="user-img-circle">
                            <img
                              src={
                                profileData?.profile_image ||
                                "/images/inner-page/user-profile.svg"
                              }
                              alt="Profile"
                            />
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            id="fileInput"
                            onChange={handleImageChange}
                            disabled={!isEditing || loading}
                            style={{ display: "none" }}
                          />

                          {isEditing && (
                            <label
                              htmlFor="fileInput"
                              className="upload-icon"
                              style={{ cursor: "pointer" }}
                            >
                              <img
                                src="/images/inner-page/upload-file-icon.svg"
                                alt="Upload"
                              />
                            </label>
                          )}
                        </div>
                        <div className="roger-data">
                          <div className="input-group">
                            <img
                              src="/images/inner-page/roger-walker-img.svg"
                              alt=""
                            />
                            <input
                              type="text"
                              name="name"
                              value={profileData.name}
                              onChange={handleChange}
                              disabled={!isEditing || loading}
                              className={!isEditing ? "readonly-input" : ""}
                            />
                          </div>

                          <div className="input-row">
                            <div className="input-group">
                              <img
                                src="/images/inner-page/contact-icon.svg"
                                alt=""
                              />
                              <input
                                type="text"
                                name="phone"
                                value={profileData.phone}
                                onChange={handleChange}
                                disabled={!isEditing || loading}
                                readOnly={isEditing}
                                onClick={() => handleOpenVerifyModal("phone")}
                                className={!isEditing ? "readonly-input" : ""}
                              />
                            </div>

                            <div className="input-group">
                              <img
                                src="/images/inner-page/mail-icon.svg"
                                alt=""
                              />
                              <input
                                type="email"
                                name="email"
                                value={profileData.email}
                                onChange={handleChange}
                                disabled={!isEditing || loading}
                                readOnly={isEditing}
                                onClick={() => handleOpenVerifyModal("email")}
                                className={!isEditing ? "readonly-input" : ""}
                              />
                            </div>
                          </div>

                          {!isEditing && (
                            <div className="input-group">
                              <img
                                src="/images/home/profile-date-icon.svg"
                                alt=""
                              />
                              <input
                                type="text"
                                value={formatJoinDate(profileData.created_at)}
                                disabled
                              />
                            </div>
                          )}

                          {!isEditing ? (
                            <button
                              type="button"
                              className="primary-cta edit-profile"
                              onClick={() => setIsEditing(true)}
                            >
                              <img
                                src="/images/inner-page/edit-icon.svg"
                                alt=""
                              />
                              Edit Profile
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="primary-cta edit-profile"
                              onClick={handleSave}
                              disabled={loading}
                            >
                              {loading ? "Saving Changes..." : "Save Changes"}
                            </button>
                          )}
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <VerifyProfile initialMode={verifyMode} />
    </main>
  );
};

export default MyProfile;
