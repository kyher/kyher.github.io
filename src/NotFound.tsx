import type { TFunction } from "i18next";
import { languageHref } from "./helpers/language";

// Served by GitHub Pages for every missing path, so it carries both languages
// and is prerendered without any client JavaScript.
export default function NotFound({ en, fr }: { en: TFunction; fr: TFunction }) {
  const blocks = [
    { code: "en", t: en },
    { code: "fr", t: fr },
  ] as const;

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main">
        {en("a11y.skipToContent")} / <span lang="fr">{fr("a11y.skipToContent")}</span>
      </a>
      <header className="site-header">
        <a className="brand" href="/">KH<span aria-hidden="true">.</span><span className="sr-only"> — Kyle Heron</span></a>
      </header>

      <main id="main" tabIndex={-1} className="not-found">
        <h1>{en("notFound.title")} <span lang="fr">· {fr("notFound.title")}</span></h1>
        {blocks.map(({ code, t }) => (
          <section lang={code} className="not-found-block" key={code}>
            <p>{t("notFound.description")}</p>
            <div className="hero-actions">
              <a className="button" href={languageHref(code)}>{t("notFound.home")}</a>
              <a className="button button-secondary" href="mailto:kyleheron4@gmail.com">{t("contact.email")}</a>
            </div>
          </section>
        ))}
      </main>

      <footer className="site-footer">© Kyle Heron</footer>
    </div>
  );
}
