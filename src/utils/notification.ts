// utils/firebaseNotification.ts

// import { getMessaging, onMessage, isSupported } from "firebase/messaging";
// import app from "@/config/firebase";
// import toast from "react-hot-toast";

// export const initializeFirebaseNotifications = async () => {
//   const supported = await isSupported();

//   if (!supported) return;

//   const messaging = getMessaging(app);

//   onMessage(messaging, (payload) => {
//     console.log("Foreground Notification:", payload);

//     toast.success(payload.notification?.title || "New Notification");
//   });
// };

import { getMessaging, onMessage, isSupported } from "firebase/messaging";
import app from "@/config/firebase";
import toast from "react-hot-toast";
import React from "react";

export const initializeFirebaseNotifications = async () => {
  const supported = await isSupported();

  if (!supported) return;

  const messaging = getMessaging(app);

  onMessage(messaging, (payload) => {
    console.log("Foreground Notification:", payload);

    toast.custom(
      (t) =>
        React.createElement(
          "div",
          {
            style: {
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              borderRadius: "8px",
              background: "#fff",
              padding: "16px",
              display: "flex",
              alignItems: "flex-start",
              fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              maxWidth: "360px",
              width: "100%",
              pointerEvents: "auto",
              border: "1px solid #ebebeb",
              zIndex: 9999,
            },
          },
          // Icon Container
          React.createElement(
            "div",
            { style: { flexShrink: 0, marginTop: "2px" } },
            React.createElement("img", {
              src: payload.notification?.icon || "/images/header/logo.svg",
              style: { width: "36px", height: "36px", objectFit: "contain" },
              alt: "icon"
            })
          ),
          // Text Container
          React.createElement(
            "div",
            { style: { marginLeft: "14px", flex: 1, minWidth: 0 } },
            React.createElement(
              "p",
              { style: { margin: 0, fontSize: "14px", fontWeight: "600", color: "#202124", lineHeight: "1.4" } },
              payload.notification?.title || "New Notification"
            ),
            React.createElement(
              "p",
              { style: { margin: "4px 0 0 0", fontSize: "13px", color: "#5f6368", lineHeight: "1.4", wordBreak: "break-word" } },
              payload.notification?.body || ""
            )
          ),
          // Close Button
          React.createElement(
            "button",
            {
              onClick: () => toast.dismiss(t.id),
              style: {
                background: "transparent",
                border: "none",
                color: "#70757a",
                cursor: "pointer",
                padding: "4px",
                marginLeft: "8px",
                fontSize: "16px",
                lineHeight: "1",
                display: "flex",
              },
              "aria-label": "Close notification"
            },
            "×"
          )
        ),
      { duration: 6000, position: "top-right" }
    );

    // 👇 Notify the notification dropdown to refresh
    window.dispatchEvent(new Event("newNotification"));
  });
};