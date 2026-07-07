"use client";

import React, { useState, useEffect } from "react";
import SidebarMenu from "../sidebar/SidebarMenu";
import Link from "next/link";
import NotificationDropdown from "./NotificationDropdown";
import SevaServeAgentPanel from "./SevaServeAgentPanel";
import Cart from "./Cart";

const Header = () => {
  const [loginStatus, setLoginStatus] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // For debugging: watch the state shift in real-time
  console.log("Current User Data Structure:", userData);
  console.log(
    "Resolved Image Path Target:",
    userData?.user?.profile_image || userData?.profile_image
  );

  useEffect(() => {
    // 1. Define a single unified function to sync storage to React state
    const syncAuthenticationState = () => {
      if (typeof window !== "undefined") {
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        setLoginStatus(isLoggedIn);

        const raw = localStorage.getItem("user");
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            setUserData(parsed);
          } catch (e) {
            console.error("Error parsing user data from localStorage:", e);
            setUserData(null);
          }
        } else {
          setUserData(null);
        }
      }
    };

    // 2. Run it immediately on mount so the user doesn't experience a UI lag
    syncAuthenticationState();

    // 3. Listen for your custom trigger event to catch real-time logins/logouts
    window.addEventListener("loginStatusChanged", syncAuthenticationState);

    // 4. Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("loginStatusChanged", syncAuthenticationState);
    };
  }, []);

  // Closes the profile dropdown overlay when navigating
  const handleDropdownLinkClick = () => {
    const dropdownToggleBtn = document.querySelector(
      ".head-cta.show"
    ) as HTMLElement;
    if (dropdownToggleBtn) {
      dropdownToggleBtn.click();
    }
    // Also strip the layout state down
    setIsMobileMenuOpen(false);
  };

  // Safe variables based on common API setups (fallback if nested inside .user or flat)
  const profileImage = userData?.user?.profileImage || userData?.profileImage;
  const userName = userData?.user?.name || userData?.name || "User Account";
  const userPhone = userData?.user?.phone || userData?.phone || "";
  let Address = null;
  if (typeof window !== "undefined") {
    const rawAddress = userData?.user?.address || userData?.address || null;
    if (rawAddress) {
      try {
        Address = JSON.parse(rawAddress);
      } catch (e) {
        Address = rawAddress;
      }
    }
  }

  return (
    <>
      <header className="header">
        <div className="left-section">
          <Link href="/">
            <img src="/images/header/logo.svg" alt="Logo" className="logo" />
          </Link>

          {loginStatus === "true" ?
            (<div className="dropdown location">
              <div
                className="dropdown-toggle location-toggle"
                data-bs-toggle="modal"
                data-bs-target="#your-location-popup"
                style={{ whiteSpace: "wrap" }}
              >
                <img
                  src="/images/header/location-icon.svg"
                  alt="location"
                  className="loca"
                />
                <span>{Address ? Address : "Current location not available"}</span>
                <img
                  src="/images/header/down-icon.svg"
                  alt="down-icon"
                  className="down-icon"
                />
              </div>
            </div>) : (
              <div className="dropdown location">
                <Link href="/">
                  <span style={{ color: "black", marginLeft: "25px", fontWeight: "500" }}>Home</span>
                </Link>
                <Link href="/about">
                  <span style={{ color: "black", marginLeft: "25px", fontWeight: "500" }}>About us</span>
                </Link>
                <Link href="/services">
                  <span style={{ color: "black", marginLeft: "25px", fontWeight: "500" }}>Services</span>
                </Link>
                <Link href="/contact">
                  <span style={{ color: "black", marginLeft: "25px", fontWeight: "500" }}>Contact us</span>
                </Link>

              </div>
            )}
        </div>

        {/* Dynamically controlled by React state to avoid freeze bugs */}
        <div className={`right-section ${isMobileMenuOpen ? "showData" : ""}`}>

          {loginStatus === "true" && (
            <div
              className="search-bar"
              data-bs-toggle="offcanvas"
              data-bs-target="#agent-msg-offcanvasRight"
              aria-controls="offcanvasRight"
            >
              <img
                src="/images/header/search-left-icon.svg"
                alt="Search"
                className="search-icon"
              />
              <input
                type="text"
                placeholder="Explain the issue you are facing?"
              />
            </div>)}

          <SevaServeAgentPanel />
          <Cart />
          {loginStatus === "true" && <NotificationDropdown />}

          {loginStatus === "true" && <div
            className="icon"
            data-bs-target="#SevaServeWorkpopup"
            data-bs-toggle="modal"
          >
            <img src="/images/header/i-icon.svg" alt="Logo" className="logo" />
          </div>}

          {loginStatus !== "true" ? (
            <div className="profile login">
              <a
                href="#login-screen-1"
                data-bs-toggle="modal"
                className="primary-cta"
              >
                Log in{" "}
                <img src="/images/header/top-right-img.svg" alt="Profile" />
              </a>
            </div>
          ) : (
            <div className="profile drop">
              <button
                type="button"
                className="dropdown-toggle head-cta"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                data-bs-auto-close="outside"
              >
                <img
                  src={profileImage || "/images/header/user-icon.svg"}
                  alt="Profile"
                />
              </button>
              <div className="profile-dropdown dropdown-menu dropdown-menu-end">
                <div className="top-ims-mrg">
                  <div className="top-img-pro">
                    <div
                      className="progress-wrp"
                      style={{
                        position: "relative",
                        width: "56px",
                        height: "56px",
                        display: "inline-block",
                      }}
                    >
                      <svg
                        viewBox="0 0 36 36"
                        style={{
                          transform: "rotate(-90deg)",
                          width: "100%",
                          height: "100%",
                          position: "absolute",
                          top: 0,
                          left: 0,
                          zIndex: 1,
                        }}
                      >
                        <circle
                          cx="18"
                          cy="18"
                          r="16"
                          fill="none"
                          stroke="#e6e6e6"
                          strokeWidth="2"
                        />
                        <circle
                          cx="18"
                          cy="18"
                          r="16"
                          fill="none"
                          stroke="#991318"
                          strokeWidth="2"
                          strokeDasharray="100, 100"
                          strokeDashoffset={100 - 50}
                          strokeLinecap="round"
                        />
                      </svg>
                      <img
                        src={
                          profileImage || "/images/inner-page/user-profile.svg"
                        }
                        alt="User Avatar"
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          width: "82%",
                          height: "82%",
                          borderRadius: "50%",
                          objectFit: "cover",
                          zIndex: 2,
                        }}
                      />
                    </div>
                    <div className="roger-number">
                      <p className="roger">{userName}</p>
                      <p className="number">{userPhone}</p>
                    </div>
                  </div>
                  <div className="right-img" onClick={handleDropdownLinkClick}>
                    <Link href="/profile">
                      <img
                        src="/images/inner-page/right-side-move.svg"
                        alt=""
                      />
                    </Link>
                  </div>
                </div>
                <div className="user-profile-list">
                  <ul
                    className="profile-list-group-wrp"
                    onClick={handleDropdownLinkClick}
                  >
                    <li className="profile-list-group">
                      <Link href="/about">
                        <div>
                          <img
                            src="/images/inner-page/about-seva-serve.svg"
                            alt=""
                          />
                          <span>About SevaServe </span>
                        </div>
                        <img
                          src="/images/inner-page/right-side-move.svg"
                          alt=""
                        />
                      </Link>
                    </li>
                    <li className="profile-list-group">
                      <Link href="/account-privacy">
                        <div>
                          <img
                            src="/images/inner-page/account-eye-icon.svg"
                            alt=""
                          />
                          <span>Account Privacy</span>
                        </div>
                        <img
                          src="/images/inner-page/right-side-move.svg"
                          alt=""
                        />
                      </Link>
                    </li>
                    <li className="profile-list-group">
                      <Link href="/help-support">
                        <div>
                          <img
                            src="/images/inner-page/help-suuport.svg"
                            alt=""
                          />
                          <span>Help & Support</span>
                        </div>
                        <img
                          src="/images/inner-page/right-side-move.svg"
                          alt=""
                        />
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {loginStatus === "true" && <button
            className="menu-btn"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#home-end-offcanvasRight"
            aria-controls="offcanvasRight"
          >
            {/* <span className="frist">Menu</span> */}
            <span className="sec">
              <img src="/images/header/hamburger.svg" alt="Profile" />
            </span>
          </button>}

          <SidebarMenu />
        </div>

        <div
          className="icon-header"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <i
            id="bar-cross"
            className={`fa-solid ${isMobileMenuOpen ? "fa-circle-xmark" : "fa-bars"
              }`}
          ></i>
        </div>
      </header>
    </>
  );
};

