import i18n, { InitOptions } from "i18next";
import { initReactI18next } from "react-i18next";
import ar from "./../locales/ar.json";
import en from "./../locales/en.json";
import * as Localization from "expo-localization";

const languageResources = {
  en: { translation: en },
  ar: { translation: ar },
};

const deviceLanguage = Localization.getLocales()[0].languageCode;
const selectedLanguage = deviceLanguage.startsWith("ar") ? "ar" : "en";
export const appLanguage: "ar" | "en" = selectedLanguage;

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
