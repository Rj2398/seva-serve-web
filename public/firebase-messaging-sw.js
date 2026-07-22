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
  self.registration.showNotification(
    payload.notification.title,
    {
      body: payload.notification.body,
      icon: "/favicon.ico",
    }
  );
});