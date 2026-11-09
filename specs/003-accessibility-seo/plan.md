# Implementation Plan: Improve Accessibility and SEO

**Branch**: `accessibility` | **Date**: 2026-11-09 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/003-accessibility-seo/spec.md`

## Summary

Close the constitution's remaining accessibility and bilingual gaps. Landmarks are restructured with
a skip link, and one global focus rule plus two fixes brings every focus indicator to at least 3:1.
The sharing alt text and structured data become per-language, while role titles stay in English
under a small amendment to Principle IV. A single prerendered
`404.html` carries both languages, and the emoji favicon becomes a "KH." mark with a phone icon and
interface colours. See [research.md](research.md).

## Technical Context

**Language/Version**: TypeScript 5.9 on Node 24, and CSS

**Primary Dependencies**: React 19, i18next, Vite 8. No additions.

**Storage**: N/A

**Testing**: ESLint, `tsc`, the existing `npm test`, Lighthouse CI on three pages, and a one-off pixel comparison

**Target Platform**: Current evergreen browsers, static hosting on GitHub Pages

**Project Type**: Static prerendered website

**Performance Goals**: Lighthouse performance at 90 or above on all three pages

**Constraints**: English pages must stay pixel-identical. The error page must work without scripts at any URL depth.

**Scale/Scope**: Three prerendered pages and about fourteen small file changes

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Rule | Assessment | Before design | After design |
|---|---|---|---|
| I. Content Serves the Reader | The error page has a contact route on its first screen | Pass | Pass |
| II. Static and Prerendered | The error page is prerendered and needs no scripts, and the build fails if it can't be rendered | Pass | Pass |
| III. Accessible by Default | Closes the known gaps, and fixes the toggle ring found during planning | Pass | Pass |
| IV. Bilingual Parity | Closes the known gaps, with employment history job titles permitted by amendment v1.0.1. The error page is the one exception to per-language URLs, justified below | Justified | Justified |
| V. Lightweight and Simple | No new dependencies, and the error page ships no client JavaScript | Pass | Pass |
| Technical Constraints | Remains static on GitHub Pages, in strict TypeScript | Pass | Pass |
| Development Workflow | Quickstart covers both themes, both languages and three widths. Lighthouse now covers the error page | Pass | Pass |

No unjustified violations. This closes the Principle III and IV gaps recorded when the constitution
was adopted. The gap in issue #69 is unaffected.

## Project Structure

### Documentation (this feature)

```text
specs/003-accessibility-seo/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── page-structure.md
└── tasks.md             # Created by /speckit-tasks
```

### Source Code (repository root)

```text
.specify/memory/constitution.md     # Amendment v1.0.1: job titles may remain untranslated
index.html                          # New icons and theme-color, remove og:image:alt and JSON-LD
src/
├── App.tsx                         # Landmarks and skip link
├── App.css                         # Skip link, global focus rule, panel focus, toggle ring, error page
├── NotFound.tsx                    # New: the error page
├── entry-server.tsx                # Per-language og:image:alt and JSON-LD, render the error page
└── locales/en.json, fr.json        # New keys, French apostrophes
scripts/prerender.ts                # Write 404.html, without the module script
public/
├── favicon.svg                     # New
├── favicon-32.png                  # New
└── apple-touch-icon.png            # New
lighthouserc.json                   # Add /404.html
README.md                           # Document the error page
```

**Structure Decision**: Keep the existing single-project layout. `NotFound.tsx` sits beside `App.tsx`
because both are page-level components rendered by `entry-server.tsx`.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Principle IV: the error page doesn't have one URL per language | GitHub Pages serves one root `404.html` for every missing path | Detecting the language from the URL needs JavaScript, which breaks Principle II for that page |
