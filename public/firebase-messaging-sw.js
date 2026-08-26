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
    "[firebase-messaging-sw.js] Received background message ",
    JSON.stringify(payload)
  );

  const title =
    payload.data?.title || payload.notification?.title || "New Notification";
  const body = payload.data?.body || payload.notification?.body || "";
  const icon =
    payload.data?.icon ||
    payload.notification?.icon ||
    "/images/header/logo.svg";

  console.log(body, "body");

  try {
    const notificationPromise = self.registration.showNotification(title, {
      body: body,
      icon: icon,
      data: payload.data, // pass data to the click handler
    });
    return notificationPromise;
  } catch (err) {
    console.error(
      "[firebase-messaging-sw.js] Failed to show notification:",
      err
    );
    // Fallback without icon just in case
    return self.registration.showNotification(title, {
      body: body,
      data: payload.data,
    });
  }
});

// Optional: Handle notification clicks (e.g. to open a specific screen)
self.addEventListener("notificationclick", (event) => {
  console.log(
    "[firebase-messaging-sw.js] Notification click received.",
    event.notification
  );
  event.notification.close();

  const data = event.notification.data || {};
  const screenType = data.screen_type ? data.screen_type.toLowerCase() : null;
  const targetId = data.target_id;

  // Default URL is the homepage so it ALWAYS opens/focuses the app
  let url = "/";
  if (screenType && targetId) {
    switch (screenType) {
      case "quote":
      case "alert":
        url = "/quotes?quoteId=" + targetId;
        // url = `/quotes?quoteId=${targetId}`;
        break;
      case "booking":
        url = "/view-booking-detail?bookingId=" + targetId;
        break;
    }
  }

  // Always fully qualify the URL
  const fullUrl = new URL(url, self.location.origin).href;

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        // Find an open tab
        for (let i = 0; i < windowClients.length; i++) {
          let client = windowClients[i];
          if (
            client.url &&
            client.url.startsWith(self.location.origin) &&
            "focus" in client
          ) {
            client.focus();
            // Navigate to the target screen (or just stay where they are if url is just "/")
            if (url !== "/") {
              return client.navigate(fullUrl);
            }
            return;
          }
        }
        // If no open tab, open a new window
        if (clients.openWindow) {
          return clients.openWindow(fullUrl);
        }
      })
  );
});