export default Header;

// "use client";

// import React, { useState, useEffect } from "react";
// import SidebarMenu from "../sidebar/SidebarMenu";
// import Link from "next/link";
// import NotificationDropdown from "./NotificationDropdown";
// import SevaServeAgentPanel from "./SevaServeAgentPanel";
// import Cart from "./Cart";

// const Header = () => {
//   const [loginStatus, setLoginStatus] = useState<string | null>(null);
//   const [userData, setUserData] = useState<any>(null);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   console.log(userData?.user?.profile_image, "userData");

//   // For debugging: watch the state shift in real-time
//   console.log(
//     "Current User Data Profile Image:",
//     userData?.user?.profile_image
//   );

//   useEffect(() => {
//     // 1. Define a single unified function to sync storage to React state
//     const syncAuthenticationState = () => {
//       if (typeof window !== "undefined") {
//         const isLoggedIn = localStorage.getItem("isLoggedIn");
//         setLoginStatus(isLoggedIn);

//         const raw = localStorage.getItem("user");
//         if (raw) {
//           try {
//             const parsed = JSON.parse(raw);
//             setUserData(parsed);
//           } catch (e) {
//             console.error("Error parsing user data from localStorage:", e);
//             setUserData(null);
//           }
//         } else {
//           setUserData(null);
//         }
//       }
//     };

