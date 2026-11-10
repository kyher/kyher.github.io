---

description: "Task list for tightening CI, deployment and dev tooling in issue #69"
---

# Tasks: Tighten CI, Deployment and Dev Tooling

**Input**: Design documents from `specs/004-ci-tooling-hardening/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/release-pipeline.md, contracts/generated-files.md, quickstart.md

**Tests**: No new test files. The spec doesn't request any. The translation checks are enforced by `tsc` itself, and the pipeline and output are verified by quickstart.md.

**Organization**: Tasks are grouped by user story so that each story can be implemented and tested independently. `.github/workflows/ci.yml` is edited by US1 and US4, so those tasks run in sequence.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1 to US5)
- Paths are relative to the repository root

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Start from current `master` and capture the output baseline

- [X] T001 Create branch `004-ci-tooling-hardening` from `origin/master` (the `accessibility` branch is already merged as #73), carrying over the untracked `specs/004-ci-tooling-hardening/` and `.specify/feature.json`
- [X] T002 Following the prerequisites in specs/004-ci-tooling-hardening/quickstart.md, run `npm ci && npm run build` on the unchanged code and copy `dist/` to `/tmp/dist-before` as the baseline for later comparisons

---

## Phase 2: Foundational (Blocking Prerequisites)

No foundational work is needed. Each story touches its own files, apart from the shared `ci.yml`, whose order is set in Dependencies.

---

## Phase 3: User Story 1 - Only audited builds go live (Priority: P1) 🎯 MVP

**Goal**: Publish only the `dist` artifact that passed lint, tests and Lighthouse in the same run, in commit order, with least-privilege permissions (FR-001 to FR-005)

**Independent Test**: On the pull request, `deploy` shows as skipped. After merging, `deploy` runs only after lint and lighthouse pass, downloads `dist` without rebuilding, and the site updates (quickstart section 6)

- [X] T003 [US1] In .github/workflows/ci.yml add `workflow_dispatch:` to `on:`, add top-level `permissions: { contents: read }`, and add top-level `concurrency: { group: ci-${{ github.ref }}, cancel-in-progress: ${{ github.ref != 'refs/heads/master' }} }` (research R2, R4)
- [X] T004 [US1] In the `lighthouse` job of .github/workflows/ci.yml change `temporaryPublicStorage: true` to `temporaryPublicStorage: ${{ github.event_name == 'pull_request' }}` and keep `uploadArtifacts: true` (research R3)
- [X] T005 [US1] Add a `deploy` job to .github/workflows/ci.yml with `needs: [lint, lighthouse]`, `if: github.event_name != 'pull_request' && github.ref == 'refs/heads/master'`, `permissions: { pages: write, id-token: write }`, `environment: { name: github-pages, url: ${{ steps.deployment.outputs.page_url }} }`, `runs-on: ubuntu-latest`, and steps: `actions/download-artifact@v8` (name `dist`, path `dist`), `actions/upload-pages-artifact@v5` (path `dist`), `actions/deploy-pages@v5` (id `deployment`). No checkout, no install, no build, no `configure-pages` (research R1)
- [X] T006 [US1] Delete .github/workflows/deploy.yml
- [X] T007 [US1] Check .github/workflows/ci.yml against every row of specs/004-ci-tooling-hardening/contracts/release-pipeline.md (Triggers, Gates for lint/tests/build/Lighthouse, Published output, Permissions, Ordering), and confirm no other workflow has `pages: write`
- [X] T008 [P] [US1] Rewrite the "Deployment" section of README.md: CI (`.github/workflows/ci.yml`) runs lint, tests, build and Lighthouse on every pull request and push, and only a push or manual run on `master` that passes them all publishes the audited build to GitHub Pages. In the "Lighthouse" section, correct "the prerendered `/` and `/fr/` pages" to include `/404.html`, and say that it runs on pushes to `master` too

**Checkpoint**: The live site can no longer receive an unaudited build. This is deployable on its own.

---

## Phase 4: User Story 2 - Translation mistakes fail before release (Priority: P2)

**Goal**: Every `t()` key, including keys built from data, is checked against English, and English and French must have identical keys (FR-006 to FR-008)

**Independent Test**: Each injected error in quickstart section 1 fails `npx tsc -b` with a message naming the key. The unchanged code typechecks cleanly

- [X] T009 [P] [US2] Create src/i18next.d.ts: `import "i18next"; import type en from "./locales/en.json";` and `declare module "i18next" { interface CustomTypeOptions { defaultNS: "translation"; resources: { translation: typeof en } } }` (research R6 step 1)
- [X] T010 [US2] In src/data/portfolio.ts remove the per-field `as const` on every `period`/`dates` tuple and put `as const` on the whole `experience` array and the whole `featured` array instead, so that `descriptionKey` and `role.type` are literal types. Data-model rule: "Every `featured[].descriptionKey` MUST exist under `projects`" and "Every `experience[].roles[].type` MUST exist under `experience.types`" (research R6 step 2)
- [X] T011 [P] [US2] In src/i18n.ts, directly after the locale imports, add the comment `// Each language must have exactly the same keys as the other.` followed by `fr satisfies typeof en;` and `en satisfies typeof fr;` (research R6 step 3)
- [X] T012 [US2] Run `npx tsc -b` and `npm run lint`, and fix any type errors from the readonly arrays (for example in src/App.tsx or src/helpers/date.ts) without changing rendered output. Then run each injected-error row of quickstart section 1, confirm it fails as described, and revert it

