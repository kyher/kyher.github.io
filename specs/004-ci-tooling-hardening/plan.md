# Implementation Plan: Tighten CI, Deployment and Dev Tooling

**Branch**: `accessibility` (no feature branch created yet) | **Date**: 2026-11-10 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/004-ci-tooling-hardening/spec.md`

## Summary

Merge deployment into CI, so the site is published only from the `dist` artifact that passed lint,
tests, a production advisory check and Lighthouse in the same run. Runs on `master` are queued so
deploys can't go out of order, and the Lighthouse report upload is kept off the deploy path.
Translations become type-checked against English, including the keys built from the content data,
and the two languages are checked for parity in both directions. Structured data is built from the
content data, so the employer, skills and profile links each exist in one place. The Node version
is declared once, in `package.json`, and both npm and CI enforce it. `@eslint/js` moves to 10
(Dependabot #76 already passes), the high dev advisory is fixed with a lockfile-only change, and
the sitemap is generated from the language list (optional). See [research.md](research.md).

## Technical Context

**Language/Version**: TypeScript 5.9 on Node 24 (now declared in `devEngines`), GitHub Actions YAML

**Primary Dependencies**: React 19, i18next 25, react-i18next 16, Vite 8. No additions. `@eslint/js` goes from 9 to 10 (dev)

**Storage**: N/A

**Testing**: `tsc` (now also checks translations), ESLint, `npm test`, Lighthouse CI, and the
quickstart's before/after diff of `dist`

**Target Platform**: GitHub Actions (`ubuntu-latest`) and GitHub Pages

**Project Type**: Static prerendered website

**Performance Goals**: One build per `master` commit (currently two). Lighthouse performance stays at 90 or above

**Constraints**: Rendered HTML must be unchanged apart from the JSON-LD. No `overrides` in `package.json`. No new runtime dependencies

**Scale/Scope**: One workflow rewritten, one deleted, and about ten small file changes

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Rule | Assessment | Before design | After design |
|---|---|---|---|
| I. Content Serves the Reader | Structured data can no longer name a past employer or list stale links | Pass | Pass |
| II. Static and Prerendered | The sitemap is generated during prerender, and the build still fails if prerender fails | Pass | Pass |
| III. Accessible by Default | Lighthouse accessibility 100 becomes a real release gate instead of advisory | Pass | Pass |
| IV. Bilingual Parity | Parity of keys is enforced by the typecheck instead of review | Pass | Pass |
| V. Lightweight and Simple | No new dependencies. Removes `deploy.yml`, the duplicate build, `configure-pages` and the hand-written sitemap | Pass | Pass |
| Technical Constraints | Still GitHub Pages and strict TypeScript. The production advisory rule is now enforced in CI | Pass | Pass |
| Development Workflow | "`master` MUST remain deployable" and the pull request gates are enforced for what gets published. Enforcing pull-request-only merges needs branch protection (a repository setting, recommended follow-up) | Pass | Pass |

No violations. This closes the gap in issue #69 that was noted when the constitution was adopted.

## Project Structure

### Documentation (this feature)

```text
specs/004-ci-tooling-hardening/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── release-pipeline.md
│   └── generated-files.md
├── checklists/requirements.md
└── tasks.md             # Created by /speckit-tasks
```

### Source Code (repository root)

```text
.github/workflows/
├── ci.yml                  # + workflow_dispatch, permissions, concurrency, audit step,
│                           #   node-version-file, PR-only public storage, deploy job
└── deploy.yml              # Deleted
package.json                # + devEngines.runtime node ^24, @eslint/js ^10.0.1
package-lock.json           # npm audit fix (zod 4.6.7, typescript-eslint 8.72.2), @eslint/js 10
src/
├── i18next.d.ts            # New: CustomTypeOptions resources typed from en.json
├── i18n.ts                 # fr/en `satisfies` parity checks
├── data/portfolio.ts       # `as const` arrays, new `profiles` export
├── App.tsx                 # Profile links from `profiles`
└── entry-server.tsx        # person() from content data, renderSitemap() (optional)
scripts/prerender.ts        # Writes dist/sitemap.xml (optional)
public/sitemap.xml          # Deleted (optional, replaced by the generated file)
README.md                   # Deployment, Lighthouse (now 3 pages), Node version, translation
                            # checks, accepted dev advisory
```

**Structure Decision**: Keep the existing single-project layout. Every change modifies or deletes
an existing file, apart from one type declaration file.

## Delivery Order

1. **Release gating** (P1): R1 to R5 and the R9 audit step. This is independent of everything else
   and closes the only live risk.
2. **Translations** (P2, R6) and **structured data** (P2, R7), done together because both touch
   `portfolio.ts`.
3. **Tooling cleanup** (P3): merge #76 (R8) and run `npm audit fix` (R9), plus the README.
4. **Sitemap** (P3, optional, R10).

## Complexity Tracking

No constitution violations to justify.
