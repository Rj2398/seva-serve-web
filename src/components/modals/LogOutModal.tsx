"use client"; // Required since we are interacting with browser storage systems and events

import React from "react";
import { useRouter } from "next/navigation";

const LogOutModal = () => {
  const router = useRouter();

  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Prevent default anchor element jumping behavior if applicable
    e.preventDefault();

    // 1. Clear everything from sessionStorage
    sessionStorage.clear();

    // 2. Safe check for browser environment
    if (typeof window !== "undefined") {
      // Clear everything from localStorage
      localStorage.clear();

      // --- ADDED: Clear the server-side auth cookie ---
      // Make sure the path matches exactly how you set it during login (usually path=/)
      document.cookie =
        "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; Secure";

      // Dispatch event so other client components update immediately
      window.dispatchEvent(new Event("loginStatusChanged"));
    }

    console.log("Session, LocalStorage, and Cookies cleared successfully!");

    // 3. Force Next.js to clear server-cached layout components and redirect to home page
    router.refresh(); // Crucial: Re-renders the layout server-side now that the cookie is gone!
    router.push("/");
  };

  return (
    <div
      className="modal fade welcome"
      id="logout-popup"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex={-1}
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="welcome-seva-ser">
              <img src="images/modal/logout.svg" className="check" alt="" />
              <p>
                <b>Are you sure you want to log out of your account?</b>
              </p>

              {/* Added onClick listener to your existing design */}
              <a
                href="#"
                data-bs-toggle="modal"
                className="primary-cta"
                onClick={handleLogout}
              >
                Yes, Logout
              </a>

              <button
                type="button"
                data-bs-toggle="modal"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogOutModal;
