---

description: "Task list for simplifying the frontend in issue #68"
---

# Tasks: Simplify the Frontend

**Input**: Design documents from `specs/002-simplify-frontend/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: No new tests. The spec doesn't request any, the existing `npm test` still runs, and visual output is checked with the pixel comparison in quickstart.md.

**Organization**: Tasks are grouped by user story so that each story can be implemented and tested independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1 or US2)
- Paths are relative to the repository root

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Capture the visual baseline before any code changes

- [X] T001 Following section 1 of specs/002-simplify-frontend/quickstart.md, run `npm run build` on the unchanged code and capture 12 full-page screenshots outside the repository, covering `/` and `/fr/` at 320px, 768px and 1280px in light and dark

---

## Phase 2: Foundational (Blocking Prerequisites)

No foundational work is needed. The baseline in Phase 1 is the only prerequisite for both stories.

---

## Phase 3: User Story 1 - One way to style the site (Priority: P1) 🎯 MVP

**Goal**: Tailwind is gone, the hand-written stylesheets are the only styling approach, and the site looks identical

**Independent Test**: Compare all 12 combinations of width, language and theme against the baseline, and confirm that no Tailwind package, plugin or import remains (quickstart sections 2 and 3)

### Implementation for User Story 1

- [X] T002 [US1] In src/index.css, delete `@import "tailwindcss";` and the `@custom-variant dark` line, delete the existing `* { box-sizing: border-box; }`, `a { color: inherit; }` and `button, select { font: inherit; }` rules, and add at the top an `@layer reset { ... }` block with exactly these rules: `*, ::before, ::after, ::backdrop { box-sizing: border-box; margin: 0; padding: 0; border: 0 solid; }`, `html { -webkit-text-size-adjust: 100%; -webkit-tap-highlight-color: transparent; }`, `h1, h2, h3, h4, h5, h6 { font-size: inherit; font-weight: inherit; }`, `a { color: inherit; text-decoration: inherit; }`, `ol, ul, menu { list-style: none; }`, `img, svg { display: block; vertical-align: middle; }`, `img { max-width: 100%; height: auto; }`, `button { font: inherit; letter-spacing: inherit; color: inherit; border-radius: 0; background-color: transparent; opacity: 1; appearance: button; }`, `:-moz-focusring:where(:not(iframe)) { outline: auto; }`
- [X] T003 [US1] In src/index.css, add to `:root` the tokens `--divider: oklch(87.2% .01 258.338);`, `--toggle: oklch(55.1% .027 264.364);` and `--toggle-hover: oklch(27.8% .033 256.848);`, add to `:root.dark` the tokens `--divider: oklch(44.6% .03 256.802);`, `--toggle: oklch(70.7% .022 261.325);` and `--toggle-hover: oklch(92.8% .006 264.531);`, and add the rule `.sr-only { position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden; clip-path: inset(50%); white-space: nowrap; border-width: 0; }`
- [X] T004 [P] [US1] In src/App.css, directly after the `.language-option:focus-visible` rule, add `.header-divider { width: 1px; height: 1.25rem; background: var(--divider); }`, `.theme-toggle { display: flex; cursor: pointer; color: var(--toggle); border-radius: .25rem; transition: color .15s cubic-bezier(.4, 0, .2, 1); }`, `@media (hover: hover) { .theme-toggle:hover { color: var(--toggle-hover); } }` and `.theme-toggle:focus-visible { outline: none; box-shadow: 0 0 0 2px oklch(62.7% .265 303.9); }`
- [X] T005 [P] [US1] In src/App.tsx, replace the divider's `className="h-5 w-px bg-gray-300 dark:bg-gray-600"` with `className="header-divider"`
- [X] T006 [P] [US1] In src/components/ThemeToggle.tsx, replace the button's whole `className` value with `"theme-toggle"`
- [X] T007 [P] [US1] In vite.config.ts, remove the `import tailwindcss from '@tailwindcss/vite'` line and the `tailwindcss()` plugin entry, keeping `react()`
- [X] T008 [US1] Run `npm uninstall tailwindcss @tailwindcss/vite` to update package.json and package-lock.json (depends on T002 and T007)
- [X] T009 [P] [US1] In README.md, change the stack line to "Built with React, TypeScript and Vite, with English and French translations via i18next."

**Checkpoint**: The site builds without Tailwind and User Story 1 can be compared against the baseline

---

## Phase 4: User Story 2 - No dead code (Priority: P2)

**Goal**: The placeholder artwork and redundant CSS are gone, and every project must have a screenshot

**Independent Test**: Confirm no `gradient` or `project-art` remains, that project cards match the baseline, and that removing a project's `image` fails the build (quickstart scenarios 6 and 8)

### Implementation for User Story 2

- [X] T010 [P] [US2] In src/data/portfolio.ts, remove the `gradient` field from all three entries in `featured`. "`gradient` | Removed | Only used by the placeholder artwork"
- [X] T011 [US2] In src/components/ProjectTile.tsx, remove the `gradient` parameter and its type, change `image?: string` to `image: string`, and always render the `<img>`, removing the conditional and the `project-art` branch. "`image` | **Yes** | Previously optional. A project without one fails the build" (depends on T010)
- [X] T012 [P] [US2] In src/App.css, remove the `.project-art` part of the shared selectors so they read `.project-image {`, `.project-featured .project-image { height: 100%; min-height: 340px; }` and, inside the 700px media query, `.project-featured .project-image { height: 240px; min-height: 0; }`. Delete the standalone `.project-art { ... }` block
- [X] T013 [US2] In src/App.css, delete `.featured-secondary { grid-template-columns: repeat(2, minmax(0, 1fr)); }` from the 700px media query and the `.project-image, .project-art { height: 190px; }` rule from the 440px media query, keeping the `.featured-secondary { grid-template-columns: 1fr; }` rule (depends on T012)

**Checkpoint**: Both user stories are complete

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Validate the whole feature against the baseline and quality gates

- [X] T014 Run `npm ci`, `npm run lint`, `npm test` and `npm run build` using package.json, and fix any failures
- [X] T015 Following section 3 of specs/002-simplify-frontend/quickstart.md, repeat the 12 screenshots and compare each with its baseline pixel by pixel, investigating and fixing any differences in src/index.css or src/App.css
- [X] T016 Run scenarios 1 to 8 in section 4 of specs/002-simplify-frontend/quickstart.md, restoring src/data/portfolio.ts after scenario 6
- [X] T017 After the pull request is opened, confirm that Lighthouse passes as described in section 5 of specs/002-simplify-frontend/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies, and MUST be done before any code changes
- **User Stories (Phases 3 and 4)**: Depend on Setup
- **Polish (Phase 5)**: Depends on both stories being complete

### User Story Dependencies

- **US1 (P1)**: Depends only on Setup
- **US2 (P2)**: Depends only on Setup. Until it's done, the unused placeholder branch still names Tailwind classes, but they have no effect

### Within Each User Story

- T002 before T003, because both edit src/index.css
- T007 and T002 before T008, because Tailwind can't be uninstalled while it's still imported
- T010 before T011, and T012 before T013

### Merge Safety

T002 to T008 must ship together. A partial change either leaves the reset applied twice or removes Tailwind's reset with nothing to replace it.

### Parallel Opportunities

- T004, T005, T006, T007 and T009 touch separate files, and can run alongside T002 and T003
- T010 and T012 touch separate files

---

## Parallel Example: User Story 1

```bash
# These touch separate files and have no dependencies on each other:
Task: "Add the toggle and divider styles in src/App.css"
Task: "Use the new divider class in src/App.tsx"
Task: "Use the new toggle class in src/components/ThemeToggle.tsx"
Task: "Remove the Tailwind plugin from vite.config.ts"
Task: "Update the stack line in README.md"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 3: User Story 1
3. **STOP and VALIDATE**: Run the pixel comparison in T015

### Incremental Delivery

1. Capture the baseline
2. US1, which holds the only real regression risk
3. US2, a small tidy-up
4. Polish, then one pull request closing issue #68 that records the decision to take no action on script size

---

## Notes

- [P] tasks touch different files and have no dependencies on incomplete tasks
- [Story] labels map each task to a story in spec.md
- Capture the baseline before changing any code, because it can't be recreated exactly afterwards without reverting
- Commit after each phase or logical group
