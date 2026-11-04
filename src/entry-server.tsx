import { renderToString } from "react-dom/server";
import Root from "./Root";
import { createI18n } from "./i18n";
import { languageLocales, languagePaths, languages, type SupportedLanguage } from "./helpers/language";

const SITE_URL = "https://kyher.github.io";

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const ogLocale = (language: SupportedLanguage) => languageLocales[language].replace("-", "_");

const renderPage = (language: SupportedLanguage) => {
  const t = createI18n(language).t;
  const title = escapeHtml(`Kyle Heron — ${t("hero.title")}`);
  const description = escapeHtml(t("meta.description"));
  const url = SITE_URL + languagePaths[language];

  const head = [
    `<meta name="description" content="${description}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:locale" content="${ogLocale(language)}" />`,
    ...languages
      .filter((other) => other !== language)
      .map((other) => `<meta property="og:locale:alternate" content="${ogLocale(other)}" />`),
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    `<link rel="canonical" href="${url}" />`,
    ...languages.map(
      (other) => `<link rel="alternate" hreflang="${other}" href="${SITE_URL + languagePaths[other]}" />`,
    ),
    `<link rel="alternate" hreflang="x-default" href="${SITE_URL}/" />`,
  ].join("\n  ");

  return {
    language,
    path: languagePaths[language],
    title,
    head,
    html: renderToString(<Root language={language} />),
  };
};

export const renderPages = () => languages.map(renderPage);
