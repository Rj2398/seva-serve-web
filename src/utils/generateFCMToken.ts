import { getMessaging, getToken, isSupported } from "firebase/messaging";
import app from "@/config/firebase";

export const generateFCMToken = async () => {
  try {
    const supported = await isSupported();

    if (!supported) {
      console.log("Firebase Messaging is not supported.");
      return "";
    }

    const permission = await Notification.requestPermission();

    console.log("Notification permission:", permission);

    if (permission !== "granted") {
      console.log("Notification permission denied.");
      return "";
    }

    const messaging = getMessaging(app);

    const currentToken = await getToken(messaging, {
      vapidKey: "BOqNmicokigiYnVxi5qiR10P7YV3IPqu-vFPdOmPNnvtEgFkIzPWJfTrQ2Cu48Zz82V4-GALM0yoxYBM_5Dq14E",
    });

    console.log("FCM Token:", currentToken);

    return currentToken || "";
  } catch (error) {
    console.error("FCM Error:", error);
    return "";
  }
};