# Contract: Generated Structured Data and Sitemap

Decisions: [research.md](../research.md) R7 and R10. Sources: [data-model.md](../data-model.md).

## JSON-LD `Person` (each language page)

| Field | Source | Rule |
|---|---|---|
| `name`, `url`, `image`, `address` | Fixed in `entry-server.tsx` | Unchanged |
| `jobTitle` | `t("hero.title")` | Unchanged |
| `worksFor.name` | Company of the experience entry with no end date | Left out entirely if no entry is current |
| `alumniOf.name` | `t("education.university")` | Per language |
| `knowsAbout` | `skills` | Same items and order as the skills section |
| `sameAs` | `profiles` | Same URLs as the links rendered on the page |

The output stays HTML-safe: `<` is escaped as `<`, as it is today.

## `dist/sitemap.xml` (optional, FR-015)

- One `<url>` per entry in `languages`, with `<loc>` = site URL + `languagePaths[language]`.
- Each `<url>` lists an `xhtml:link rel="alternate"` for every language plus `x-default` pointing
  to the English URL. These are the same URLs as the page's `hreflang` tags.
- `404.html` is never listed.
- With today's two languages, the output is equivalent to the current `public/sitemap.xml`: the
  same URLs and alternates, ignoring whitespace.
