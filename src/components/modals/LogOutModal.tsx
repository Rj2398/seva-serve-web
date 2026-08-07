"use client"; // Required since we are interacting with browser storage systems and events

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { globalServerRequest } from "@/actions/globalApi";
import LogoLoader from "@/components/common/LogoLoader";

const LogOutModal = () => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsLoggingOut(true);

    // Hide the modal immediately using Bootstrap API
    if (typeof window !== "undefined" && (window as any).bootstrap) {
      const modalElement = document.getElementById("logout-popup");
      if (modalElement) {
        const modalInstance = (window as any).bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }
      }
    }

    try {
      await globalServerRequest({
        endpoint: "profile/logout",
        method: "POST",
      });
    } catch (error) {
      console.error("Logout API failed:", error);
    }

    if (typeof window !== "undefined") {
      sessionStorage.clear();
      localStorage.clear();

      document.cookie =
        "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";

      window.dispatchEvent(new Event("loginStatusChanged"));
    }

    router.push("/");
    setTimeout(() => {
      setIsLoggingOut(false);
    }, 1000);
  };

  return (
    <>
      {isLoggingOut && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          zIndex: 999999,
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <LogoLoader />
        </div>
      )}
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
    </>
  );
};

export default LogOutModal;
