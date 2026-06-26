"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { globalServerRequest } from "@/actions/globalApi";
import toast from "react-hot-toast";
import AddCardModal from "@/components/modals/AddCardModal";

const EditProfile = () => {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState<boolean>(false);

  const [profileData, setProfileData] = useState({
    name: "",
    phone: "",
    email: "",
    profile_image: "/images/inner-page/user-profile.svg",
  });

  useEffect(() => {
    const rawUser = localStorage.getItem("user");
    if (rawUser) {
      try {
        const userObj = JSON.parse(rawUser);
        const user = userObj.user ? userObj.user : userObj;
        setProfileData({
          name: user.name ?? "",
          phone: user.phone ?? "",
          email: user.email ?? "",
          profile_image: user.profileImage || user.profile_image || "/images/inner-page/user-profile.svg",
        });
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
      }
    }
  }, []);

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
      const imageUrl = URL.createObjectURL(file);
      setProfileData((prev) => ({
        ...prev,
        profile_image: imageUrl,
      }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

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
        toast.success("Profile completed successfully!");
        const updatedUser = response.data?.data || response.data;

        // Sync localStorage user object
        const rawUser = localStorage.getItem("user");
        if (rawUser) {
          try {
            const userObj = JSON.parse(rawUser);
            if (userObj.user) {
              userObj.user = { ...userObj.user, ...updatedUser, isProfileCompleted: true };
            } else {
              Object.assign(userObj, updatedUser, { isProfileCompleted: true });
            }
            localStorage.setItem("user", JSON.stringify(userObj));
          } catch (e) {
            console.error(e);
          }
        }

        window.dispatchEvent(new Event("loginStatusChanged"));

        setShowAddCardModal(true);
      } else {
        toast.error(response.error || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
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
                      <a
                        onClick={(e) => {
                          e.preventDefault();
                          router.back();
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <img src="images/home/left-arrow.svg" alt="" />
                      </a>
                      Edit Profile
                    </h2>
                  </div>
                  <div className="my-profile-wrapper">
                    <div className="my-profile-page">
                      <img
                        className="bg-img"
                        src="images/inner-page/profile-bg-icon.svg"
                        alt=""
                      />
                    </div>

                    <div className="">
                      <form onSubmit={handleSave}>
                        <div className="input-data-file">
                          <div className="user-img-circle">
                            <img src={profileData.profile_image} alt="User Profile" />
                          </div>
                          <input
                            type="file"
                            id="fileInput"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: "none" }}
                          />

                          <label htmlFor="fileInput" className="upload-icon" style={{ cursor: "pointer" }}>
                            <img
                              src="images/inner-page/upload-file-icon.svg"
                              alt=""
                            />
                          </label>
                        </div>
                        <div className="roger-data">
                          <div className="input-group">
                            <img
                              src="images/inner-page/roger-walker-img.svg"
                              alt=""
                            />
                            <input
                              type="text"
                              name="name"
                              placeholder="Name"
                              value={profileData.name}
                              onChange={handleChange}
                              disabled={loading}
                            />
                          </div>

                          <div className="input-row">
                            <div className="input-group">
                              <img
                                src="images/inner-page/contact-icon.svg"
                                alt=""
                              />
                              <input
                                type="text"
                                name="phone"
                                placeholder="Phone"
                                value={profileData.phone}
                                onChange={handleChange}
                                disabled={loading}
                              />
                            </div>

                            <div className="input-group">
                              <img
                                src="images/inner-page/mail-icon.svg"
                                alt=""
                              />
                              <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={profileData.email}
                                onChange={handleChange}
                                disabled={loading}
                              />
                            </div>
                          </div>

                          <button
                            className="primary-cta edit-profile"
                            type="submit"
                            disabled={loading}
                          >
                            {loading ? "Saving Changes..." : "Save Changes"}
                          </button>
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
      <AddCardModal isOpen={showAddCardModal} setIsOpen={setShowAddCardModal} />
    </main>
  );
};

export default EditProfile;