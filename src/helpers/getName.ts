import { getDefaultLanguage } from "../services/i18next";

interface IGetNameProps {
  arabicName: string;
  englishName: string;
}

const getName = function (obj: IGetNameProps) {
  if (!obj) return "";

  if (getDefaultLanguage === "en") {
    return obj.englishName;
  } else if (getDefaultLanguage === "ar") {
    return obj.arabicName;
  }
  return "default name";
};

export default getName;
