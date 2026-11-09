---

description: "Task list for improving accessibility and SEO in issue #67"
---

# Tasks: Improve Accessibility and SEO

**Input**: Design documents from `specs/003-accessibility-seo/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/page-structure.md, quickstart.md

**Tests**: No new tests. The spec doesn't request any, the existing `npm test` still runs, Lighthouse now covers the error page, and quickstart.md covers the rest. The constitution amendment to v1.0.1 was made during planning and only needs committing.

**Organization**: Tasks are grouped by user story so that each story can be implemented and tested independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1 to US4)
- Paths are relative to the repository root

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Capture the visual baseline before any code changes

- [X] T001 Following section 1 of specs/003-accessibility-seo/quickstart.md, run `npm run build` on the unchanged code, copy `dist/` outside the repository, and capture full-page screenshots of `/` and `/fr/` at 320px, 768px and 1280px in light and dark

---

## Phase 2: Foundational (Blocking Prerequisites)

No foundational work is needed. The baseline in Phase 1 is the only prerequisite shared by every story.

---

## Phase 3: User Story 1 - Keyboard and screen reader users can move around the page (Priority: P1) 🎯 MVP

**Goal**: Correct landmarks, a working skip link, and a focus indicator of at least 3:1 on every focusable item in both themes

**Independent Test**: With only a keyboard and the browser's accessibility tools, skip to the main content, list the landmarks, and tab through the whole page in both themes (quickstart scenarios 1 to 4)

### Implementation for User Story 1

- [X] T002 [US1] Add `a11y.skipToContent` to src/locales/en.json with the value "Skip to main content" and to src/locales/fr.json with the value "Aller au contenu principal"
- [X] T003 [US1] In src/App.tsx, change the outer `<main className="site-shell">` to `<div className="site-shell">` and its closing tag to `</div>`, add `<a className="skip-link" href="#main">{t("a11y.skipToContent")}</a>` as its first child, and wrap every `<section>` from the hero to the contact section in `<main id="main" tabIndex={-1}>`, leaving the `<header>`, the main `<nav>` and the `<footer>` outside it
- [X] T004 [P] [US1] In src/App.css, add `.skip-link { position: absolute; top: 8px; left: 8px; z-index: 10; padding: 10px 16px; border-radius: 999px; background: var(--accent); color: var(--on-accent); font-size: .92rem; font-weight: 700; text-decoration: none; transform: translateY(-200%); }`, `.skip-link:focus { transform: none; }` and `main:focus { outline: none; }` directly after the `.site-shell` rule
- [X] T005 [US1] In src/App.css, replace the rule `.project-card:focus-visible, .button:focus-visible, .main-nav a:focus-visible, .text-link:focus-visible { outline: 3px solid var(--accent); outline-offset: 4px; }` with `:focus-visible { outline: 3px solid var(--accent); outline-offset: 4px; }` and `.contact-panel :focus-visible { outline-color: var(--page); }`, and change the `.theme-toggle:focus-visible` box shadow to `0 0 0 2px var(--accent)` (depends on T004, which edits the same file)

**Checkpoint**: User Story 1 works on its own on both language pages

---

## Phase 4: User Story 2 - French visitors read French throughout (Priority: P2)

**Goal**: French sharing text and structured data, with typographic apostrophes, and with employment history job titles left in English

**Independent Test**: Read the French page's visible text, `og:image:alt` and JSON-LD, and compare the English page's metadata with the baseline (quickstart scenarios 5 and 6)

### Implementation for User Story 2

- [X] T006 [US2] In src/locales/fr.json, replace every straight apostrophe in `profile.description` with `’`, leaving all other values unchanged
- [X] T007 [US2] Add `meta.imageAlt` to src/locales/en.json with the value "Kyle Heron, Senior Software Engineer" and to src/locales/fr.json with the value "Kyle Heron, ingénieur logiciel senior" (depends on T006, which edits the same file)
- [X] T008 [US2] In src/entry-server.tsx, add to the per-language head a `<meta property="og:image:alt" ... />` using an escaped `t("meta.imageAlt")`, and a `<script type="application/ld+json">` containing the Person object currently in index.html with `jobTitle` set to `t("hero.title")`, serialised with `JSON.stringify` and with every `<` replaced by `<`
- [X] T009 [US2] In index.html, remove the `og:image:alt` meta tag and the whole `<script type="application/ld+json">` block (depends on T008)

**Checkpoint**: User Story 2 works on its own

---

## Phase 5: User Story 3 - A wrong address still leads somewhere useful (Priority: P2)

**Goal**: A prerendered error page, carrying both languages, with a way home and a contact route

**Independent Test**: Serve the build with a fallback to `404.html` and open `/nope`, `/a/b/c` and `/fr/nope`, with and without scripts (quickstart scenarios 7 to 10)

### Implementation for User Story 3

- [X] T010 [US3] Add `notFound.title`, `notFound.description` and `notFound.home` to src/locales/en.json with the values "Page not found", "This page doesn’t exist or has moved." and "Back to the home page", and to src/locales/fr.json with the values "Page introuvable", "Cette page n’existe pas ou a été déplacée." and "Retour à l’accueil"
- [X] T011 [US3] Create src/NotFound.tsx exporting a default component with props `{ en: TFunction; fr: TFunction }` that renders `<div className="site-shell">` containing: a `.skip-link` to `#main` showing the English text and the French text in a `<span lang="fr">`; a `<header className="site-header">` with `<a className="brand" href="/">KH<span aria-hidden="true">.</span><span className="sr-only"> — Kyle Heron</span></a>`; `<main id="main" tabIndex={-1} className="not-found">` holding an `<h1>` with the English title and the French title in a `<span lang="fr">`, then for each language a `<section lang={code} className="not-found-block">` with the description in a `<p>` and a `.hero-actions` div containing `<a className="button" href={languageHref(code)}>` showing `notFound.home` and `<a className="button button-secondary">` using the same `mailto:` address as src/App.tsx and showing `contact.email`; and `<footer className="site-footer">© Kyle Heron</footer>` (depends on T003 and T010)
- [X] T012 [P] [US3] In src/App.css, add `.not-found { padding: clamp(48px, 8vw, 96px) 0; }`, `.not-found h1 { margin-bottom: 32px; font-size: clamp(2rem, 5vw, 3.2rem); line-height: 1.1; letter-spacing: -.03em; }`, `.not-found h1 span { color: var(--muted); }`, `.not-found-block { padding: 24px 0; border-top: 1px solid var(--line); }` and `.not-found-block p { color: var(--muted); }` before the `@media (max-width: 700px)` rule
- [X] T013 [US3] In src/entry-server.tsx, give each page `output` (`index.html` for English and `fr/index.html` for French) and `hydrate: true` in place of `path`, and add a page to `renderPages` with `language: "en"`, `output: "404.html"`, `hydrate: false`, an escaped title of `${en("notFound.title")} · ${fr("notFound.title")} — Kyle Heron`, a head containing only a `<meta name="description">` with both escaped descriptions, and `html` from `renderToString` of `<NotFound en={en} fr={fr} />` (depends on T008 and T011)
- [X] T014 [US3] In scripts/prerender.ts, update the `Page` type to `{ language: string; output: string; title: string; head: string; html: string; hydrate: boolean }`, remove the module script with `replaceOnce(html, /<script type="module"[^>]*><\/script>\s*/, "")` when `hydrate` is false, write to `path.join(distDir, page.output)` after creating its parent directory, and log `page.output` (depends on T013)
- [X] T015 [P] [US3] In lighthouserc.json, add `"http://localhost/404.html"` to the `url` array
- [X] T016 [P] [US3] In README.md, add to "How pages are built" that `dist/404.html` is prerendered with both languages and no client JavaScript, because GitHub Pages serves one error page for every missing path