**Checkpoint**: Bilingual parity and data-driven keys are enforced by the typecheck in CI.

---

## Phase 5: User Story 3 - Structured data stays accurate when content changes (Priority: P2)

**Goal**: The JSON-LD employer, skills, profile links and university come from the content data and the locales (FR-009, FR-010)

**Independent Test**: Quickstart section 3. The JSON-LD matches contracts/generated-files.md, and ending the current role removes `worksFor` with no other edit

- [X] T013 [US3] In src/data/portfolio.ts add `export const profiles = { github: "https://github.com/kyher", linkedin: "https://www.linkedin.com/in/kyher/" } as const;` (depends on T010, same file)
- [X] T014 [P] [US3] In src/App.tsx import `profiles` from `./data/portfolio` and replace the three hard-coded profile URLs (the "more on GitHub" link in the projects section, and the GitHub and LinkedIn links in the contact section) with `profiles.github` and `profiles.linkedin`
- [X] T015 [US3] In src/entry-server.tsx change `person(jobTitle)` to `person(t)`, taking the page's `t`. Set `jobTitle: t("hero.title")` and `alumniOf.name: t("education.university")`, `knowsAbout: skills`, and `sameAs: [profiles.github, profiles.linkedin]`. Set `worksFor` from `experience.find((job) => job.period[1] === null)?.company`, and leave the `worksFor` key out entirely when that is undefined (contract rule: "Left out entirely if no entry is current"). Keep `name`, `url`, `image`, `address` and the `<` escaping unchanged
- [X] T016 [US3] Run `npm run build` and quickstart sections 2 and 3: the HTML matches `/tmp/dist-before` apart from the JSON-LD line, the JSON-LD matches specs/004-ci-tooling-hardening/contracts/generated-files.md on both language pages, and temporarily ending the Komodo Digital period removes `worksFor` (then revert)
- [X] T017 [P] [US3] In the "Editing content" section of README.md, note that `src/data/portfolio.ts` also feeds the structured data (employer, skills, profile links), and that a translation key missing from either language, or a project `descriptionKey` with no translation, fails the typecheck

**Checkpoint**: Changing jobs means editing one place.

---

## Phase 6: User Story 4 - Reproducible, trustworthy tooling (Priority: P3)

**Goal**: One declared Node version used everywhere, the linter's recommended rules on the right major, the high dev advisory fixed, and CI gating on production advisories (FR-011 to FR-014)

**Independent Test**: Quickstart section 5. Lint and recommended rules are on major 10, the production audit passes, the only dev advisory is the recorded minimatch one, and the wrong Node major stops with `EBADDEVENGINES`

- [X] T018 [US4] Bump `@eslint/js` to 10 by merging Dependabot PR #76 into `master` and rebasing this branch, or, if #76 isn't merged, run `npm install -D @eslint/js@^10.0.1` here and close #76. Then confirm `npm run lint` passes (research R8)
- [X] T019 [US4] Add `"devEngines": { "runtime": { "name": "node", "version": "^24", "onFail": "error" } }` to package.json (research R5)
- [X] T020 [US4] Run `npm audit fix`. Do NOT use `--force` or add `overrides`. Confirm that only package-lock.json changes, that zod is now at least 4.6.6, and that `npm audit` shows no high findings (research R9)
- [X] T021 [US4] In .github/workflows/ci.yml replace `node-version: lts/*` with `node-version-file: package.json` in every `setup-node` step, and add a step `Audit production dependencies` running `npm audit --omit=dev --audit-level=high` to the `lint` job after `npm ci` (after T005; same file)
- [X] T022 [P] [US4] Add to README.md: a short "Requirements" note under "Development" saying Node 24 is required (declared in `devEngines` in package.json, used by CI, and enforced by npm), and a "Dependencies" section saying CI fails on high or critical production advisories, recording the accepted dev-only advisory minimatch GHSA-g3hv-75wg-m249 (fixed in 11.0.1, which ESLint 10 doesn't accept yet; only matches globs from this repository's own config) to revisit when ESLint allows minimatch 11
- [X] T023 [US4] Run quickstart section 5: `npm ls @eslint/js eslint` shows major 10 for both, `npm audit --omit=dev --audit-level=high` exits 0, and running under another Node major (for example `npx -p node@22 npm run build`) stops with `EBADDEVENGINES`

