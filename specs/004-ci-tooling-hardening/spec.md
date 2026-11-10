# Feature Specification: Tighten CI, Deployment and Dev Tooling

**Feature Branch**: `004-ci-tooling-hardening`

**Created**: 2026-11-10

**Status**: Draft

**Input**: User description: "Take a look at issue 69. I want to know why we are doing those changes though - so ensure they are actually worth doing."

## Change Assessment

Issue #69 lists seven changes. Each was checked against the repository and its GitHub settings on
2026-11-10 before being turned into requirements. Changes are kept only where they fix a problem
that exists today or enforce a rule in the constitution that nothing currently enforces.

| # | Issue item | What was found | Verdict |
|---|------------|----------------|---------|
| 1 | Stop deploys bypassing Lighthouse | `master` has no branch protection and no rulesets. The deploy runs on every push to `master` in parallel with CI, and it runs lint and build only. It skips the tests and the Lighthouse audit, and it publishes its own rebuild rather than the build CI audited. A commit that fails accessibility, or a direct push to `master`, goes live. | **Do it. Highest value.** It is the only item where the live site can break today, and it is how the constitution's 100-score rules and "`master` MUST remain deployable" actually get enforced. |
| 2 | Least-privilege permissions in CI | The repository's default workflow token is already read-only, and pull requests from forks always get a read-only token. Adding the setting changes nothing today. | **Do it, but only as part of item 1.** Its value is that the protection lives in the repository instead of in a setting that can be changed silently. Once the deploy moves after CI (item 1), permissions have to be set per job anyway, because the deploy step needs write access to Pages. |
| 3 | Pin the Node version | CI and deploy use "latest LTS", which moves to a new major without a commit. The build runs a TypeScript script directly in Node, the tests use Node's built-in glob runner, and the build tool has its own minimum. Older Node versions fail on the prerender step with a syntax error that doesn't say Node is too old. Nothing records the minimum version. | **Do it. Low effort, modest value.** It makes local and CI builds reproducible and gives a clear message on an unsupported version. |
| 4 | Type-safe translations | English and French have identical keys today, and every literal key in the code exists. But project descriptions and role types are looked up with keys built from the data module. A typo there shows the raw key (for example `projects.betaredr`) on the live site, and no current check fails. A key added in English only falls back to English on the French page without any warning, which breaks Principle IV (Bilingual Parity) silently. | **Do it.** It turns a constitution principle that reviewers currently have to check by eye into a check that runs automatically. |
| 5 | Generate sitemap and JSON-LD from data | **Partly out of date.** The JSON-LD is no longer in `index.html`. It is already built per language at build time. It still repeats facts that are kept elsewhere by hand: the current employer, the skills, and the GitHub and LinkedIn links. When the owner changes jobs, the structured data would still name the old employer, and that would publish an inaccurate claim (Principle I). The sitemap lists two URLs that only change when a language is added or removed. | **JSON-LD: do it.** The drift risk is real and affects credibility. **Sitemap: optional (P3).** The risk is low, but generating it from the list of languages the build already uses costs little. |
| 6 | Align the ESLint packages | The linter is on major 10 but its recommended rule set is still on 9, which declares support only for linter 10 in its own newer release. Comparing the two rule sets shows that the v10 set adds three rules that are not running now: `no-unassigned-vars`, `no-useless-assignment` and `preserve-caught-error`. | **Do it. Trivial, and it restores checks the project believes it already has.** |
| 7 | Clear dev dependency vulnerabilities | 10 findings (9 moderate, 1 high), all in lint tooling. Production dependencies have 0. The high one (memory exhaustion in a validator used by the React hooks lint plugin) has a non-breaking fix. The moderate ones all come from a single glob-matching issue whose fix needs a major version that the current linter doesn't accept yet. None can be exploited here, because the tools only read the repository's own files. | **Partly worth it.** Apply the non-breaking fix. Accept and record the rest until upstream catches up, rather than forcing an override. The rule that matters is the constitution's: production dependencies MUST have no high or critical vulnerabilities. Nothing enforces that today, so the useful change is a CI check for it. A clean dev audit is not the goal. |

## User Scenarios & Testing *(mandatory)*

The users here are the site owner, who maintains and releases the site, and indirectly the site's
visitors, who are protected from broken releases.

### User Story 1 - Only audited builds go live (Priority: P1)

As the site owner, when I merge or push to the main branch, the site is published only if that
commit has passed every gate (lint, tests, typecheck, build, prerender and the Lighthouse
thresholds). The files published are exactly the files that were audited.

