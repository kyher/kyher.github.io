# Implementation Plan: Simplify the Frontend

**Branch**: `cleanup-frontend` | **Date**: 2026-11-09 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/002-simplify-frontend/spec.md`

## Summary

Remove Tailwind and keep the hand-written stylesheets, with no visible change. A small layered reset
replaces the parts of Tailwind's reset that the site depends on, and the few utility classes become
ordinary CSS with the same resolved values. The unused placeholder artwork and two redundant rules
are removed, and a project without a screenshot now fails the build. See [research.md](research.md).

## Technical Context

**Language/Version**: TypeScript 5.9 on Node 24, and CSS

**Primary Dependencies**: React 19, i18next, Vite 8. Removes `tailwindcss` and `@tailwindcss/vite`.

**Storage**: N/A

**Testing**: ESLint, `tsc`, the existing `npm test`, Lighthouse CI, and a one-off pixel comparison

**Target Platform**: Current evergreen browsers, static hosting on GitHub Pages

**Project Type**: Static prerendered website

**Performance Goals**: Lighthouse performance at 90 or above, and gzipped CSS of 5.4 KB or less

**Constraints**: No visual differences at any of the 12 width, language and theme combinations

**Scale/Scope**: Two prerendered pages and about eight small file changes

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Rule | Assessment | Before design | After design |
|---|---|---|---|
| I. Content Serves the Reader | No content changes | Pass | Pass |
| II. Static and Prerendered | Prerendering and no-JavaScript behaviour are untouched | Pass | Pass |
| III. Accessible by Default | Focus ring, colours and screen reader text keep their exact values in both themes | Pass | Pass |
| IV. Bilingual Parity | No strings change | Pass | Pass |
| V. Lightweight and Simple | Removes two dependencies and all dead code named in the issue | Pass | Pass |
| Technical Constraints | Replacing a styling system must be specified and planned first, which this does | Pass | Pass |
| Development Workflow | Quickstart covers both themes, both languages and three widths | Pass | Pass |

No violations. The known gaps from issues #67 and #69 are unaffected.

## Project Structure

### Documentation (this feature)

```text
specs/002-simplify-frontend/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── tasks.md             # Created by /speckit-tasks
```

There's no `contracts/` directory because this feature changes no external interface. The existing
contract in `specs/001-fix-small-bugs/contracts/` still applies.

### Source Code (repository root)

```text
src/
├── index.css                       # Drop Tailwind imports, add reset layer, tokens and .sr-only
├── App.css                         # Add toggle and divider styles, remove dead and redundant rules
├── App.tsx                         # Use the new divider class
├── components/ThemeToggle.tsx      # Use the new toggle class
├── components/ProjectTile.tsx      # Require image, remove placeholder artwork
└── data/portfolio.ts               # Remove gradient fields
vite.config.ts                      # Remove the Tailwind plugin
package.json, package-lock.json     # Remove both Tailwind packages
README.md                           # Remove Tailwind from the stack description
```

**Structure Decision**: Keep the existing layout. No new files are needed in the application.

## Complexity Tracking

No constitution violations to justify.
