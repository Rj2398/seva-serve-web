"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { globalServerRequest } from "@/actions/globalApi";
import toast from "react-hot-toast";
import VerifyProfile from "@/components/modals/verifyProfile";

interface MyProfileProps {
  initialData: any;
}

const MyProfile = ({ initialData }: MyProfileProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  console.log("isEditing", isEditing);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [verifyMode, setVerifyMode] = useState<"email" | "phone">("phone");

  const [profileData, setProfileData] = useState({
    name: initialData ? initialData.name ?? "" : "",
    phone: initialData ? initialData.phone ?? "" : "",
    email: initialData ? initialData.email ?? "" : "",
    profile_image:
      initialData?.profile_image || "/images/inner-page/user-profile.svg",
    created_at: initialData?.created_at || null,
  });

  useEffect(() => {
    return () => {
      if (profileData.profile_image && profileData.profile_image.startsWith("blob:")) {
        URL.revokeObjectURL(profileData.profile_image);
      }
    };
  }, [profileData.profile_image]);

  useEffect(() => {
    let localUserData: any = null;
    if (typeof window !== "undefined") {
      const rawUser = localStorage.getItem("user");
      if (rawUser) {
        try {
          const parsed = JSON.parse(rawUser);
          localUserData = parsed?.user ? parsed.user : parsed;
        } catch (e) {
          console.error("Failed to parse user from localStorage", e);
        }
      }
    }

    const currentData = initialData || localUserData;

    if (currentData) {
      const name = currentData.name ?? localUserData?.name ?? "";
      const phone = currentData.phone ?? localUserData?.phone ?? "";
      const email = currentData.email ?? localUserData?.email ?? "";
      const profile_image =
        currentData.profile_image ||
        localUserData?.profile_image ||
        "/images/inner-page/user-profile.svg";
      const created_at =
        currentData.created_at || localUserData?.created_at || null;

      setProfileData({
        name,
        phone,
        email,
        profile_image,
        created_at,
      });

      const isProfileComplete =
        Boolean(name && name.trim().length > 0) &&
        Boolean(phone && phone.trim().length > 0) &&
        Boolean(email && email.trim().length > 0) &&
        currentData.isProfileCompleted !== false &&
        currentData.isProfileCompleted !== "false" &&
        localUserData?.isProfileCompleted !== false &&
        localUserData?.isProfileCompleted !== "false";

      if (!isProfileComplete) {
        setIsEditing(true);
      }
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
      if (profileData.profile_image && profileData.profile_image.startsWith("blob:")) {
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
    if (!profileData.email.trim()) {
      toast.error("Email address is required");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileData.email.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", profileData.name.trim());
      formData.append("phone", profileData.phone.trim());
      formData.append("email", profileData.email.trim());
      
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
            name: updatedUser.name ?? profileData.name,
            phone: updatedUser.phone ?? profileData.phone,
            email: updatedUser.email ?? profileData.email,
            profile_image:
              updatedUser.profile_image ||
              profileData.profile_image ||
              "/images/inner-page/user-profile.svg",
            created_at: updatedUser.created_at || profileData.created_at,
          });

          // Sync localStorage seamlessly
          const rawUser = localStorage.getItem("user");
          if (rawUser) {
            try {
              const userObj = JSON.parse(rawUser);
              if (userObj.user) {
                userObj.user = {
                  ...userObj.user,
                  ...updatedUser,
                  isProfileCompleted: true,
                };
              } else {
                Object.assign(userObj, updatedUser, { isProfileCompleted: true });
              }
              userObj.isProfileCompleted = true;

              localStorage.setItem("user", JSON.stringify(userObj));
              window.dispatchEvent(new Event("loginStatusChanged"));
            } catch (e) {
              console.error("Failed to update user cache in localStorage", e);
            }
          }
        }
        setSelectedFile(null);
        setIsEditing(false);

        // Redirect to Home page after profile completion
        if (typeof window !== "undefined") {
          window.location.href = "/";
        }
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
                              placeholder="Name"
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
                                placeholder="Phone Number"
                                value={profileData.phone}
                                onChange={handleChange}
                                disabled={!isEditing || loading}
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
                                placeholder="Email Address"
                                value={profileData.email}
                                onChange={handleChange}
                                disabled={!isEditing || loading}
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
