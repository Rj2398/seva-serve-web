import { getMessaging, onMessage, isSupported } from "firebase/messaging";
import app from "@/config/firebase";

const parseNotificationObject = (value: any) => {
  if (typeof value === "string") {
    try {
      value = JSON.parse(value);
    } catch {
      return {};
    }
  }

  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
};

const getNotificationData = (payload: any) => {
  const data = parseNotificationObject(payload?.data);
  const nestedData = parseNotificationObject(data.data);
  const meta = parseNotificationObject(
    data.meta || nestedData.meta || payload?.meta
  );

  return {
    ...parseNotificationObject(payload?.notification),
    ...nestedData,
    ...data,
    ...meta,
  };
};

const getNotificationScreenType = (data: any) => {
  const screenType = String(
    data?.screen_type ||
      data?.screenType ||
      data?.notification_type ||
      data?.notificationType ||
      data?.type ||
      ""
  )
    .trim()
    .toLowerCase()
    .replace(/[-\s]/g, "_");

  const titleAndBody = `${data?.title || ""} ${data?.body || ""}`.toLowerCase();
  const isQuoteRemark =
    (screenType.includes("quote") && screenType.includes("remark")) ||
    (screenType.includes("remark") &&
      Boolean(data?.quote_id || data?.quoteId || data?.target_id || data?.targetId)) ||
    (titleAndBody.includes("remark") &&
      (screenType === "quote" ||
        titleAndBody.includes("quote") ||
        Boolean(data?.quote_id || data?.quoteId)));

  return isQuoteRemark ? "quote_remarks" : screenType;
};

export const initializeFirebaseNotifications = async () => {
  const supported = await isSupported();

  if (!supported) return;

  const messaging = getMessaging(app);

  onMessage(messaging, async (payload) => {
    console.log("Foreground Notification:", payload);
    const notificationData = getNotificationData(payload);

    const title =
      notificationData.title ||
      payload.notification?.title ||
      "New Notification";

    const body =
      notificationData.body ||
      payload.notification?.body ||
      "";

    const icon =
      notificationData.icon ||
      payload.notification?.icon ||
      "/images/header/logo.svg";

    if (Notification.permission !== "granted") {
      console.log(
        "Push blocked: Notification permission is",
        Notification.permission
      );

      window.dispatchEvent(new Event("newNotification"));
      return;
    }

    try {
      const registration =
        await navigator.serviceWorker.getRegistration();

      if (registration) {
        await registration.showNotification(title, {
          body,
          icon,
          data: notificationData,
        });
      } else {
        const notification = new Notification(title, {
          body,
          icon,
        });

        notification.onclick = () => {
          window.focus();

          handleNotificationNavigation(notificationData);
          notification.close();
        };
      }
    } catch (error) {
      console.error(
        "Foreground notification failed:",
        error
      );
    }

    // Notification dropdown refresh
    window.dispatchEvent(new Event("newNotification"));
  });
};

const handleNotificationNavigation = (data: any) => {
  const screenType = getNotificationScreenType(data);

  const targetId = data?.target_id || data?.targetId;
  const quoteId = data?.quote_id || data?.quoteId;
  const bookingId = data?.booking_id || data?.bookingId;

  let url = "/";

  switch (screenType) {
    case "quote_remarks":
    case "quote_remark": {
      const id = quoteId || targetId;

      if (id) {
        url = `/quotes?status=Requested&quoteId=${encodeURIComponent(
          String(id)
        )}&openRemarks=1`;
      }

      break;
    }

    case "quote": {
      const id = quoteId || targetId;

      if (id) {
        url = `/quotes?status=Received&quoteId=${id}`;
      }

      break;
    }

    case "job_tracking": {
      const id = bookingId || targetId;

      if (id) {
        url = `/view-booking-detail?bookingId=${id}`;
      }

      break;
    }

    case "payment": {
      const id = bookingId || targetId;

      if (id) {
        url = `/my-payment?bookingId=${id}`;
      }

      break;
    }

    case "booking": {
      const id = bookingId || targetId;

      if (id) {
        url = `/booking?bookingId=${id}`;
      }

      break;
    }

    case "referral_earned":
      url = "/referral";
      break;

    case "profile":
      url = "/profile";
      break;

    case "general":
      url = "/";
      break;

    default:
      console.warn(
        "Unknown screen_type:",
        screenType
      );
  }

  if (url) {
    window.location.href = url;
  }
};




