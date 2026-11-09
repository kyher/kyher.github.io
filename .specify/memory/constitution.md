# Kyle Heron Portfolio Constitution

## Core Principles

### I. Content Serves the Reader

This site is the public portfolio of a senior software engineer. Its readers are recruiters,
hiring managers and fellow engineers.

- Every section MUST help a reader assess the owner's experience and work, or get in touch.
- Claims about roles, dates, skills and projects MUST be accurate and verifiable. Invented or
  estimated figures MUST NOT be published.
- A contact route MUST be reachable from the first screen of every page.
- Links to projects and profiles MUST resolve to a public destination.

Rationale: a portfolio is judged on credibility, and one inaccurate claim undermines the rest.

### II. Static and Prerendered

- Every page MUST be fully rendered to static HTML at build time.
- Core content and navigation between sections and languages MUST work without JavaScript.
- The site MUST NOT depend on a server, database or third-party runtime service.
- The build MUST fail if a page cannot be prerendered.

Rationale: static pages are fast, cheap to host, indexable and have little that can break.

### III. Accessible by Default (NON-NEGOTIABLE)

- Every page MUST score 100 for Lighthouse accessibility.
- Every page MUST meet WCAG 2.2 AA, including criteria Lighthouse cannot verify such as non-text
  contrast, including focus indicators, and full keyboard operation.
- Pages MUST use correct landmarks and heading order, and images MUST have appropriate
  alternative text.
- Both light and dark themes MUST meet these requirements, and motion MUST respect
  `prefers-reduced-motion`.

Rationale: an engineer's own site is direct evidence of the care they bring to their work.

### IV. Bilingual Parity

- English and French MUST both be complete. A user-facing string MUST NOT be added in one
  language only, and this includes metadata, structured data and alternative text.
- Proper nouns, such as people, employers, products, technologies and official qualification
  names, MAY remain untranslated.
- Each language MUST be served from its own URL with its own title, description, canonical and
  `hreflang` tags.
- User-facing text MUST live in the locale files, and structured content MUST live in the data
  module, not in components.

Rationale: a half-translated page reads as unfinished, and separate URLs let each language be
indexed.

### V. Lightweight and Simple

- Every page MUST score 100 for Lighthouse best practices and SEO, and SHOULD score at least 90
  for performance.
- A new runtime dependency MUST be justified by a need that existing code cannot reasonably meet.
- Images MUST be resized, served in a modern format where supported, and declared with explicit
  dimensions.
- Unused code, styles and configuration MUST be removed in the change that makes them unused.

Rationale: a single-page portfolio has little real complexity, so added weight has to earn its
place.

## Technical Constraints

- Hosting: the site MUST deploy as static files to GitHub Pages at `https://kyher.github.io`.
- Language: application and build code MUST be strictly typed TypeScript.
- Stack: the current framework and tooling are documented in `README.md`. Replacing a framework
  or styling system MUST be specified and planned first, and MUST preserve Principles I to V.
- Public data: the repository and site are public, so only personal details the owner has chosen
  to publish MAY be committed. Secrets MUST NOT be committed.
- Dependencies: production dependencies MUST have no known high or critical vulnerabilities.

## Development Workflow

- Changes MUST reach `master` through a pull request, and `master` MUST remain deployable.
- A pull request MUST pass lint, typecheck, build and prerender, and the Lighthouse thresholds
  in `lighthouserc.json`, before merging.
- Changes that affect layout or interaction MUST be checked in both themes, both languages and
  at mobile and desktop widths.
- Unit tests are not required by default. Logic whose failure these gates would not catch SHOULD
  have an automated test.
- Features developed with Spec Kit MUST pass the constitution check in their implementation plan.

## Governance

This constitution takes precedence over other project practices. `README.md` is the runtime
guidance for development and content editing, and MUST be updated when it conflicts with this
document.

- Amendments: the repository owner approves amendments through a pull request that states the
  change and its rationale, and brings affected code into line or tracks the gap in an issue.
- Versioning: this document follows semantic versioning. MAJOR covers removing or redefining a
  principle in an incompatible way, MINOR covers a new principle or section or materially
  expanded guidance, and PATCH covers clarifications and wording.
- Compliance: every pull request and plan MUST be reviewed against these principles. An exception
  MUST be justified in the pull request or plan, and existing gaps MUST be tracked in issues.

**Version**: 1.0.0 | **Ratified**: 2026-11-09 | **Last Amended**: 2026-11-09
