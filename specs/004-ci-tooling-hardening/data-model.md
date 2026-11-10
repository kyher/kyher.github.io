# Data Model: Tighten CI, Deployment and Dev Tooling

There's no stored data. These are the build-time sources that the new checks and generated
output depend on.

## Content data (`src/data/portfolio.ts`)

| Export | Shape | Change |
|---|---|---|
| `skills` | `string[]` | Now also the source for JSON-LD `knowsAbout` |
| `experience` | Read-only array of `{ company, period: [start, end \| null], roles: { title, type?, dates }[] }` | Whole array `as const`, so `role.type` is a literal |
| `featured` | Read-only array of `{ name, descriptionKey, href, stack, image, highlight? }` | Whole array `as const`, so `descriptionKey` is a literal |
| `profiles` | `{ github: string; linkedin: string }` | **New.** Used by page links and JSON-LD `sameAs` |

**Validation rules**
- Every `featured[].descriptionKey` MUST exist under `projects` in the translations (checked by `tsc`).
- Every `experience[].roles[].type` MUST exist under `experience.types` (checked by `tsc`).
- At most one `experience` entry SHOULD have `period[1] === null`. The first one found is the
  current employer, and if there is none, `worksFor` is left out.

## Translations (`src/locales/en.json`, `src/locales/fr.json`)

- English defines the key structure that `t()` is checked against (`src/i18next.d.ts`).
- French MUST have exactly the same nested keys. This is enforced in both directions in
  `src/i18n.ts`.
- Values are free text. Identical values across languages are allowed (proper nouns).

## Audited build (CI artifact `dist`)

| State | Meaning |
|---|---|
| Built | `build` job uploaded `dist` |
| Audited | `lighthouse` passed on that `dist` |
| Released | `deploy` published that `dist` (only on `master`, after lint also passed) |

Only an artifact that reached *Audited* in the same run, with lint passing, can become *Released*.
