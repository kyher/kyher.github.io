# Data Model: Simplify the Frontend

The only data affected is the static project list in `src/data/portfolio.ts`.

## Project

| Field | Required | Change |
|---|---|---|
| `name` | Yes | None |
| `descriptionKey` | Yes | None |
| `href` | No | None |
| `stack` | Yes | None |
| `image` | **Yes** | Previously optional. A project without one fails the build |
| `highlight` | No | None |
| `gradient` | Removed | Only used by the placeholder artwork |

Validation is enforced at build time by the `ProjectTile` prop types.
