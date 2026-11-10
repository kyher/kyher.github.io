import type { TFunction } from "i18next";
import { renderToString } from "react-dom/server";
import NotFound from "./NotFound";
import Root from "./Root";
import { experience, profiles, skills } from "./data/portfolio";
import { createI18n } from "./i18n";
import { languageLocales, languagePaths, languages, type SupportedLanguage } from "./helpers/language";

const SITE_URL = "https://kyher.github.io";

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const ogLocale = (language: SupportedLanguage) => languageLocales[language].replace("-", "_");

// Built from the content data, so it can't contradict the page. With no current
// role, the employer is left out rather than naming a past one.
const person = (t: TFunction) => {
  const employer = experience.find((job) => job.period[1] === null)?.company;
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Kyle Heron",
    url: `${SITE_URL}/`,
    image: `${SITE_URL}/profile.webp`,
    jobTitle: t("hero.title"),
    ...(employer && { worksFor: { "@type": "Organization", name: employer } }),
    alumniOf: { "@type": "CollegeOrUniversity", name: t("education.university") },
    address: { "@type": "PostalAddress", addressLocality: "Newcastle upon Tyne", addressCountry: "GB" },
    knowsAbout: skills,
    sameAs: [profiles.github, profiles.linkedin],
  };
};

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
    `<script type="application/ld+json">${jsonLd(person(t))}</script>`,
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

// Lists each language page with the same alternates as its hreflang tags. The
// error page is left out.
export const renderSitemap = () => {
  const alternates = [
    ...languages.map((other) => ({ hreflang: other, href: SITE_URL + languagePaths[other] })),
    { hreflang: "x-default", href: `${SITE_URL}/` },
  ]
    .map(({ hreflang, href }) => `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${href}" />`)
    .join("\n");
  const urls = languages
    .map((language) => `  <url>\n    <loc>${SITE_URL + languagePaths[language]}</loc>\n${alternates}\n  </url>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;
};
