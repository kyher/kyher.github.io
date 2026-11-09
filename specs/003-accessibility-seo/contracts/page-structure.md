# Contract: Page Structure and Metadata

This defines what each published page exposes to assistive technology, search engines and browsers.
The language link and first-load contract in
[specs/001-fix-small-bugs/contracts/first-load-behaviour.md](../../001-fix-small-bugs/contracts/first-load-behaviour.md)
still applies.

## Pages

| Page | File | `html lang` | Runs React in the browser |
|---|---|---|---|
| English | `dist/index.html` | `en` | Yes |
| French | `dist/fr/index.html` | `fr` | Yes |
| Error | `dist/404.html` | `en`, with French blocks marked `lang="fr"` | No |

## Landmarks and focus order

| Item | English and French pages | Error page |
|---|---|---|
| First focusable item | Skip link to `#main` | Skip link to `#main` |
| Banner | `<header>` outside `<main>` | `<header>` outside `<main>` |
| Navigation | Language links and site sections, each labelled | None |
| Main | One `<main id="main">`, holding only page sections | One `<main id="main">` |
| Footer | `<footer>` outside `<main>` | `<footer>` outside `<main>` |

## Head metadata

| Tag | English | French | Error |
|---|---|---|---|
| `title`, `description`, `canonical`, `hreflang` | Per language | Per language | Title and description in both languages, no `canonical` or `hreflang` |
| `og:image:alt` | English | French | None |
| JSON-LD `jobTitle` | English | French | None |
| `theme-color` | Light and dark | Light and dark | Light and dark |
| Icons | SVG, 32px PNG, 180px PNG | Same | Same |

## Error page links

| Link | Target |
|---|---|
| English home | `/?lang=en` |
| French home | `/fr/?lang=fr` |
| Email, in each language | `mailto:` address used elsewhere on the site |

The error page isn't included in `sitemap.xml`.
