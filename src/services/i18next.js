import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ar from "./../locales/ar.json";
import en from "./../locales/en.json";

const languageResources = {
  en: { translation: en },
  ar: { translation: ar },
};

export const toggleLanguage = (locale) => {
  i18n.changeLanguage(locale);
};

export const getCurrentLanguage = () => i18n.language;

const intiInfo = {
  compatibilityJSON: "v3",
  lng: "ar",
  fallbackLng: "ar",
  debug: false,
  resources: languageResources,
  interpolation: {
    escapeValue: false,
  },
};

i18n.use(initReactI18next).init(intiInfo);

export default i18n;
