# Research: Fix Small Site Bugs

No unknowns remained after reading the spec, constitution and code, so these are the design
decisions behind the plan.

## R1. How a language choice survives every way of opening a link

- **Decision**: Language links carry the choice in a query parameter: `/?lang=en` and
  `/fr/?lang=fr`. The inline first-load script reads it, saves it when it can, and treats it as
  the highest-priority preference.
- **Rationale**: "Open in new tab" from the context menu fires no event on the page, so anything
  based on `onClick` or `auxclick` cannot cover it (SC-001). The link is the only thing every
  opening method shares. It also works with storage blocked (FR-003), because the choice arrives
  in the address.
- **Alternatives considered**:
  - Add an `auxclick` handler: misses the context menu and storage-blocked visitors.
  - Use `document.referrer`: the automatic redirect from `/` to `/fr/` also sets a same-site
    referrer, so it would be mistaken for a choice, and referrers can be stripped.
  - Serve English at a new `/en/` path: adds a second indexable address for English (FR-005).

## R2. Keeping one canonical address per language

- **Decision**: Keep the canonical, `hreflang` and sitemap addresses unchanged. Remove `lang` from
  the address with `history.replaceState` once the choice is saved. If saving fails, leave it in
  place so that reloading the page keeps the choice.
- **Rationale**: Canonical tags already consolidate `/?lang=en` with `/` for crawlers, and removing
  the parameter keeps the address clean for people who copy it (FR-005).
- **Alternatives considered**: Block `?lang=` in `robots.txt`. A blocked page can't be crawled, so
  its canonical tag would never be read.

## R3. Preference order and failure isolation in the inline script

- **Decision**: Use the order of explicit link choice, then saved choice, then browser language.
  Storage reads and writes go through two small helpers that catch their own errors, so no storage
  failure can skip the redirect or theme logic. The redirect passes on `location.search` and
  `location.hash` unchanged.
- **Rationale**: Today one `try` wraps everything, so the first failed storage read skips the
  theme check (FR-010, FR-011). Both search and hash are empty strings when absent, so no stray
  characters are added.
- **Alternatives considered**: Move the logic into the React bundle. It would run after first
  paint and cause a flash of the wrong theme and language, so it stays inline.

## R4. Footer year

- **Decision**: Render `© Kyle Heron` with no year and remove `suppressHydrationWarning`.
- **Rationale**: This is the decision recorded in the spec. It can't go stale and needs no
  JavaScript (FR-006, Principle II).
- **Alternatives considered**: Set the year after mount. JavaScript-free visitors would still see
  the build year.

## R5. Typeface

- **Decision**: Remove `Inter` from the font stack and leave the existing system font stack.
- **Rationale**: Option B from the spec clarification. Removing it also means visitors who happen
  to have Inter installed get the same treatment as everyone else (FR-009).
- **Alternatives considered**: Self-hosting Inter was rejected during clarification.

## R6. Heading letter spacing

- **Decision**: Roughly halve negative tracking on headings. These are starting values, to be
  confirmed in the quickstart's visual checks.

| Selector | Current | Planned |
|---|---|---|
| `.hero h1` | `-.065em` | `-.03em` |
| `.section-heading h2` | `-.055em` | `-.025em` |
| `.contact-panel h2` | `-.05em` | `-.025em` |
| `.brand` | `-.04em` | `-.02em` |
| `.project-name` | `-.035em` | `-.015em` |
| `.employer-heading h3`, `.education h3` | `-.03em` | `-.015em` |

- **Rationale**: System fonts vary in width, so moderate tracking stays legible across all of them
  (FR-008). `.eyebrow` has positive tracking and doesn't change.
- **Alternatives considered**: Remove all tracking. Large headings look loose at display sizes.

## R7. Testing the first-load script

- **Decision**: Add a small `node:test` file that extracts the inline script from `index.html` and
  runs it in a `vm` context with stubbed browser globals. Run it with `npm test` and in the CI lint
  job.
- **Rationale**: Lint, typecheck, build and Lighthouse can't catch a wrong redirect, so the
  constitution's Development Workflow says this logic should have an automated test. Node's built-in
  runner adds no dependencies (Principle V).
- **Alternatives considered**: A browser test framework is heavy for one script, and manual checks
  alone would let this logic regress unnoticed. The quickstart still covers real browser behaviour.
