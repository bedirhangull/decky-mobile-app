import i18n, { use as i18nextUse } from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./translation-files/en.json";
import tr from "./translation-files/tr.json";

const resources = {
  en: en,
  tr: tr,
};

i18nextUse(initReactI18next).init({
  compatibilityJSON: "v4",
  resources,
  lng: "en",
});

export default { i18n };
