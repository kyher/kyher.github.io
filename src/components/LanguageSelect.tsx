import { useTranslation } from "react-i18next";
import { resolveLanguage } from "../helpers/language";

export default function LanguageSelect() {
  const { i18n, t } = useTranslation();
  const language = resolveLanguage(i18n.resolvedLanguage);

  return (
    <div className="language-switch" role="group" aria-label={t("language.select")}>
      {(["en", "fr"] as const).map((code) => (
        <button
          key={code}
          type="button"
          className="language-option"
          aria-label={t(`language.${code}`)}
          aria-pressed={language === code}
          onClick={() => void i18n.changeLanguage(code)}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
