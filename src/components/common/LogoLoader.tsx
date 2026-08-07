"use client";

import React from "react";

export default function LogoLoader() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "83vh",
        backgroundColor: "transparent",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        width: "100%",
      }}
    >
      <style>
        {`
          @keyframes spin360 {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          .logo-spinner {
            animation: spin360 6s linear infinite;
            width: 60px;
            height: 60px;
          }
        `}
      </style>
      <img
        src="/images/header/logo.svg"
        alt="Loading..."
        className="logo-spinner"
      />
    </div>
  );
}