//     // 2. Run it immediately on mount so the user doesn't experience a UI lag
//     syncAuthenticationState();

//     // 3. Listen for your custom trigger event to catch real-time logins/logouts
//     window.addEventListener("loginStatusChanged", syncAuthenticationState);

//     // 4. Clean up the event listener when the component unmounts
//     return () => {
//       window.removeEventListener("loginStatusChanged", syncAuthenticationState);
//     };
//   }, []);

//   // Closes the profile dropdown overlay when navigating
//   const handleDropdownLinkClick = () => {
//     const dropdownToggleBtn = document.querySelector(
//       ".head-cta.show"
//     ) as HTMLElement;
//     if (dropdownToggleBtn) {
//       dropdownToggleBtn.click();
//     }
//     // Also strip the layout state down
//     setIsMobileMenuOpen(false);
//   };

//   return (
//     <>
//       <header className="header">
//         <div className="left-section">
//           <Link href="/">
//             <img src="/images/header/logo.svg" alt="Logo" className="logo" />
//           </Link>

//           <div className="dropdown location">
//             <div
//               className="dropdown-toggle location-toggle"
//               data-bs-toggle="modal"
//               data-bs-target="#your-location-popup"
//             >
//               <img
//                 src="/images/header/location-icon.svg"
//                 alt="location"
//                 className="loca"
//               />
//               <span>123, Street, Anywhere, 11001</span>
//               <img
//                 src="/images/header/down-icon.svg"
//                 alt="down-icon"
//                 className="down-icon"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Dynamically controlled by React state to avoid freeze bugs */}
//         <div className={`right-section ${isMobileMenuOpen ? "showData" : ""}`}>
//           <div
//             className="search-bar"
//             data-bs-toggle="offcanvas"
//             data-bs-target="#agent-msg-offcanvasRight"
//             aria-controls="offcanvasRight"
//           >
//             <img
//               src="/images/header/search-left-icon.svg"
//               alt="Search"
//               className="search-icon"
//             />
//             <input
//               type="text"
//               placeholder="Explain the issue you are facing?"
//             />
//           </div>

//           <SevaServeAgentPanel />
//           <Cart />
//           <NotificationDropdown />

//           <div
//             className="icon"
//             data-bs-target="#SevaServeWorkpopup"
//             data-bs-toggle="modal"
//           >
//             <img src="/images/header/i-icon.svg" alt="Logo" className="logo" />
//           </div>

