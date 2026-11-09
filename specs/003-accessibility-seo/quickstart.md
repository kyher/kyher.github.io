# Quickstart: Validate Accessibility and SEO

## Prerequisites

Node 24 and installed dependencies (`npm ci`). Take the baseline before changing any code.

## 1. Capture the baseline

Run `npm run build` on the unchanged code and copy `dist/` outside the repository. Capture full-page
screenshots of `/` and `/fr/` at widths of 320px, 768px and 1280px, in light and dark.

## 2. Automated checks after the change

```sh
npm run lint
npm test
npm run build
```

**Expected**: every command succeeds, and `dist/404.html` exists with no `type="module"` script.

## 3. Visual comparison

Repeat the screenshots on the new build.

**Expected**: all English shots match the baseline. French shots differ only in the apostrophes of
the profile paragraph (SC-008).

## 4. Scenarios

Use a production build served locally, following [contracts/page-structure.md](contracts/page-structure.md).

| # | Setup | Action | Expected | Covers |
|---|---|---|---|---|
| 1 | Each language | Load, press Tab | Skip link appears in the page's language | US1 |
| 2 | Skip link focused | Press Enter, then Tab | Focus moves to main content, then the first link inside it | SC-001 |
| 3 | Both language pages | List landmarks in the browser's accessibility tools | One banner, one main, one contentinfo, navigation regions labelled distinctly | SC-002 |
| 4 | Both themes | Tab through every item on the page | Indicator always visible and at least 3:1 against adjacent colours | SC-003 |
| 5 | French page | Read visible text, `og:image:alt` and JSON-LD | French throughout, apart from proper nouns and employment history job titles | SC-004 |
| 6 | English page | Compare `og:image:alt` and JSON-LD with the baseline | Same values | FR-008 |
| 7 | Serve with 404 fallback to `404.html` | Open `/nope`, `/a/b/c` and `/fr/nope` | Styled page in both languages at every depth | US3 |
| 8 | Error page, French browser | Follow the English home link | English home page with no redirect | SC-005 |
| 9 | Error page, scripts disabled | Follow both home links | Both work | FR-012 |
| 10 | Error page, dark system | Load the page | Dark from first paint | FR-012 |
| 11 | Light and dark browser themes | View the tab icon | "KH." mark is legible at 16px | SC-006 |
| 12 | A phone | Add the site to the home screen | "KH." icon appears | SC-006 |
| 13 | Built `sitemap.xml` | Inspect it | `404.html` isn't listed | FR-013 |

## 5. Quality gates

Open the pull request and confirm Lighthouse passes on `/`, `/fr/` and `/404.html`: 100 for
accessibility, best practices and SEO, and performance at 90 or above (SC-007).
