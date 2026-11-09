import { useTranslation } from "react-i18next";
import { languageHref, languages, resolveLanguage, type SupportedLanguage } from "../helpers/language";

// Each language lives at its own URL, so switching is a plain link. The link
// carries the choice, and the first-load script in index.html remembers it so
// returning visitors to / land on their preferred version.
// Each language is named in itself, so screen readers pronounce it correctly.
const languageNames: Record<SupportedLanguage, string> = { en: "English", fr: "Français" };

export default function LanguageSelect() {
  const { i18n, t } = useTranslation();
  const current = resolveLanguage(i18n.resolvedLanguage);

  return (
    <nav className="language-switch" aria-label={t("language.select")}>
      {languages.map((code) => (
        <a
          key={code}
          href={languageHref(code)}
          hrefLang={code}
          lang={code}
          className="language-option"
          aria-current={code === current ? "page" : undefined}
        >
          {code.toUpperCase()}
          <span className="sr-only"> — {languageNames[code]}</span>
        </a>
      ))}
    </nav>
  );
}