//           {loginStatus !== "true" ? (
//             <div className="profile login">
//               <a
//                 href="#login-screen-1"
//                 data-bs-toggle="modal"
//                 className="primary-cta"
//               >
//                 Log in{" "}
//                 <img src="/images/header/top-right-img.svg" alt="Profile" />
//               </a>
//             </div>
//           ) : (
//             <div className="profile drop">
//               <button
//                 type="button"
//                 className="dropdown-toggle head-cta"
//                 data-bs-toggle="dropdown"
//                 aria-expanded="false"
//                 data-bs-auto-close="outside"
//               >
//                 <img
//                   src={
//                     userData?.user?.profile_image ||
//                     "images/header/user-icon.svg"
//                   }
//                   alt="Profile"
//                 />
//               </button>
//               <div className="profile-dropdown dropdown-menu dropdown-menu-end">
//                 <div className="top-ims-mrg">
//                   <div className="top-img-pro">
//                     <div
//                       className="progress-wrp"
//                       style={{
//                         position: "relative",
//                         width: "56px",
//                         height: "56px",
//                         display: "inline-block",
//                       }}
//                     >
//                       <svg
//                         viewBox="0 0 36 36"
//                         style={{
//                           transform: "rotate(-90deg)",
//                           width: "100%",
//                           height: "100%",
//                           position: "absolute",
//                           top: 0,
//                           left: 0,
//                           zIndex: 1,
//                         }}
//                       >
//                         <circle
//                           cx="18"
//                           cy="18"
//                           r="16"
//                           fill="none"
//                           stroke="#e6e6e6"
//                           strokeWidth="2"
//                         />
//                         <circle
//                           cx="18"
//                           cy="18"
//                           r="16"
//                           fill="none"
//                           stroke="#991318"
//                           strokeWidth="2"
//                           strokeDasharray="100, 100"
//                           strokeDashoffset={100 - 50}
//                           strokeLinecap="round"
//                         />
//                       </svg>
//                       <img
//                         src={
//                           userData?.user?.profile_image ||
//                           "images/inner-page/user-profile.svg"
//                         }
//                         alt=""
//                         style={{
//                           position: "absolute",
//                           top: "50%",
//                           left: "50%",
//                           transform: "translate(-50%, -50%)",
//                           width: "82%",
//                           height: "82%",
//                           borderRadius: "50%",
//                           objectFit: "cover",
//                           zIndex: 2,
//                         }}
//                       />
//                     </div>
//                     <div className="roger-number">
//                       <p className="roger">
//                         {userData?.user?.name || "Roger Walker"}
//                       </p>
//                       <p className="number">
//                         {userData?.user?.phone || "+1 555 232 254"}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="right-img" onClick={handleDropdownLinkClick}>
//                     <Link href="/profile">
//                       <img src="images/inner-page/right-side-move.svg" alt="" />
//                     </Link>
//                   </div>
//                 </div>
//                 <div className="user-profile-list">
//                   <ul
//                     className="profile-list-group-wrp"
//                     onClick={handleDropdownLinkClick}
//                   >
//                     <li className="profile-list-group">
//                       <Link href="/about">
//                         <div>
//                           <img
//                             src="images/inner-page/about-seva-serve.svg"
//                             alt=""
//                           />
//                           <span>About SevaServe </span>
//                         </div>
//                         <img
//                           src="images/inner-page/right-side-move.svg"
//                           alt=""
//                         />
//                       </Link>
//                     </li>
//                     <li className="profile-list-group">
//                       <Link href="/account-privacy">
//                         <div>
//                           <img
//                             src="images/inner-page/account-eye-icon.svg"
//                             alt=""
//                           />
//                           <span>Account Privacy</span>
//                         </div>
//                         <img
//                           src="images/inner-page/right-side-move.svg"
//                           alt=""
//                         />
//                       </Link>
//                     </li>
//                     <li className="profile-list-group">
//                       <Link href="/help-support">
//                         <div>
//                           <img
//                             src="images/inner-page/help-suuport.svg"
//                             alt=""
//                           />
//                           <span>Help & Support</span>
//                         </div>
//                         <img
//                           src="images/inner-page/right-side-move.svg"
//                           alt=""
//                         />
//                       </Link>
//                     </li>
//                   </ul>
//                 </div>
//               </div>
//             </div>
//           )}

//           <button
//             className="menu-btn"
//             type="button"
//             data-bs-toggle="offcanvas"
//             data-bs-target="#home-end-offcanvasRight"
//             aria-controls="offcanvasRight"
//           >
//             <span className="frist">Menu</span>
//             <span className="sec">
//               <img src="/images/header/hamburger.svg" alt="Profile" />
//             </span>
//           </button>

//           {/* Clean injection of Sidebar and passing current visibility state hooks to synchronization layout */}
//           <SidebarMenu />
//         </div>

//         {/* Clean Responsive Header Interactive Button Toggle Tigger Layout */}
//         <div
//           className="icon-header"
//           onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//         >
//           <i
//             id="bar-cross"
//             className={`fa-solid ${
//               isMobileMenuOpen ? "fa-circle-xmark" : "fa-bars"
//             }`}
//           ></i>
//         </div>
//       </header>
//     </>
//   );
// };

// export default Header;
