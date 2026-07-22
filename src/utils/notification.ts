// utils/firebaseNotification.ts

import { getMessaging, onMessage, isSupported } from "firebase/messaging";
import app from "@/config/firebase";
import toast from "react-hot-toast";

export const initializeFirebaseNotifications = async () => {
  const supported = await isSupported();

  if (!supported) return;

  const messaging = getMessaging(app);

  onMessage(messaging, (payload) => {
    console.log("Foreground Notification:", payload);

    toast.success(payload.notification?.title || "New Notification");
  });
};