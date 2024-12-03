import { getDefaultLanguage } from "../services/i18next";
import { Platform } from "react-native";

export const currentLanguage = getDefaultLanguage();
export const isRTL = currentLanguage === "ar";

export const flexDirection = () => {
  if (Platform.OS === "ios" && isRTL) {
    return "flex-row-reverse";
  }
  return "flex-row";
};

export const rowDirection = () => {
  if (Platform.OS === "ios" && isRTL) {
    return "row-reverse";
  }
  return "row";
};

export const textDirection = () => {
  return isRTL ? "text-right" : "text-left";
};
