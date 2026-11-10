# Research: Tighten CI, Deployment and Dev Tooling

Every decision below was checked against the repository, its GitHub settings or the upstream
action source on 2026-11-10. Where a decision relies on how a tool behaves, it was tested on a
scratch copy of the repository and not assumed.

## R1. How deploys are gated on CI (FR-001 to FR-003, FR-005)

**Decision**: Delete `.github/workflows/deploy.yml` and add a `deploy` job to `ci.yml`. The job
`needs: [lint, lighthouse]`, runs only on pushes or manual runs on `master`, downloads the `dist`
artifact that the `build` job uploaded and Lighthouse audited, and publishes it with
`upload-pages-artifact` and `deploy-pages`. Add `workflow_dispatch` to CI's triggers so a manual
deploy goes through every gate.

**Rationale**: A job dependency inside one workflow is the simplest way to get "publish only what
passed" (FR-001 and FR-002). The audited `dist` artifact is reused, so there is one build per
commit (SC-002). It also fixes a second gap found during research: today's deploy skips
`npm test`.

**Alternatives considered**:
- *`workflow_run` trigger on CI completion*: keeps two files, but it always runs the workflow file
  from the default branch. Downloading artifacts from another run needs a run id and
  `actions: read`. More moving parts for the same result.
- *Branch protection only*: it protects merges but not direct pushes by an admin, and the deploy
  would still publish a rebuild rather than the audited build. Recommended as a follow-up (see the
  spec's Assumptions), but it isn't a substitute.
- *Keep `actions/configure-pages`*: it only matters for static site generators that need the
  Pages base URL. Vite here builds for the site root, so the step is dropped (Principle V).

## R2. Deploy ordering and concurrency (FR-005, edge case "two pushes")

**Decision**: Set concurrency at the workflow level:
`group: ci-${{ github.ref }}` with `cancel-in-progress: ${{ github.ref != 'refs/heads/master' }}`.

**Rationale**: Within one workflow, a job-level `pages` group isn't enough. If run A is still in
Lighthouse when run B deploys, A's deploy could start afterwards and overwrite B with an older
build. Queuing whole runs on `master` means each run finishes before the next starts, and GitHub
keeps only the newest pending run, so the newest passing commit is always published last. Runs on
pull requests are separate groups (`refs/pull/N/merge`), and a newer push to the same pull request
cancels the older run, which also saves CI minutes.

**Alternatives considered**: a job-level `pages` group alone (allows out-of-order deploys, as
above); comparing `github.sha` with the head of `master` before deploying (works, but adds an API
call and a script for what concurrency already handles).

## R3. Lighthouse report upload must not decide deploys (edge case)

**Finding**: In `treosh/lighthouse-ci-action@v12`, the assert step's exit code is ignored. Failures
are raised by `setAnnotations` *after* the upload step, and a failed upload to temporary public
storage throws first. So an outage of that third-party service fails the job even when every
assertion passes, and that would block deploys.

**Decision**: `temporaryPublicStorage: ${{ github.event_name == 'pull_request' }}`. Pull requests
keep their public report links. Runs on `master` rely on the uploaded artifact (`uploadArtifacts:
true`, unchanged), which uses GitHub's own storage.

**Alternatives considered**: removing temporary storage everywhere (loses the convenient links on
pull requests); `continue-on-error` (would also ignore failed assertions, which defeats the gate).

## R4. Workflow permissions (FR-004)

**Finding**: The repository's default workflow token is already `read`. This change only makes
the setting explicit and keeps it in version control.

**Decision**: `permissions: contents: read` at the top of `ci.yml`. The `deploy` job overrides it
with `pages: write` and `id-token: write`. It doesn't check out code, so it doesn't need
`contents`. Same-run `upload-artifact` and `download-artifact` need no token scopes.

## R5. Where the Node version is declared (FR-011)

**Decision**: Add `"devEngines": { "runtime": { "name": "node", "version": "^24", "onFail": "error" } }`
to `package.json`, and use `node-version-file: package.json` in every `setup-node` step.

**Rationale**: It's one place, and both tools read it:
- `actions/setup-node@v7` reads `devEngines.runtime` from `package.json` (documented in its
  advanced usage guide).
- npm 11 enforces it. Tested: with an unsupported version, `npm install` and `npm run` stop with
  `EBADDEVENGINES … Invalid semver version "^99" does not match "v24.18.0"`, which states the
  required version (Story 4, scenario 1).

**Version choice**: `^24`. It matches the owner's machine (v24.18.0), and Node 24 is supported as
LTS until April 2028. It also meets every minimum the build has: TypeScript type stripping without
a flag (22.18+), `node --test` with globs (21+), `import.meta.dirname` (20.11+) and Vite 8. Moving
to the next LTS becomes a deliberate one-line change instead of a silent one.

**Alternatives considered**: `.nvmrc` (setup-node reads it, but npm doesn't, so a wrong local
version only fails later with a cryptic syntax error); `engines` (npm only warns; and with a range,
setup-node picks the newest matching release, even a non-LTS one).

## R6. Type-safe translations (FR-006 to FR-008)

**Decision**:
1. Add `src/i18next.d.ts`, which declares i18next's `CustomTypeOptions` with
   `resources: { translation: typeof en }`. Every `t()` key is then checked against `en.json`.
2. Mark `experience` and `featured` in `src/data/portfolio.ts` `as const` (in place of the per-field
   `as const` on dates), so `descriptionKey` and `role.type` are literal types and the template
   keys `projects.${…}` and `experience.types.${…}` are checked as well.
3. In `src/i18n.ts`, add `fr satisfies typeof en;` and `en satisfies typeof fr;` for parity in both
   directions.

**Tested on a scratch copy**:
- With only step 1, `tsc` rejects exactly the three data-driven lookups in `App.tsx`. This confirms
  they are the unchecked gap. After step 2, the project typechecks cleanly.
- A typo `descriptionKey: "betaredr"` fails with an error listing `"projects.betaredr"` among the
  rejected keys.
- Adding `hero.newThing` to English only fails with
  `Types of property "hero" are incompatible. Property "newThing" is missing…`. The line number
  shows which language lacks it. The same check catches a key deleted from French.
- `NotFound.tsx` (which takes `TFunction` props) and `entry-server.tsx` typecheck unchanged. ESLint
  accepts the `satisfies` statements.

**Rationale**: It uses only TypeScript and i18next's own extension point: no new dependency, and
no build step that generates types. Values may be identical across languages, because only the
key structure is compared (edge case "proper nouns").

**Alternatives considered**: a Node test that compares key sets (works, but separate from the
editor feedback and catches nothing at the `t()` call sites); i18next's selector API
(`enableSelector`) (a larger rewrite of every call site for no extra safety here).

## R7. Structured data from content data (FR-009, FR-010)

**Decision**: In `entry-server.tsx`, build `person()` from:
- `worksFor`: the company of the experience entry whose `period[1]` is `null`, left out if there
  is none (FR-010).
- `knowsAbout`: `skills` from `portfolio.ts` (the full list, as the spec's Assumptions accept).
- `sameAs`: a new `profiles` export in `portfolio.ts` (GitHub and LinkedIn URLs). `App.tsx` uses
  the same export for its footer and projects links, so the URLs exist once.
- `alumniOf`: `t("education.university")`, which already holds the university name in both
  locales.

`name`, `url`, `image` and `address` stay as they are. They aren't duplicated anywhere that could
drift, apart from the address text, which is localised and formatted differently.

## R8. ESLint packages (FR-012)

**Finding**: Dependabot already opened #76 (`@eslint/js` 9.39.4 → 10.0.1), and all three CI jobs
pass on it. So the three added recommended rules (`no-unassigned-vars`, `no-useless-assignment`,
`preserve-caught-error`) find nothing in the current code.

**Decision**: Merge #76 before implementation, or apply the same bump in this branch and close #76.

## R9. Dependency advisories (FR-013, FR-014)

**Decision**:
- Run `npm audit fix`. A dry run shows it changes only the lockfile: zod 4.4.3 → 4.6.7 (clears the
  high advisory) and typescript-eslint 8.72.1 → 8.72.2.
- Accept the remaining moderate advisory (minimatch GHSA-g3hv-75wg-m249, fixed in 11.0.1, while
  ESLint 10 requires `^10.2.6`). Record it in the README with the reason: the linter only matches
  globs from this repository's own config. No `overrides` are used.
- Add `npm audit --omit=dev --audit-level=high` to the CI `lint` job. That makes CI fail on a high
  or critical production advisory, which enforces the constitution's dependency rule.

**Known trade-off**: the audit step queries the npm registry. If the registry's audit endpoint is
down, CI fails until a rerun. That is the same dependency `npm ci` already has, so it is accepted.

## R10. Sitemap generation (FR-015, optional)

**Decision**: Export `renderSitemap()` from `entry-server.tsx`, built from `languages` and
`languagePaths` (the same source as the canonical and `hreflang` tags). `scripts/prerender.ts`
writes it to `dist/sitemap.xml`. Delete `public/sitemap.xml` so Vite's public copy can't conflict.
`robots.txt` is unchanged. The output must match today's file (see
[contracts/generated-files.md](contracts/generated-files.md)).
