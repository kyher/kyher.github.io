import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import fr from "./locales/fr.json";
import { resolveLanguage } from "./helpers/language";

export const LANGUAGE_STORAGE_KEY = "language";

const resources = {
  en: { translation: en },
  fr: { translation: fr },
};

// Prefer the visitor's saved choice, then their browser language, then English.
const initialLanguage = () => {
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored) return resolveLanguage(stored);
  } catch {
    // Storage can be unavailable (e.g. blocked site data); fall through.
  }
  return resolveLanguage(navigator.language?.slice(0, 2));
};

// Keep <html lang> in sync so screen readers pronounce content correctly,
// and translate the tab title to match.
i18n.on("languageChanged", (language) => {
  document.documentElement.lang = resolveLanguage(language);
  document.title = `Kyle Heron — ${i18n.t("hero.title")}`;
});

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLanguage(),
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // React already escapes rendered values
    },
  });

export default i18n;
