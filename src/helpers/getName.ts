import { currentLanguage } from "./flexDirection";

interface IGetNameProps {
  arabicName: string;
  englishName: string;
}

const getName = function (obj: IGetNameProps) {
  if (!obj) return "";

  if (currentLanguage === "en") {
    return obj.englishName;
  } else if (currentLanguage === "ar") {
    return obj.arabicName;
  }
  return "default name";
};

export default getName;