// import { getMessaging, onMessage, isSupported } from "firebase/messaging";
// import app from "@/config/firebase";
// import toast from "react-hot-toast";
// import React from "react";

// export const initializeFirebaseNotifications = async () => {
//   const supported = await isSupported();

//   if (!supported) return;

//   const messaging = getMessaging(app);

//   onMessage(messaging, (payload) => {
//     console.log("Foreground Notification:", payload);

//     const title =
//       payload.data?.title || payload.notification?.title || "New Notification";
//     const body = payload.data?.body || payload.notification?.body || "";
//     const icon =
//       payload.data?.icon ||
//       payload.notification?.icon ||
//       "/images/header/logo.svg";

//     // Trigger System Push Notification even in foreground
//     if (Notification.permission === "granted") {
//       // const handleNavigation = (screenType: any, targetId: any) => {
//       //   let url = null;
//       //   if (screenType && targetId) {
//       //     switch (screenType.toLowerCase()) {
//       //       case "quote":
//       //         url = "/quotes?quoteId=" + targetId;
//       //         break;
//       //       case "booking":
//       //         url = "/booking";
//       //         break;
//       //       case "job_tracking":
//       //         url = "/view-booking-detail?bookingId=" + targetId;
//       //         break;
//       //       case "payment":
//       //         url = "/my-payment";
//       //         break;
//       //     }
//       //   }
//       //   if (url) window.location.href = url;
//       // };

//   const handleNavigation = (data: any) => {
//   const screenType = data?.screen_type?.toLowerCase();

//   const targetId = data?.target_id;
//   const quoteId = data?.quote_id;
//   const bookingId = data?.booking_id;

//   let url = null;

//   switch (screenType) {
//     case "quote": {
//       const id = quoteId || targetId;

//       if (id) {
//         url = `/quotes?status=Received&quoteId=${id}`;
//       }
//       break;
//     }

//     case "job_tracking": {
//       const id = bookingId || targetId;

//       if (id) {
//         url = `/view-booking-detail?bookingId=${id}`;
//       }
//       break;
//     }

//     case "payment": {
//       const id = bookingId || targetId;

//       if (id) {
//         url = `/my-payment?bookingId=${id}`;
//       }
//       break;
//     }

//     case "booking": {
//       const id = bookingId || targetId;

//       if (id) {
//         url = `/booking?bookingId=${id}`;
//       }
//       break;
//     }

//     case "referral_earned":
//       url = "/referral";
//       break;

//     case "profile":
//       url = "/profile";
//       break;

//     case "general":
//       break;

//     default:
//       console.warn("Unknown screen_type:", screenType);
//   }

//   if (url) {
//     window.location.href = url;
//   }
// };

//       try {
//         navigator.serviceWorker.getRegistration().then((registration) => {
//           if (registration) {
//             registration.showNotification(title, {
//               body,
//               icon,
//               data: payload.data,
//             });
//           } else {
//             // Fallback if no SW is found for current scope
//             const notif = new Notification(title, { body, icon });
//             notif.onclick = (e) => {
//               e.preventDefault();
//               window.focus();
//               handleNavigation(
//                 payload.data
//               );
//             };
//           }
//         });
//       } catch (e) {
//         console.error("System notification failed:", e);
//       }
//     } else {
//       console.log(
//         "Push blocked: Notification permission is",
//         Notification.permission
//       );
//     }

//     // 👇 Notify the notification dropdown to refresh
//     window.dispatchEvent(new Event("newNotification"));
//   });
// };