**Checkpoint**: User Story 3 works, using the skip link and focus styles from User Story 1

---

## Phase 6: User Story 4 - The site is recognisable in the browser (Priority: P3)

**Goal**: A "KH." browser icon, a phone home screen icon, and a browser interface colour

**Independent Test**: View the tab icon in light and dark browser themes and add the site to a phone's home screen (quickstart scenarios 11 and 12)

### Implementation for User Story 4

- [X] T017 [P] [US4] Create public/favicon.svg with `viewBox="0 0 32 32"`, a `<rect width="32" height="32" rx="7" fill="#7545c4"/>`, a `<path>` with `d="M5.5 9v14M13.5 9 7 16l6.5 7M16.5 9v14M24 9v14M16.5 16h7.5"`, `stroke="#fff"`, `stroke-width="2.6"` and `fill="none"`, and `<circle cx="27.6" cy="21.6" r="1.7" fill="#fff"/>`, adjusting the shapes only if they aren't legible at 16px
- [X] T018 [US4] Generate public/favicon-32.png at 32×32 and public/apple-touch-icon.png at 180×180 as one-off outputs of the same design with square, opaque corners, and commit only the PNG files (depends on T017)
- [X] T019 [US4] In index.html, replace the emoji `<link rel="icon">` with, in this order, `<link rel="icon" href="/favicon-32.png" type="image/png" sizes="32x32" />`, `<link rel="icon" href="/favicon.svg" type="image/svg+xml" sizes="any" />` and `<link rel="apple-touch-icon" href="/apple-touch-icon.png" />`, and add `<meta name="theme-color" media="(prefers-color-scheme: light)" content="#fbf8f4" />` and `<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#17151b" />` (depends on T018)

