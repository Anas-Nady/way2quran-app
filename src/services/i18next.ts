import i18n, { InitOptions } from "i18next";
import { initReactI18next } from "react-i18next";
import ar from "./../locales/ar.json";
import en from "./../locales/en.json";
import Constants from "expo-constants";

const languageResources = {
  en: { translation: en },
  ar: { translation: ar },
};

export const appLanguage: "ar" | "en" = Constants.expoConfig.extra.appLanguage;

const intiInfo = {
  compatibilityJSON: "v3",
  lng: appLanguage,
  fallbackLng: ["en", "ar"],
  debug: false,
  resources: languageResources,
  interpolation: {
    escapeValue: false,
  },
};

i18n.use(initReactI18next).init(intiInfo as InitOptions<unknown>);

export default i18n;
