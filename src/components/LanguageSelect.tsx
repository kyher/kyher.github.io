import { useTranslation } from "react-i18next";
import { resolveLanguage, type SupportedLanguage } from "../helpers/language";
import { LANGUAGE_STORAGE_KEY } from "../i18n";

export default function LanguageSelect() {
  const { i18n, t } = useTranslation();
  const language = resolveLanguage(i18n.resolvedLanguage);

  const selectLanguage = (code: SupportedLanguage) => {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, code);
    } catch {
      // Storage can be unavailable; the switch still works for this visit.
    }
    void i18n.changeLanguage(code);
  };

  return (
    <div className="language-switch" role="group" aria-label={t("language.select")}>
      {(["en", "fr"] as const).map((code) => (
        <button
          key={code}
          type="button"
          className="language-option"
          aria-label={t(`language.${code}`)}
          aria-pressed={language === code}
          onClick={() => selectLanguage(code)}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
