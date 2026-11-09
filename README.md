# Portfolio site

Personal portfolio for Kyle Heron, live at **https://kyher.github.io**.

Built with React, TypeScript and Vite, with English and French translations via i18next.

## Development

```
npm install
npm run dev      # start the dev server
npm run lint     # run ESLint
npm test         # test the first-load script in index.html
npm run build    # typecheck, build and prerender to dist/
npm run preview  # serve the production build locally
```

## How pages are built

The site is prerendered at build time: `npm run build` builds the client, builds `src/entry-server.tsx` for Node, then `scripts/prerender.ts` renders each language into static HTML (`dist/index.html` for English, `dist/fr/index.html` for French) with its own title, description, canonical and `hreflang` tags. The browser hydrates that HTML.

The language comes from the URL (`/` or `/fr/`). Visitors who choose French, or whose browser is French, are sent from `/` to `/fr/` by the inline script in `index.html`. Language links carry the choice as `?lang=`, so it works however the link is opened. The script saves it and removes it from the address. Canonical and `hreflang` URLs never include it. Translatable head text (like the meta description) lives under `meta` in the locale files.

`dist/404.html` is prerendered with both languages and no client JavaScript, because GitHub Pages serves one error page for every missing path.

The dev server renders client-side only, so check SEO output with `npm run build && npm run preview`.

## Lighthouse

Pull requests run [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) against the prerendered `/` and `/fr/` pages (config in `lighthouserc.json`). Accessibility, best practices and SEO must score 100; performance below 90 is a warning. Each run links to its reports in the job log and uploads them as an artifact. To run it locally:

```
npm run build
npx @lhci/cli@0.16.0 autorun
```

## Editing content

- **Skills, experience and projects:** `src/data/portfolio.ts`
- **Copy and translations:** `src/locales/en.json` and `src/locales/fr.json`
- **Images:** `public/` (use resized WebP to keep the page light)

## Deployment

Every push to `master` is linted, built and deployed to GitHub Pages by `.github/workflows/deploy.yml`. Pull requests run lint, tests and build in `.github/workflows/ci.yml`.
