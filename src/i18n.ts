import i18next, { type i18n } from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import fr from "./locales/fr.json";
import type { SupportedLanguage } from "./helpers/language";

// Remembers an explicit language choice so the inline script in index.html
// can send returning visitors from / to their preferred version.
export const LANGUAGE_STORAGE_KEY = "language";

const resources = {
  en: { translation: en },
  fr: { translation: fr },
};

// The language comes from the URL (/ or /fr/), so each page gets its own
// instance, initialised synchronously so it can render on the server.
export const createI18n = (language: SupportedLanguage): i18n => {
  const instance = i18next.createInstance();
  void instance.use(initReactI18next).init({
    resources,
    lng: language,
    fallbackLng: "en",
    initAsync: false,
    showSupportNotice: false,
    interpolation: {
      escapeValue: false, // React already escapes rendered values
    },
  });
  return instance;
};
