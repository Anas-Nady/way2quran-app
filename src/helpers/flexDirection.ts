import { appLanguage } from "../services/i18next";

export const isRTL = appLanguage === "ar";

export const textDirection = () => {
  return isRTL ? "text-right" : "text-left";
};
