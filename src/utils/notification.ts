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

interface argtype {
  toLowerCase(): unknown;
  payload: any;
  data: any;
  screen_type: any;
}

export const initializeFirebaseNotifications = async () => {
  const supported = await isSupported();

  if (!supported) return;

  const messaging = getMessaging(app);

  onMessage(messaging, (payload) => {
    console.log("Foreground Notification:", payload);

    const title =
      payload.data?.title || payload.notification?.title || "New Notification";
    const body = payload.data?.body || payload.notification?.body || "";
    const icon =
      payload.data?.icon ||
      payload.notification?.icon ||
      "/images/header/logo.svg";

    // Trigger System Push Notification even in foreground
    if (Notification.permission === "granted") {
      const handleNavigation = (screenType: any, targetId: any) => {
        let url = null;
        if (screenType && targetId) {
          switch (screenType.toLowerCase()) {
            case "quote":
              url = `/quotes?quoteId=${targetId}`;
              break;
            case "booking":
              url = `/view-booking-detail?bookingId=${targetId}`;
              break;
          }
        }
        if (url) window.location.href = url;
      };

      try {
        navigator.serviceWorker.getRegistration().then((registration) => {
          if (registration) {
            registration.showNotification(title, {
              body,
              icon,
              data: payload.data,
            });
          } else {
            // Fallback if no SW is found for current scope
            const notif = new Notification(title, { body, icon });
            notif.onclick = (e) => {
              e.preventDefault();
              window.focus();
              handleNavigation(
                payload.data?.screen_type,
                payload.data?.target_id
              );
            };
          }
        });
      } catch (e) {
        console.error("System notification failed:", e);
      }
    } else {
      console.log(
        "Push blocked: Notification permission is",
        Notification.permission
      );
    }

    // 👇 Notify the notification dropdown to refresh
    window.dispatchEvent(new Event("newNotification"));
  });
};
