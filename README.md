# Portfolio site

Personal portfolio for Kyle Heron, live at **https://kyher.github.io**.

Built with React, TypeScript, Vite and Tailwind CSS, with English and French translations via i18next.

## Development

```
npm install
npm run dev      # start the dev server
npm run lint     # run ESLint
npm run build    # typecheck and build to dist/
npm run preview  # serve the production build locally
```

## Editing content

- **Skills, experience and projects:** `src/data/portfolio.ts`
- **Copy and translations:** `src/locales/en.json` and `src/locales/fr.json`
- **Images:** `public/` (use resized WebP to keep the page light)

## Deployment

Every push to `master` is linted, built and deployed to GitHub Pages by `.github/workflows/deploy.yml`. Pull requests run lint and build in `.github/workflows/ci.yml`.
