# Quickstart: Validating Feature 004

Prerequisites: Node 24, `npm ci`, and a clean working tree. Before starting, save a baseline build
for comparison:

```
npm run build && cp -r dist /tmp/dist-before
```

## 1. Translations (Story 2, SC-003)

Make each change, run `npx tsc -b`, confirm it fails as described, then revert it.

| Change | Expected failure |
|---|---|
| Set a `featured` `descriptionKey` to `"betaredr"` | Names `"projects.betaredr"` |
| Set a role `type` to `"internship"` | Names `"experience.types.internship"` |
| Add `"hero.newThing"` to `en.json` only | `Property "newThing" is missing`, on the `fr satisfies` line |
| Delete `education.degree` from `fr.json` | `Property "degree" is missing` |
| Add a key to `fr.json` only | Fails on the `en satisfies` line |

## 2. Unchanged output (SC-007, FR-008)

```
npm run build
diff <(sed 's#<script type="application/ld+json">.*</script>##' /tmp/dist-before/index.html) \
     <(sed 's#<script type="application/ld+json">.*</script>##' dist/index.html)
```

Repeat for `fr/index.html` and `404.html`. The files must be identical apart from the JSON-LD
line.

## 3. Structured data (Story 3, SC-004)

- Inspect the JSON-LD in `dist/index.html` and `dist/fr/index.html` against
  [contracts/generated-files.md](contracts/generated-files.md).
- Temporarily give the current Komodo Digital entry an end date, then rebuild. `worksFor` must
  disappear, and nothing else changes. Revert.

## 4. Sitemap (Story 5, optional)

Compare `dist/sitemap.xml` with `/tmp/dist-before/sitemap.xml`. They must have the same URLs and
alternates. Confirm `404.html` isn't listed.

## 5. Tooling (Story 4, SC-005, SC-006)

- `npm ls @eslint/js eslint` shows both on major 10.
- `npm audit --omit=dev --audit-level=high` exits 0. `npm audit` shows no high findings, and only
  the accepted minimatch advisory recorded in the README.
- Running `npm run build` under another Node major, for example `npx -p node@22 npm run build`,
  stops with `EBADDEVENGINES`.

## 6. Pipeline (Story 1, SC-001, SC-002)

Check against [contracts/release-pipeline.md](contracts/release-pipeline.md):

1. **On the pull request**: the run graph shows lint, build and lighthouse, with `deploy` skipped.
   Lighthouse has a public report link.
2. **First push to `master` after merging**: `deploy` starts only after lint and lighthouse pass.
   The log shows that it downloads `dist` and has no install or build step. The live site updates.
3. **Optional failure check**: on `master`, push a commit that removes an image's `alt` text.
   Lighthouse fails, `deploy` is skipped, and the live site is unchanged. Then revert the commit.
   The gate is what keeps this safe.
4. Confirm `deploy.yml` is gone, and that no other workflow has `pages: write`.
