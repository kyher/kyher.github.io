# Contract: Language Links and First-Load Behaviour

The site's only external interface is its URLs. This defines how they behave on first load. See
[data-model.md](../data-model.md) for the preference rules.

## Public addresses (unchanged)

| Language | Canonical address |
|---|---|
| English | `https://kyher.github.io/` |
| French | `https://kyher.github.io/fr/` |

Canonical tags, `hreflang` tags and `sitemap.xml` keep using only these addresses.

## Language links

| Link | Target |
|---|---|
| EN | `/?lang=en` |
| FR | `/fr/?lang=fr` |

These are plain anchors, so they work with JavaScript disabled, where the parameter has no effect.

## Behaviour at `/`

| `lang` | Saved | Browser | Result |
|---|---|---|---|
| `en` | any | any | Stay on English |
| `fr` | any | any | Redirect to `/fr/` |
| none or invalid | `en` | any | Stay on English |
| none or invalid | `fr` | any | Redirect to `/fr/` |
| none or invalid | none or blocked | `fr` | Redirect to `/fr/` |
| none or invalid | none or blocked | other | Stay on English |

## Behaviour at `/fr/`

The page always stays on French. A valid `lang` is saved under the same rules as at `/`.

## Address handling

| Situation | Resulting address |
|---|---|
| Redirect from `/?a=1#x` | `/fr/?a=1#x` |
| Redirect from `/` | `/fr/` with no trailing `?` or `#` |
| `/?lang=en&a=1#x`, save succeeded | `/?a=1#x` |
| `/?lang=en`, save succeeded | `/` |
| `/?lang=en`, save failed | Unchanged |
| `/?lang=de` | Unchanged |

## Failure isolation

A failure to read or write storage must not stop any other first-load step. The theme step always
runs, and storage failure counts as "no saved value".
