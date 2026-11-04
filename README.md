# Portfolio site

Personal portfolio for Kyle Heron, live at **https://kyher.github.io**.

Built with React, TypeScript, Vite and Tailwind CSS, with English and French translations via i18next.

## Development

```
npm install
npm run dev      # start the dev server
npm run lint     # run ESLint
npm run build    # typecheck, build and prerender to dist/
npm run preview  # serve the production build locally
```

## How pages are built

The site is prerendered at build time: `npm run build` builds the client, builds `src/entry-server.tsx` for Node, then `scripts/prerender.ts` renders each language into static HTML (`dist/index.html` for English, `dist/fr/index.html` for French) with its own title, description, canonical and `hreflang` tags. The browser hydrates that HTML.

The language comes from the URL (`/` or `/fr/`). Visitors who choose French, or whose browser is French, are sent from `/` to `/fr/` by the inline script in `index.html`. Translatable head text (like the meta description) lives under `meta` in the locale files.

The dev server renders client-side only, so check SEO output with `npm run build && npm run preview`.

## Editing content

- **Skills, experience and projects:** `src/data/portfolio.ts`
- **Copy and translations:** `src/locales/en.json` and `src/locales/fr.json`
- **Images:** `public/` (use resized WebP to keep the page light)

## Deployment

Every push to `master` is linted, built and deployed to GitHub Pages by `.github/workflows/deploy.yml`. Pull requests run lint and build in `.github/workflows/ci.yml`.
