# Portfolio site

Personal portfolio for Kyle Heron, live at **https://kyher.github.io**.

Built with React, TypeScript and Vite, with English and French translations via i18next.

## Development

Requires Node 24. The version is declared once, in `devEngines` in `package.json`: npm refuses to install or run scripts on another major, and CI uses the same declaration.

```
npm install
npm run dev      # start the dev server
npm run lint     # run ESLint
npm test         # test the first-load script in index.html
npm run build    # typecheck, build and prerender to dist/
npm run preview  # serve the production build locally
```

## How pages are built

The site is prerendered at build time: `npm run build` builds the client, builds `src/entry-server.tsx` for Node, then `scripts/prerender.ts` renders each language into static HTML (`dist/index.html` for English, `dist/fr/index.html` for French) with its own title, description, canonical and `hreflang` tags, and writes `dist/sitemap.xml` from the same list of languages. The browser hydrates that HTML.

The language comes from the URL (`/` or `/fr/`). Visitors who choose French, or whose browser is French, are sent from `/` to `/fr/` by the inline script in `index.html`. Language links carry the choice as `?lang=`, so it works however the link is opened. The script saves it and removes it from the address. Canonical and `hreflang` URLs never include it. Translatable head text (like the meta description) lives under `meta` in the locale files.

`dist/404.html` is prerendered with both languages and no client JavaScript, because GitHub Pages serves one error page for every missing path.

The dev server renders client-side only, so check SEO output with `npm run build && npm run preview`.

## Lighthouse

CI runs [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) on every pull request and every push to `master`, against the prerendered `/`, `/fr/` and `/404.html` pages (config in `lighthouserc.json`). Accessibility, best practices and SEO must score 100; performance below 90 is a warning. Each run uploads its reports as an artifact, and pull request runs also link to public copies in the job log. To run it locally:

```
npm run build
npx @lhci/cli@0.16.0 autorun
```

## Editing content

- **Skills, experience, projects and profile links:** `src/data/portfolio.ts`. The structured data in each page's head (current employer, skills, profile links) is built from it too, so there's nothing else to update when these change.
- **Copy and translations:** `src/locales/en.json` and `src/locales/fr.json`. Both files must have exactly the same keys. A key missing from either one, or a project `descriptionKey` or role `type` with no translation, fails the typecheck in `npm run build`.
- **Images:** `public/` (use resized WebP to keep the page light)

## Dependencies

CI fails if a production dependency has a known high or critical advisory (`npm audit --omit=dev --audit-level=high`).

Accepted dev-only advisory: minimatch [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249) (moderate), which comes in through ESLint. It's fixed in minimatch 11.0.1, but ESLint 10 doesn't accept that version yet, and here it only matches globs from this repository's own config. Remove this note when ESLint allows minimatch 11.

## Deployment

`.github/workflows/ci.yml` runs lint, tests, build and Lighthouse on every pull request and every push to `master`. Only a push to `master`, or a manual run on `master`, that passes all of them is deployed to GitHub Pages, and it deploys the same build that Lighthouse audited, without rebuilding. A failing check stops the release, and the live site keeps its previous version.
