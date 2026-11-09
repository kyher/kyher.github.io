import { renderToString } from "react-dom/server";
import NotFound from "./NotFound";
import Root from "./Root";
import { createI18n } from "./i18n";
import { languageLocales, languagePaths, languages, type SupportedLanguage } from "./helpers/language";

const SITE_URL = "https://kyher.github.io";

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const ogLocale = (language: SupportedLanguage) => languageLocales[language].replace("-", "_");

const person = (jobTitle: string) => ({
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Kyle Heron",
  url: `${SITE_URL}/`,
  image: `${SITE_URL}/profile.webp`,
  jobTitle,
  worksFor: { "@type": "Organization", name: "Komodo Digital" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "University of Sunderland" },
  address: { "@type": "PostalAddress", addressLocality: "Newcastle upon Tyne", addressCountry: "GB" },
  knowsAbout: ["TypeScript", "PHP", "Laravel", "Vue", "React", "Next.js", "Symfony"],
  sameAs: ["https://github.com/kyher", "https://www.linkedin.com/in/kyher/"],
});

// "<" is escaped so that the JSON can't close its script element.
const jsonLd = (data: object) => JSON.stringify(data).replace(/</g, "\\u003c");

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
    `<meta property="og:image:alt" content="${escapeHtml(t("meta.imageAlt"))}" />`,
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
    `<script type="application/ld+json">${jsonLd(person(t("hero.title")))}</script>`,
  ].join("\n  ");

  return {
    language,
    output: `${languagePaths[language].slice(1)}index.html`,
    title,
    head,
    html: renderToString(<Root language={language} />),
    hydrate: true,
  };
};

const renderNotFound = () => {
  const en = createI18n("en").t;
  const fr = createI18n("fr").t;
  const description = escapeHtml(`${en("notFound.description")} ${fr("notFound.description")}`);

  return {
    language: "en",
    output: "404.html",
    title: escapeHtml(`${en("notFound.title")} · ${fr("notFound.title")} — Kyle Heron`),
    head: `<meta name="description" content="${description}" />`,
    html: renderToString(<NotFound en={en} fr={fr} />),
    hydrate: false,
  };
};

export const renderPages = () => [...languages.map(renderPage), renderNotFound()];