**Why this priority**: This is the only item where a visitor can see a regression today. The
constitution makes accessibility scores of 100 non-negotiable, and right now nothing stops a
failing release.

**Independent Test**: Push a commit to the main branch that lowers an accessibility score below
the threshold, for example by removing an image's alternative text. Confirm the release does not
happen and the live site is unchanged. Then push a passing commit and confirm it is published.

**Acceptance Scenarios**:

1. **Given** a commit on the main branch that fails the Lighthouse thresholds, **When** CI finishes, **Then** no deployment starts and the live site keeps its previous version.
2. **Given** a commit on the main branch that fails tests or lint, **When** CI finishes, **Then** no deployment starts.
3. **Given** a commit that passes every gate, **When** CI finishes, **Then** the site is deployed from the same build output that was audited, without a second build.
4. **Given** the owner starts a deployment manually, **When** it runs, **Then** it goes through the same gates before publishing.
5. **Given** any automated job, **When** it runs, **Then** it has read-only repository access unless it is the step that publishes the site.

---

### User Story 2 - Translation mistakes fail before release (Priority: P2)

As the site owner, if I add a project, role type or text in only one language, or mistype a key
that links data to text, I find out from the normal checks before the change is merged. I don't
find out from a raw key or an English sentence on the French page.

**Why this priority**: It enforces Bilingual Parity (Principle IV) automatically. That principle
is currently checked only by eye, and the data-driven keys are exactly where a typo would slip
through.

**Independent Test**: Add a project with a description key that doesn't exist, and separately
add a string to English only. Confirm both changes fail the checks with a message that names the
missing key.

**Acceptance Scenarios**:

1. **Given** a project whose description key has no translation, **When** checks run, **Then** they fail and name the key.
2. **Given** a key present in English but missing from French (or the other way round), **When** checks run, **Then** they fail and name the key and the language.
3. **Given** a role type in the data with no matching translation, **When** checks run, **Then** they fail.
4. **Given** valid, complete translations, **When** the site renders, **Then** the output is identical to today's.

---

### User Story 3 - Structured data stays accurate when content changes (Priority: P2)

As the site owner, when I update my employer, skills or profile links in the site's content data,
the structured data that search engines read updates with it, so it never contradicts the page.

**Why this priority**: An out-of-date employer in search results is an inaccurate public claim
(Principle I), and it is the most likely drift because job changes are rare and easy to forget
in a second place.

**Independent Test**: Change the current employer in the content data, build, and confirm the
structured data on both language pages names the new employer, with no other file edited.

**Acceptance Scenarios**:

1. **Given** the experience data has a current role, **When** the site is built, **Then** the structured data names that role's employer.
2. **Given** a change to the published skills or profile links, **When** the site is built, **Then** the structured data reflects them.
3. **Given** no role is current, **When** the site is built, **Then** the structured data leaves out the employer instead of naming a past one.

---

### User Story 4 - Reproducible, trustworthy tooling (Priority: P3)

As the site owner, the Node version, lint rules and dependency audit behave the same on my machine
and in CI. The lint rules I think are running are the ones actually running, and a real production
vulnerability would block a merge.

**Why this priority**: These are low-effort fixes that remove silent gaps, but none of them affects
visitors directly.

**Independent Test**: Run the build on an unsupported Node version and confirm a clear version
message. Run lint and confirm the three missing recommended rules are active. Confirm CI fails
when a production dependency has a high-severity advisory.

**Acceptance Scenarios**:

1. **Given** an unsupported Node version, **When** the owner installs or builds, **Then** they get a message stating the required version.
2. **Given** CI and a local machine, **When** both build, **Then** they use the same declared Node major version.
3. **Given** code that breaks one of the linter's current recommended rules, **When** lint runs, **Then** it reports the problem.
4. **Given** a production dependency with a known high or critical advisory, **When** CI runs, **Then** it fails.
5. **Given** dev-only advisories that cannot be fixed without a breaking upgrade, **When** CI runs, **Then** it does not fail on them, and the accepted findings are recorded with the reason.

---

### User Story 5 - Sitemap follows the published languages (Priority: P3, optional)

As the site owner, the sitemap lists exactly the language pages the build produces, with matching
alternate-language links, without my editing it by hand.

**Why this priority**: The risk of drift is low because languages rarely change. It is included
only because it is cheap and keeps the head tags and the sitemap on one source.

**Independent Test**: Build and confirm the sitemap's URLs and alternates match the canonical and
`hreflang` tags of the prerendered pages exactly.

