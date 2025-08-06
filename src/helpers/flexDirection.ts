import { appLanguage } from "../services/i18next";

export const isRTL = appLanguage === "ar";

export const flexDirection = () => {
  if (isRTL) return "flex-row";
  else return "flex-row";
};

export const rowDirection = () => {
  if (isRTL) return "row";
  else return "row";
};

export const textDirection = () => {
  return isRTL ? "text-right" : "text-left";
};
