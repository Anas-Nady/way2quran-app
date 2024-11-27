import { useEffect } from "react";
import { router } from "expo-router";

export default function NotificationClickHandler() {
  useEffect(() => {
    // Go back to previous screen immediately
    router.back();
  }, []);

  return null;
}