**Checkpoint**: All user stories are complete

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Validate the whole feature against the baseline and quality gates

- [X] T020 Run `npm run lint`, `npm test` and `npm run build` using package.json, fix any failures, and confirm dist/404.html exists with no `type="module"` script
- [X] T021 Following section 3 of specs/003-accessibility-seo/quickstart.md, repeat the screenshots and compare them with the baseline, investigating and fixing any differences other than the apostrophes in the French profile paragraph
- [ ] T022 Run scenarios 1 to 13 in section 4 of specs/003-accessibility-seo/quickstart.md
- [ ] T023 After the pull request is opened, confirm that Lighthouse passes on all three pages as described in section 5 of specs/003-accessibility-seo/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies, and MUST be done before any code changes
- **User Stories (Phases 3 to 6)**: Depend on Setup
- **Polish (Phase 7)**: Depends on all stories being complete

### User Story Dependencies

- **US1 (P1)**: Depends only on Setup
- **US2 (P2)**: Depends only on Setup
- **US3 (P2)**: Depends on US1 for the skip link and focus styles, and on T008 because both edit the head output in src/entry-server.tsx
- **US4 (P3)**: Depends only on Setup

### Within Each User Story

- T003 follows T002, and T005 follows T004
- T006 before T007, and T008 before T009
- T010 before T011, then T013, then T014
- T017 before T018, then T019

### Merge Safety

T008 and T009 must ship together, or the French metadata is either duplicated or missing. T013 and T014 must also ship together, because they change the shape of the page data they share.

### Parallel Opportunities

- T004 can run alongside T003
- T012, T015 and T016 touch separate files from the rest of US3, although T012 shares src/App.css with US1
- T017 is independent of everything else

---

## Parallel Example: User Story 3

```bash
# These touch separate files and have no dependencies on each other:
Task: "Add the error page styles in src/App.css"
Task: "Add the error page to lighthouserc.json"
Task: "Document the error page in README.md"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 3: User Story 1
3. **STOP and VALIDATE**: Run quickstart scenarios 1 to 4 and the pixel comparison

### Incremental Delivery

1. Capture the baseline
2. US1, the constitution's non-negotiable principle
3. US2, then US3, which are both visible to real visitors
4. US4, the finishing polish
5. Polish, then one pull request closing issue #67 that notes the role titles stay in English

---

## Notes

- [P] tasks touch different files and have no dependencies on incomplete tasks
- [Story] labels map each task to a story in spec.md
- Capture the baseline before changing any code
- Commit after each phase or logical group
