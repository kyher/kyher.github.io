---

description: "Task list for fixing the small site bugs in issue #66"
---

# Tasks: Fix Small Site Bugs

**Input**: Design documents from `specs/001-fix-small-bugs/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/first-load-behaviour.md, quickstart.md

**Tests**: Included for the first-load script only, because plan.md and research.md (R7) make that test a deliverable under the constitution's Development Workflow. The other stories are verified with quickstart.md.

**Organization**: Tasks are grouped by user story so that each story can be implemented and tested independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1 to US5)
- Paths are relative to the repository root

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add the test command and a harness that runs the first-load script without a browser

- [X] T001 Add the script `"test": "node --test \"scripts/**/*.test.ts\""` to `scripts` in package.json, with no new dependencies
- [X] T002 Create scripts/first-load.test.ts with a `runFirstLoad({ url, saved, storageBlocked, browserLanguage, prefersDark })` helper. It reads index.html from the repository root, extracts the script with `/<script>([\s\S]*?)<\/script>/` (this matches only the attribute-free tag), and runs it in `node:vm` with stubs for `location` (`pathname`, `search`, `hash`, recording `replace`), `localStorage` (`Map`-backed, or throwing from `getItem` and `setItem` when `storageBlocked` is true), `navigator.language`, `matchMedia`, `document.documentElement.classList`, `history.replaceState` (updating the `location` stub), and `URLSearchParams`. It returns `{ redirectedTo, saved, address, dark }`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Storage helpers that the language and theme stories both use

**⚠️ CRITICAL**: US1 and US4 can't begin until this phase is complete. US2, US3 and US5 don't depend on it.

- [X] T003 In the inline script in index.html, add two helpers at the top of the function, before the existing `try`: `readStored(key)` returns `localStorage.getItem(key)` or `null` if it throws, and `writeStored(key, value)` returns `true` after `localStorage.setItem(key, value)` or `false` if it throws. Use ES5-style syntax to match the existing script

**Checkpoint**: Helpers exist and existing behaviour is unchanged

---

## Phase 3: User Story 1 - Language choice is always respected (Priority: P1) 🎯 MVP

**Goal**: A language chosen through any way of opening a link is displayed and remembered, and it works with storage blocked

**Independent Test**: With a French browser language, open the English link by click, middle-click, Ctrl/Cmd-click and "open in new tab", and confirm the English page appears each time without redirecting (quickstart scenarios 1 to 4)

### Tests for User Story 1

> **NOTE: Write these tests FIRST and confirm they FAIL before implementing**

- [X] T004 [US1] In scripts/first-load.test.ts, add one test for each row of the "Behaviour at `/`" table in contracts/first-load-behaviour.md, a test that `/fr/` never redirects and saves a valid `lang`, and tests for these "Address handling" rows: `/?lang=en&a=1#x` with save succeeded gives `/?a=1#x`, `/?lang=en` with save succeeded gives `/`, `/?lang=en` with save failed is unchanged, and `/?lang=de` is unchanged

### Implementation for User Story 1

- [X] T005 [US1] In index.html, move the language logic outside the `try`. Read `lang` with `new URLSearchParams(location.search)` and accept only `en` or `fr`. "An invalid `lang` value is ignored and left in the address." For a valid value, call `writeStored('language', value)`, and if that returns `true`, delete `lang` and call `history.replaceState(null, '', pathname + remainingQuery + location.hash)`, adding `?` only when parameters remain. Resolve the preference as valid `lang`, then `readStored('language')`, then `(navigator.language || '').slice(0, 2)`. "Only the resolved value `fr` at the path `/` causes a redirect."
- [X] T006 [P] [US1] In src/helpers/language.ts, add and export ``languageHref = (language: SupportedLanguage) => `${languagePaths[language]}?lang=${language}` ``, leaving `languagePaths` unchanged so that canonical and `hreflang` output stays the same
- [X] T007 [US1] In src/components/LanguageSelect.tsx, set each link's `href` to `languageHref(code)`, remove `rememberLanguage`, the `onClick` prop and the `LANGUAGE_STORAGE_KEY` import, and update the top comment to say the link carries the choice for the first-load script (depends on T006)
- [X] T008 [US1] In src/i18n.ts, remove the `LANGUAGE_STORAGE_KEY` export and its comment (depends on T007)

**Checkpoint**: `npm test` passes for all US1 rows, and User Story 1 works on its own

---

## Phase 4: User Story 2 - Footer never shows an outdated year (Priority: P2)

**Goal**: The footer can't go stale and needs no JavaScript

**Independent Test**: Build the site and confirm both pages show `© Kyle Heron` with no year (quickstart scenario 8)

### Implementation for User Story 2

- [X] T009 [P] [US2] In src/App.tsx at line 131, replace the footer with `<footer className="site-footer">© Kyle Heron</footer>`, removing `new Date().getFullYear()` and `suppressHydrationWarning`

**Checkpoint**: User Story 2 works on its own

---

## Phase 5: User Story 3 - Headings read well on every device (Priority: P2)

**Goal**: All visitors get system fonts with legible heading spacing, and no font is downloaded

**Independent Test**: Load the page, confirm no font requests, and inspect headings at 320px, 768px and 1280px in both languages (quickstart scenarios 10 and 11)

