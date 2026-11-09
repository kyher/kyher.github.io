# Quickstart: Validate the Frontend Simplification

## Prerequisites

Node 24 and installed dependencies (`npm ci`). Take the baseline before changing any code.

## 1. Capture the baseline

Run `npm run build` on the unchanged code and copy `dist/` somewhere outside the repository. Serve
it and capture a full-page screenshot of `/` and `/fr/` at widths of 320px, 768px and 1280px, in
light and dark. That's 12 images, using a window tall enough to fit the whole page.

## 2. Automated checks after the change

```sh
npm ci
npm run lint
npm test
npm run build
```

**Expected**: every command succeeds, and `package.json` and `package-lock.json` no longer list
`tailwindcss` or `@tailwindcss/vite` as direct dependencies.

## 3. Visual comparison

Repeat the 12 screenshots on the new build and compare each one with its baseline, pixel by pixel.

**Expected**: no differences (SC-001). Investigate any that appear. Differences caused only by
anti-aliasing or animation timing should be confirmed by eye.

## 4. Scenarios

| # | Setup | Action | Expected | Covers |
|---|---|---|---|---|
| 1 | Light and dark themes | Hover over the theme toggle | Colour changes as before | FR-003, SC-004 |
| 2 | Light and dark themes | Tab to the theme toggle | 2px purple ring, no outline | FR-003, SC-004 |
| 3 | Either page | Activate the toggle and reload | Theme switches and is remembered | FR-010 |
| 4 | Either page | Inspect the site name and language links | Hidden descriptions are in the accessibility tree and not visible | FR-004 |
| 5 | Reduced motion enabled | Hover over the toggle | No visible transition | Edge cases |
| 6 | Temporarily remove one project's `image` in `src/data/portfolio.ts` | Run `npm run build`, then restore the file | Build fails with a type error | FR-008, US2 |
| 7 | Built site | Download size of the CSS file, gzipped | No larger than 5.4 KB | SC-003 |
| 8 | Source | Search `src/`, `vite.config.ts` and `package.json` for `tailwind`, `gradient` and `project-art` | Only the "Tailwind CSS" entry in the skills list remains | SC-002 |

## 5. Quality gates

Open the pull request and confirm Lighthouse passes on both pages: 100 for accessibility, best
practices and SEO, and performance at 90 or above (SC-005).
