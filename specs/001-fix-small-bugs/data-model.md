# Data Model: Fix Small Site Bugs

There is no server or database. The only data is per-browser preference state.

## Language preference

| Source | Location | Valid values | Priority |
|---|---|---|---|
| Explicit choice | `lang` query parameter | `en`, `fr` | 1 (highest) |
| Saved choice | `localStorage["language"]` | `en`, `fr` | 2 |
| Browser language | First two letters of `navigator.language` | Any | 3 |

Rules:

- An invalid `lang` value is ignored and left in the address.
- A valid `lang` value is saved. It is removed from the address only if saving succeeded.
- Only the resolved value `fr` at the path `/` causes a redirect. Other values cause no navigation.
- There is no redirect from `/fr/` to `/`. A visitor already on `/fr/` stays there.

State transitions for the saved choice:

```text
(none) --link with lang=X, storage available--> X
X      --link with lang=Y, storage available--> Y
any    --storage unavailable-->                 unchanged (choice lasts while lang is in the address)
```

## Theme preference

| Source | Location | Valid values | Priority |
|---|---|---|---|
| Saved choice | `localStorage["theme"]` | `dark`, `light` | 1 |
| System setting | `prefers-color-scheme` | `dark`, `light` | 2 |

Rules:

- If storage is unavailable, the saved choice is treated as absent and the system setting applies.
- The `dark` class on the root element is set before first paint.
- The theme toggle's existing behaviour is unchanged: it applies for the page view even if saving
  fails.
