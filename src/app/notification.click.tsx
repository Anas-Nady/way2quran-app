import { useEffect } from "react";
import { router } from "expo-router";

export default function NotificationClickHandler() {
  useEffect(() => {
    router.back();
  }, []);

  return null;
}
