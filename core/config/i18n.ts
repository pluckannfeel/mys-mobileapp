import 'intl-pluralrules';

import i18n from "i18next";
// import LanguageDetector from 'i18next-browser-languagedetector';
// import Backend from 'i18next-xhr-backend';
import { initReactI18next } from "react-i18next";
import en from "../../locales/en.json";
import ja from "../../locales/ja.json";

const resources = {
  en: {
    translation: en,
  },
  ja: {
    translation: ja,
  },
  // Add other languages if you have more i18n resource files
};

i18n.use(initReactI18next).init({
  resources,
  lng: "ja", // Default language
  fallbackLng: "ja",

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
