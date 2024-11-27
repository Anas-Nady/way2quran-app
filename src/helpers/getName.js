import { currentLanguage } from "./flexDirection";

const getName = function (obj) {
  if (!obj) return "";

  if (currentLanguage === "en") {
    return obj.englishName;
  } else if (currentLanguage === "ar") {
    return obj.arabicName;
  }
  return "default name";
};

export default getName;
