import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getMessaging, isSupported as isMessagingSupported } from "firebase/messaging";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAIm7xSHUBQiAXads7zbhGzx6ahYXeJgkc",
  authDomain: "sevaserve-llc-6b56c.firebaseapp.com",
  projectId: "sevaserve-llc-6b56c",
  storageBucket: "sevaserve-llc-6b56c.firebasestorage.app",
  messagingSenderId: "598779147689",
  appId: "1:598779147689:web:82cc79ff148f146a5fc0b8",
  measurementId: "G-GZSG4TJ5DC",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const rtdb = getDatabase(app);

if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      getAnalytics(app);
    }
  });
}

export default app;