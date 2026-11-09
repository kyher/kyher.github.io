# Implementation Plan: Fix Small Site Bugs

**Branch**: `bug-fixes` | **Date**: 2026-11-09 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-fix-small-bugs/spec.md`

## Summary

Fix the five bugs in issue #66. Language links will carry the visitor's choice in a `lang` query
parameter, so the choice survives every way of opening a link and works with storage blocked. The
inline first-load script gets isolated storage access and keeps query strings on redirect. The
footer drops its year, and the site uses system fonts with looser heading spacing. A small test
with no new dependencies covers the first-load script. See [research.md](research.md).

## Technical Context

**Language/Version**: TypeScript 5.9 on Node 24, plus one inline ES5-style script in `index.html`

**Primary Dependencies**: React 19, i18next, Vite 8, Tailwind CSS 4. No additions.

**Storage**: Browser `localStorage` only, see [data-model.md](data-model.md)

**Testing**: `node:test` for the first-load script, ESLint, `tsc`, Lighthouse CI

**Target Platform**: Current evergreen browsers, static hosting on GitHub Pages

**Project Type**: Static prerendered website

**Performance Goals**: Lighthouse performance at 90 or above on both pages

**Constraints**: Redirect and theme must be resolved before first paint. No new indexable
addresses. Core content must work without JavaScript.

**Scale/Scope**: Two prerendered pages and about ten small file changes

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Rule | Assessment | Before design | After design |
|---|---|---|---|
| I. Content Serves the Reader | Removing the year is the only content change, and contact routes are untouched | Pass | Pass |
| II. Static and Prerendered | Language links remain plain anchors, and the footer no longer varies at runtime | Pass | Pass |
| III. Accessible by Default | No change to structure, contrast or focus. Headings stay legible in both themes | Pass | Pass |
| IV. Bilingual Parity | No new strings. Each language keeps its URL, canonical and `hreflang` tags | Pass | Pass |
| V. Lightweight and Simple | No new dependencies, no font download, and the now-unused click handler and storage constant are removed | Pass | Pass |
| Technical Constraints | Remains static on GitHub Pages, in strict TypeScript | Pass | Pass |
| Development Workflow | Quickstart covers themes, languages and widths. First-load logic gets the automated test the workflow recommends | Pass | Pass |

No violations. The known gaps from issues #67 and #69 are unaffected.

## Project Structure

### Documentation (this feature)

```text
specs/001-fix-small-bugs/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── first-load-behaviour.md
└── tasks.md             # Created by /speckit-tasks
```

### Source Code (repository root)

```text
index.html                          # First-load script: lang parameter, isolated storage, keep query
scripts/first-load.test.ts          # New: runs the first-load script against the contract tables
src/
├── App.tsx                         # Footer without a year
├── App.css                         # Looser heading letter spacing
├── index.css                       # Remove Inter from the font stack
├── i18n.ts                         # Remove the unused storage key constant
├── helpers/language.ts             # Build language link addresses with the lang parameter
└── components/LanguageSelect.tsx   # Use those addresses and remove the click handler
package.json                        # Add the test script
.github/workflows/ci.yml            # Run tests in the lint job
README.md                           # Document the lang parameter and npm test
```

**Structure Decision**: Keep the existing single-project layout. The new test goes in `scripts/`
because `tsconfig.node.json` and the ESLint Node globals already cover that directory.

## Complexity Tracking

No constitution violations to justify.