**Checkpoint**: Tooling matches between local and CI, and the production advisory rule is enforced.

---

## Phase 7: User Story 5 - Sitemap follows the published languages (Priority: P3, optional)

**Goal**: The sitemap is generated from the same language list as the `hreflang` tags (FR-015)

**Independent Test**: Quickstart section 4. `dist/sitemap.xml` has the same URLs and alternates as the baseline, and doesn't list `404.html`

- [X] T024 [US5] In src/entry-server.tsx export `renderSitemap()`, which returns the sitemap XML: one `<url>` per entry in `languages`, with `<loc>` = `SITE_URL + languagePaths[language]`, an `xhtml:link rel="alternate"` for every language plus `x-default` pointing to `${SITE_URL}/`, in the same namespaces as the current public/sitemap.xml (after T015; same file)
- [X] T025 [US5] In scripts/prerender.ts add `renderSitemap` to the typed import from the SSR entry, and write its output to `dist/sitemap.xml` before `dist-ssr` is removed
- [X] T026 [US5] Delete public/sitemap.xml, run `npm run build`, and compare `dist/sitemap.xml` with `/tmp/dist-before/sitemap.xml` per quickstart section 4. Leave public/robots.txt unchanged

**Checkpoint**: Every item in issue #69 is resolved.

---

## Phase 8: Polish & Cross-Cutting Concerns

- [X] T027 Run `npm run lint`, `npm test` and `npm run build`, then `npx @lhci/cli@0.16.0 autorun`, and confirm accessibility, best practices and SEO are 100 on `/`, `/fr/` and `/404.html` (SC-007)
- [X] T028 Open a pull request that closes #69. Its description gives the verdict for each issue item from the spec's Change Assessment, links #76 if it was used, and recommends enabling branch protection on `master` as a follow-up. Confirm the pull request run shows `deploy` skipped and Lighthouse with a public report link (quickstart section 6, step 1)
- [ ] T029 After merging, check the first `master` run per quickstart section 6, steps 2 and 4: `deploy` waits for lint and lighthouse, has no install or build step, and the live site updates. Optionally do step 3, the deliberate failing commit

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: first. T002's baseline is needed by T016 and T026.
- **US1 (Phase 3)**: independent of the other stories, and the MVP.
- **US2 (Phase 4)**: independent of US1.
- **US3 (Phase 5)**: T013 comes after T010 (both edit `portfolio.ts`). Otherwise independent.
- **US4 (Phase 6)**: T021 comes after T005 (both edit `ci.yml`). T018 to T020 don't depend on other stories.
- **US5 (Phase 7)**: T024 comes after T015 (both edit `entry-server.tsx`).
- **Polish (Phase 8)**: after all chosen stories.

### Shared files (sequential)

| File | Tasks, in order |
|---|---|
| .github/workflows/ci.yml | T003 → T004 → T005 → T021 |
| src/data/portfolio.ts | T010 → T013 |
| src/entry-server.tsx | T015 → T024 |
| package.json / package-lock.json | T018 → T019 → T020 |
| README.md | T008, T017, T022 (separate sections, but the same file: apply one at a time) |

### Parallel Opportunities

- After Setup, US1 (T003 to T008) and US2 (T009 to T012) can proceed at the same time.
- In US2, T009 and T011 are different files from T010.
- In US3, T014 (`App.tsx`) can run alongside T015 (`entry-server.tsx`) once T013 is done.
- In US4, T018 to T020 (packages) can run alongside US1's workflow edits, provided T021 waits for T005.

## Parallel Example: User Story 2

```text
T009 Create src/i18next.d.ts
T010 as const in src/data/portfolio.ts
T011 satisfies checks in src/i18n.ts
→ then T012 typecheck and injected-error checks
```

## Implementation Strategy

### MVP First (User Story 1 only)

1. Phase 1 Setup, then Phase 3 (T003 to T008).
2. Open a pull request with just that change. It closes the only live risk: an unaudited build reaching visitors.

### Incremental Delivery

1. US1: release gating (MVP).
2. US2 and US3: translation checks and structured data, which share `portfolio.ts`.
3. US4: tooling, after US1 because of `ci.yml`.
4. US5: optional sitemap. Skip it if you'd rather keep the hand-written file.

One pull request for everything is fine at this size (about 10 files). Splitting off US1 first is
the safer option if you want the gate live sooner.