**Acceptance Scenarios**:

1. **Given** the current two languages, **When** the site is built, **Then** the generated sitemap is equivalent to today's hand-written one.
2. **Given** the 404 page, **When** the sitemap is generated, **Then** it is not listed.

### Edge Cases

- A deployment is triggered manually from a commit that has not been through CI: it must run the gates or refuse to publish. It must never skip them.
- Two pushes land in quick succession: only a build that passed all gates may be published, and an older build must not overwrite a newer one.
- The Lighthouse service used for temporary report storage is unavailable: the audit result itself must still decide whether to deploy. Report upload is not a gate.
- A translation value is intentionally the same in both languages (a proper noun): parity checks the keys exist, not that the values differ.
- A dependency audit fix would raise a package by a major version: it is not applied automatically under this feature.

## Requirements *(mandatory)*

### Functional Requirements

**Release gating (Story 1, items 1 and 2)**

- **FR-001**: The site MUST be published only after lint, tests, typecheck, build, prerender and the Lighthouse thresholds have all passed for the same commit.
- **FR-002**: The published files MUST be the exact build output that passed the Lighthouse audit, not a separate rebuild.
- **FR-003**: A manually started deployment MUST pass the same gates before publishing.
- **FR-004**: Every automated job MUST declare its repository access explicitly, with read-only access by default. Only the publishing step may have permission to deploy.
- **FR-005**: The existing guarantee that only one deployment runs at a time MUST be kept.

**Translations (Story 2, item 4)**

- **FR-006**: Using a translation key that doesn't exist in the English text MUST fail the checks that run on every pull request. This includes keys built from the content data (project descriptions, role types).
- **FR-007**: A key present in one language and missing in the other MUST fail the checks, and the failure MUST name the key.
- **FR-008**: The rendered output for both languages MUST be unchanged by this work.

**Structured data (Story 3, item 5)**

- **FR-009**: The structured data's current employer, skills and profile links MUST come from the same content data the page renders, not from a second copy.
- **FR-010**: If no role is current, the structured data MUST NOT name an employer.

**Tooling (Story 4, items 3, 6 and 7)**

- **FR-011**: The repository MUST declare the supported Node version in one place, and CI MUST use that declaration.
- **FR-012**: The linter's recommended rule set MUST be on the same major version as the linter itself.
- **FR-013**: Dev dependency advisories with a non-breaking fix MUST be fixed. Those without one MUST be recorded with the reason they are accepted.
- **FR-014**: CI MUST fail when a production dependency has a known high or critical vulnerability.

**Sitemap (Story 5, item 5, optional)**

- **FR-015**: *(Optional)* The sitemap MUST be produced from the same list of languages and URLs used for the pages' canonical and `hreflang` tags, and MUST exclude the 404 page.

### Key Entities

- **Content data**: the single source for skills, experience (including which role is current), projects and profile links. The structured data reads from it.
- **Translations**: one set of keys per language. English defines the expected keys, and French must match them.
- **Audited build**: the build output from one commit that passed every gate. It is the only thing that may be published.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 0 deployments of a commit that failed any gate, shown by a deliberate failing test commit that does not reach the live site.
- **SC-002**: The site is built once per main-branch commit instead of twice.
- **SC-003**: 100% of the translation errors listed in Story 2 are caught before merge. Each injected error fails the checks.
- **SC-004**: Changing the employer requires editing 1 place instead of 2, and the structured data on both language pages updates after the next build.
- **SC-005**: 0 high or critical production advisories can be merged unnoticed, and the high-severity dev advisory is gone.
- **SC-006**: The 3 currently missing recommended lint rules are active.
- **SC-007**: Lighthouse scores, rendered HTML and the visitor-facing behaviour of both languages are unchanged.

## Assumptions

- Enabling branch protection on `master` (requiring pull requests and passing checks) is a repository setting, not a code change, so it is **out of scope**. It is still **strongly recommended** as a follow-up, because the constitution says changes MUST reach `master` through a pull request and nothing currently enforces that. FR-001 protects the live site even without it.
- The remaining moderate dev advisories (from the glob-matching library) are accepted until the linter supports the fixed version. Forcing it with an override risks breaking lint for no practical security gain.
- "Supported Node version" means the current LTS major at the time of implementation, which already meets every minimum the build needs.
- The repository stays public and hosted on GitHub Pages. No other deployment target is considered.
- The skills listed in the structured data may become the full published skills list instead of today's hand-picked subset. Search engines treat both the same, and one source matters more than the curation.