### Implementation for User Story 3

- [X] T010 [P] [US3] In src/index.css at line 6, remove `Inter, ` so the stack begins with `ui-sans-serif`
- [X] T011 [P] [US3] In src/App.css, set `letter-spacing` as follows: `.brand` (line 18) to `-.02em`, `.hero h1` (line 81) to `-.03em`, `.section-heading h2` (line 140) to `-.025em`, `.employer-heading h3, .education h3` (line 148) to `-.015em`, `.project-name` (line 207) to `-.015em`, and `.contact-panel h2` (line 226) to `-.025em`. Leave `.eyebrow` unchanged

**Checkpoint**: User Story 3 works on its own

---

## Phase 6: User Story 4 - System theme works when storage is blocked (Priority: P3)

**Goal**: The system theme applies before first paint even when storage can't be read

**Independent Test**: Block site storage, set the system to dark, load the page, and confirm dark from first paint (quickstart scenarios 6 and 7)

### Tests for User Story 4

> **NOTE: Write these tests FIRST and confirm they FAIL before implementing**

- [X] T012 [US4] In scripts/first-load.test.ts, add tests for theme resolution: storage blocked with system dark gives dark, storage blocked with system light gives not dark, saved `light` with system dark gives not dark, saved `dark` with system light gives dark, and no saved value follows the system

### Implementation for User Story 4

- [X] T013 [US4] In index.html, move the theme logic outside the `try` and read it with `readStored('theme')`, keeping the rule that `stored === 'dark'` or no stored value with a dark `prefers-color-scheme` adds the `dark` class, then remove the `try`/`catch` if nothing is left inside it

**Checkpoint**: `npm test` passes for all US4 rows, and User Story 4 works on its own

---

## Phase 7: User Story 5 - Campaign links survive the language redirect (Priority: P3)

**Goal**: The French redirect keeps query parameters and section anchors unchanged

**Independent Test**: With a French browser language, open `/?utm_source=x&b=2#projects` and confirm the address becomes `/fr/?utm_source=x&b=2#projects` (quickstart scenario 5)

### Tests for User Story 5

> **NOTE: Write these tests FIRST and confirm they FAIL before implementing**

- [X] T014 [US5] In scripts/first-load.test.ts, add tests for these "Address handling" rows from contracts/first-load-behaviour.md: redirecting from `/?a=1#x` gives `/fr/?a=1#x`, and redirecting from `/` gives exactly `/fr/` with no trailing `?` or `#`

### Implementation for User Story 5

- [X] T015 [US5] In index.html, change the redirect to `location.replace('/fr/' + location.search + location.hash)`

**Checkpoint**: All user stories work independently

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Wire tests into CI, update documentation, and validate the whole feature

- [X] T016 [P] In .github/workflows/ci.yml, add a step named `Test` that runs `npm test` straight after the `Lint` step in the `lint` job
- [X] T017 [P] In README.md, add `npm test` to the Development commands, explain in "How pages are built" that language links carry `?lang=` and that the first-load script saves it and removes it from the address, and update the Deployment section to say pull requests also run tests
- [X] T018 Using the scripts in package.json, run `npm run lint`, `npm test` and `npm run build`, and fix any failures
- [ ] T019 Run all scenarios and the quality gates in specs/001-fix-small-bugs/quickstart.md, adjusting the `letter-spacing` values in src/App.css if scenario 11 shows touching letters or overflow

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies
- **Foundational (Phase 2)**: Depends on Setup, and blocks US1 and US4
- **User Stories (Phases 3 to 7)**: Each can be delivered after its prerequisites
- **Polish (Phase 8)**: Depends on all stories being complete

### User Story Dependencies

- **US1 (P1)**: Depends on Foundational
- **US2 (P2)**: No dependencies
- **US3 (P2)**: No dependencies
- **US4 (P3)**: Depends on Foundational
- **US5 (P3)**: Depends on Setup for its tests

US1, US4 and US5 all edit the inline script in index.html and add to scripts/first-load.test.ts, so work through them in sequence.

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- T006 before T007 before T008

### Merge Safety

After T005, a storage failure no longer skips the redirect. Visitors with a French browser and storage blocked can then only reach English through a link carrying `lang`, so ship T005, T006 and T007 together.

### Parallel Opportunities

- T006 can run alongside T005
- T009, T010 and T011 are independent of each other and of every other story
- T016 and T017 can run together

---

## Parallel Example: Independent Stories

```bash
# These touch separate files and have no dependencies:
Task: "Remove the year from the footer in src/App.tsx"
Task: "Remove Inter from the font stack in src/index.css"
Task: "Loosen heading letter spacing in src/App.css"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Run `npm test` and quickstart scenarios 1 to 4

### Incremental Delivery

1. Setup and Foundational
2. US1, the only bug that can stop a visitor reading their chosen language
3. US2 and US3, which are small and visible to every visitor
4. US4 and US5, which finish the inline script
5. Polish, then one pull request closing issue #66

---

## Notes

- [P] tasks touch different files and have no dependencies on incomplete tasks
- [Story] labels map each task to a story in spec.md
- Confirm the tests fail before implementing
- Commit after each phase or logical group
