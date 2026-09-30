importScripts(
  "https://www.gstatic.com/firebasejs/11.9.1/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/11.9.1/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyAIm7xSHUBQiAXads7zbhGzx6ahYXeJgkc",
  authDomain: "sevaserve-llc-6b56c.firebaseapp.com",
  projectId: "sevaserve-llc-6b56c",
  storageBucket: "sevaserve-llc-6b56c.firebasestorage.app",
  messagingSenderId: "598779147689",
  appId: "1:598779147689:web:82cc79ff148f146a5fc0b8",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Background message:",
    JSON.stringify(payload)
  );

  const title =
    payload.data?.title ||
    payload.notification?.title ||
    "New Notification";

  const body =
    payload.data?.body ||
    payload.notification?.body ||
    "";

  const icon =
    payload.data?.icon ||
    payload.notification?.icon ||
    "/images/header/logo.svg";

  return self.registration.showNotification(title, {
    body,
    icon,
    data: payload.data || {},
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const data = event.notification.data || {};

  console.log(
    "[firebase-messaging-sw.js] Notification click:",
    JSON.stringify(data)
  );

  const screenType = data?.screen_type?.toLowerCase();

  const targetId = data?.target_id;
  const quoteId = data?.quote_id;
  const bookingId = data?.booking_id;

  let url = "/";

  switch (screenType) {
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
        "[firebase-messaging-sw.js] Unknown screen_type:",
        screenType
      );
  }

  const fullUrl = new URL(
    url,
    self.location.origin
  ).href;

  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((windowClients) => {
        for (const client of windowClients) {
          if (
            client.url?.startsWith(self.location.origin) &&
            "focus" in client
          ) {
            if ("focus" in client) {
              client.focus();
            }

            if (url !== "/") {
              return client.navigate(fullUrl);
            }

            return;
          }
        }

        if (clients.openWindow) {
          return clients.openWindow(fullUrl);
        }
      })
  );
});







// importScripts(
//   "https://www.gstatic.com/firebasejs/11.9.1/firebase-app-compat.js"
// );

// importScripts(
//   "https://www.gstatic.com/firebasejs/11.9.1/firebase-messaging-compat.js"
// );

// firebase.initializeApp({
//   apiKey: "AIzaSyAIm7xSHUBQiAXads7zbhGzx6ahYXeJgkc",
//   authDomain: "sevaserve-llc-6b56c.firebaseapp.com",
//   projectId: "sevaserve-llc-6b56c",
//   storageBucket: "sevaserve-llc-6b56c.firebasestorage.app",
//   messagingSenderId: "598779147689",
//   appId: "1:598779147689:web:82cc79ff148f146a5fc0b8",
// });

// const messaging = firebase.messaging();

// messaging.onBackgroundMessage((payload) => {
//   console.log(
//     "[firebase-messaging-sw.js] Received background message ",
//     JSON.stringify(payload)
//   );

//   const title =
//     payload.data?.title || payload.notification?.title || "New Notification";
//   const body = payload.data?.body || payload.notification?.body || "";
//   const icon =
//     payload.data?.icon ||
//     payload.notification?.icon ||
//     "/images/header/logo.svg";

//   console.log(body, "body");

//   try {
//     const notificationPromise = self.registration.showNotification(title, {
//       body: body,
//       icon: icon,
//       data: payload.data, // pass data to the click handler
//     });
//     return notificationPromise;
//   } catch (err) {
//     console.error(
//       "[firebase-messaging-sw.js] Failed to show notification:",
//       err
//     );
//     // Fallback without icon just in case
//     return self.registration.showNotification(title, {
//       body: body,
//       data: payload.data,
//     });
//   }
// });

// // Optional: Handle notification clicks (e.g. to open a specific screen)
// self.addEventListener("notificationclick", (event) => {
//   console.log(
//     "[firebase-messaging-sw.js] Notification click received.",
//     event.notification
//   );
//   event.notification.close();

//   const data = event.notification.data || {};
//   console.log(
//     "[firebase-messaging-sw.js] Background Notification Click Payload Data:",
//     JSON.stringify(data)
//   );
//   const screenType = data.screen_type ? data.screen_type.toLowerCase() : null;
//   const targetId = data.target_id;

//   // Default URL is the homepage so it ALWAYS opens/focuses the app
//   let url = "/";
//   if (screenType && targetId) {
//     switch (screenType) {
//       case "quote":
//         url = "/quotes?quoteId=" + targetId;
//         break;
//       case "booking":
//         url = "/booking";
//         break;
//       case "job_tracking":
//         url = "/view-booking-detail?bookingId=" + targetId;
//         break;
//       case "payment":
//         url = "/my-payment";
//         break;
//     }
//   }

//   // Always fully qualify the URL
//   const fullUrl = new URL(url, self.location.origin).href;
//   console.log("[firebase-messaging-sw.js] Navigating to:", fullUrl);

//   event.waitUntil(
//     clients
//       .matchAll({ type: "window", includeUncontrolled: true })
//       .then((windowClients) => {
//         // Find an open tab
//         for (let i = 0; i < windowClients.length; i++) {
//           let client = windowClients[i];
//           if (
//             client.url &&
//             client.url.startsWith(self.location.origin) &&
//             "focus" in client
//           ) {
//             client.focus();
//             // Navigate to the target screen (or just stay where they are if url is just "/")
//             if (url !== "/") {
//               return client.navigate(fullUrl);
//             }
//             return;
//           }
//         }
//         // If no open tab, open a new window
//         if (clients.openWindow) {
//           return clients.openWindow(fullUrl);
//         }
//       })
//   );
// });


