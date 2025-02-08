import { appLanguage } from "../services/i18next";

interface IGetNameProps {
  arabicName: string;
  englishName: string;
}

const getName = function (obj: IGetNameProps) {
  if (!obj) return "";

  if (appLanguage === "en") {
    return obj.englishName;
  } else if (appLanguage === "ar") {
    return obj.arabicName;
  }
  return "default name";
};

export default getName;
