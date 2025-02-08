import { appLanguage, deviceLanguage } from "../services/i18next";
import { Platform } from "react-native";

export const isRTL = appLanguage === "ar";

export const flexDirection = () => {
  if (
    (Platform.OS === "ios" && deviceLanguage === "ar" && isRTL) ||
    (!isRTL && Platform.OS === "android")
  ) {
    return "flex-row-reverse";
  }
  return "flex-row";
};

export const rowDirection = () => {
  if (
    (Platform.OS === "ios" && deviceLanguage === "ar" && isRTL) ||
    (!isRTL && Platform.OS === "android")
  ) {
    return "row-reverse";
  }
  return "row";
};

export const textDirection = () => {
  return isRTL ? "text-right" : "text-left";
};
