import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./translation-files/en.json";
import tr from "./translation-files/tr.json";

i18n.use(initReactI18next).init({
  compatibilityJSON: "v4",
  resources: { en, tr },
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
