# Contract: Release Pipeline

The single CI workflow (`.github/workflows/ci.yml`) is the only path to publishing the site.
Decisions and evidence: [research.md](../research.md) R1 to R5 and R9.

## Triggers

| Event | Jobs that run | Publishes? |
|---|---|---|
| `pull_request` (any branch) | lint, build, lighthouse | No |
| `push` to `master` | lint, build, lighthouse, deploy | Yes, if every gate passes |
| `workflow_dispatch` on `master` | lint, build, lighthouse, deploy | Yes, if every gate passes |
| `workflow_dispatch` on another branch | lint, build, lighthouse | No |

## Gates

The `deploy` job MUST depend on all of these and MUST NOT run if any of them fails or is cancelled:

| Gate | Job | Fails when |
|---|---|---|
| Node version | every job (setup) | The runtime doesn't match `devEngines.runtime` in `package.json` |
| Lint | lint | ESLint reports an error |
| Tests | lint | `npm test` fails |
| Production advisories | lint | `npm audit --omit=dev --audit-level=high` reports a high or critical advisory |
| Typecheck, translations, build, prerender | build | `npm run build` fails (includes the translation key and parity checks) |
| Lighthouse | lighthouse | Any `error`-level assertion in `lighthouserc.json` fails |

Report upload to temporary public storage happens on pull requests only, and is never a gate on
`master`.

## Published output

- The files published are the `dist` artifact uploaded by the `build` job of the **same run**.
  Lighthouse audits that same artifact.
- No job after `build` runs `npm ci` or `npm run build`.

## Permissions

| Scope | `contents` | `pages` | `id-token` |
|---|---|---|---|
| Workflow default (lint, build, lighthouse) | read | none | none |
| deploy job | none | write | write |

## Ordering

- Runs on `master` are queued and never cancelled in progress, so deployments happen in commit
  order and the newest passing commit is published last.
- Runs on any other ref are cancelled when a newer run for the same ref starts.
