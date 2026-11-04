import { useTranslation } from "react-i18next";
import { languagePaths, languages, resolveLanguage, type SupportedLanguage } from "../helpers/language";
import { LANGUAGE_STORAGE_KEY } from "../i18n";

// Each language lives at its own URL, so switching is a plain link. The choice
// is remembered so returning visitors to / land on their preferred version.
const rememberLanguage = (code: SupportedLanguage) => {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, code);
  } catch {
    // Storage can be unavailable; the link still works for this visit.
  }
};

export default function LanguageSelect() {
  const { i18n, t } = useTranslation();
  const current = resolveLanguage(i18n.resolvedLanguage);

  return (
    <nav className="language-switch" aria-label={t("language.select")}>
      {languages.map((code) => (
        <a
          key={code}
          href={languagePaths[code]}
          hrefLang={code}
          lang={code}
          className="language-option"
          aria-label={t(`language.${code}`)}
          aria-current={code === current ? "page" : undefined}
          onClick={() => rememberLanguage(code)}
        >
          {code.toUpperCase()}
        </a>
      ))}
    </nav>
  );
}
