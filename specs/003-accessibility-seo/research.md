# Research: Improve Accessibility and SEO

No unknowns remained after reading the spec, the constitution and the current code. These are the
design decisions behind the plan.

## R1. Landmark structure

- **Decision**: Change the outer `<main className="site-shell">` to a `<div>`, and wrap only the
  page's `<section>` elements in `<main id="main" tabIndex={-1}>`. The header, main navigation and
  footer sit alongside it, inside the same `.site-shell` container.
- **Rationale**: A `<header>` or `<footer>` inside `<main>` loses its banner or contentinfo role.
  `.section + .section` still matches because the sections stay siblings, so the layout is unaffected.
- **Alternatives considered**: ARIA roles on the existing elements don't work, because a banner
  inside a main region is still invalid structure.

## R2. Skip link

- **Decision**: A plain `<a href="#main">` as the first child of `.site-shell`. It's absolutely
  positioned and moved above the viewport with a transform until `:focus`. `<main>` has
  `tabIndex={-1}` so that it receives focus, with `main:focus { outline: none }` because a
  non-interactive region doesn't need a ring.
- **Rationale**: Absolute positioning means it can't shift layout (FR-004), and a plain link works
  without JavaScript. Text colours are 6.17:1 in light and 7.64:1 in dark.
- **Alternatives considered**: Using `.sr-only` and removing it on focus produces the same result with
  more rules.

## R3. Focus indicators

Measured against the colours next to each indicator:

| Indicator | Light | Dark | Result |
|---|---|---|---|
| Accent outline on page | 5.83 | 7.64 | Pass |
| Accent outline on surface | 6.07 | 6.93 | Pass |
| Accent outline on contact panel | **2.51** | **2.09** | Fail |
| Theme toggle ring on surface | 6.60 | **2.45** | Fail in dark |
| Plain links, the brand link and links in the projects intro | Browser default | Browser default | Not controlled by the site |

- **Decision**:
  - Replace the selector list at `src/App.css:227` with one global
    `:focus-visible { outline: 3px solid var(--accent); outline-offset: 4px; }`, so that every link
    has a controlled indicator. Existing specific rules still override it.
  - Add `.contact-panel :focus-visible { outline-color: var(--page); }`, which measures 14.62:1 in
    light and 16.00:1 in dark.
  - Change the toggle ring to `var(--accent)`, which measures 6.07:1 in light and 6.93:1 in dark.
- **Rationale**: One global rule means a new link can't be missed. Using `--page` on the panel follows
  how the panel already reverses its text colours.
- **Alternatives considered**: Adding each missing selector to the list is easy to forget for future
  links. Lighter ring on the toggle in dark only needs an extra token for no benefit.

## R4. French text

- **Decision**: Leave role titles in `src/data/portfolio.ts` in English. Add `meta.imageAlt` to both
  locale files, and move `og:image:alt` and the JSON-LD from `index.html` into the per-language head
  in `src/entry-server.tsx`, using `hero.title` for `jobTitle`.
- **Rationale**: Role titles are the titles actually held, and the owner chose to keep them in
  English, so Principle IV is amended to permit it. The English metadata values are unchanged
  (FR-008). JSON-LD must be per-language to be translated, and the dev server doesn't need it, as the
  README already notes for SEO output.
- **Alternatives considered**: Translating the role titles was proposed and declined.

## R5. Error page

- **Decision**: Prerender `dist/404.html` from a new `src/NotFound.tsx`, using the built `index.html`
  template with its module script removed. It has a header with the brand link, a skip link, one
  `<main>` and a footer. The `<h1>` carries both languages, followed by one block per language
  marked with `lang`. Each block has a home link using `languageHref` and an email link.
- **Rationale**: GitHub Pages serves a single root `404.html` for every missing path. Removing the
  script stops React trying to hydrate a different tree. Built asset URLs are already absolute, so
  they load at any depth. The inline first-load script stays, so the theme applies from first paint,
  and it only redirects at `/`. Home links use `languageHref`, otherwise a French-browser visitor
  choosing English would be redirected back.
- **Alternatives considered**:
  - A `noindex` tag would fail Lighthouse's SEO audit, and isn't needed because the host returns a
    404 status.
  - A plain static file in `public/` couldn't reference the hashed stylesheet and would duplicate text
    outside the locale files.
  - Language detection needs JavaScript.

## R6. Icons and interface colour

- **Decision**: Add `public/favicon.svg` with "KH." drawn as shapes on a rounded `#7545c4` tile with
  white letters (6.17:1). Add `public/favicon-32.png` and `public/apple-touch-icon.png` (180×180) as
  square, opaque versions. Declare two `theme-color` tags using `media`, with `#fbf8f4` for light and
  `#17151b` for dark. PNGs are generated once and committed.
- **Rationale**: Shapes rather than text render the same on every device with no font. A solid tile
  stays legible on light and dark tabs. iOS applies its own rounded corners to opaque icons.
- **Alternatives considered**: An `.ico` file adds a format with no benefit over a PNG fallback today.

## R7. Lighthouse coverage

- **Decision**: Add `http://localhost/404.html` to `lighthouserc.json`.
- **Rationale**: The constitution says every page must meet the thresholds (SC-007).

## R8. Verifying no visual change

- **Decision**: Capture a baseline before any change and pixel-compare afterwards. English pages must
  be identical, and French pages may differ only in the profile paragraph's apostrophes.
- **Rationale**: Moving the landmarks and adding a reset-sensitive `<main>` wrapper could shift layout,
  and the comparison catches that (SC-008).
