# Quickstart: Validate the Bug Fixes

## Prerequisites

Node 24 and installed dependencies (`npm ci`). The dev server doesn't prerender, so test against a
production build.

```sh
npm run lint
npm test
npm run build
npm run preview
```

**Expected**: every command succeeds, and `npm test` covers each row of the tables in
[contracts/first-load-behaviour.md](contracts/first-load-behaviour.md).

Run the checks below against the preview address. To simulate conditions:

- **French browser**: Chrome DevTools, Sensors panel, set the locale to `fr-FR`.
- **Storage blocked**: Chrome settings, block all cookies and site data for the preview address.
- **Saved choice reset**: DevTools, Application panel, clear site data.

## Scenarios

| # | Setup | Action | Expected | Covers |
|---|---|---|---|---|
| 1 | French browser, on `/fr/` | Open EN by click, middle-click, Ctrl/Cmd-click and "open in new tab" | English page each time, with `/` in the address and no redirect | US1, SC-001 |
| 2 | After scenario 1 | Visit `/` directly | English page | US1 |
| 3 | English browser, data cleared, on `/` | Middle-click FR, then visit `/` | French both times | US1 |
| 4 | French browser, storage blocked | Click EN, then reload | English page both times, `?lang=en` stays in the address | FR-003 |
| 5 | French browser, data cleared | Visit `/?utm_source=x&b=2#projects` | `/fr/?utm_source=x&b=2#projects`, scrolled to Projects | US5, SC-003 |
| 6 | Storage blocked, system dark | Load the page | Dark from first paint, no light flash | US4, SC-002 |
| 7 | Storage blocked, system light | Load, then use the theme toggle | Light, then toggles for that view | US4 |
| 8 | Either language | View the footer and page source | `© Kyle Heron`, no year | US2, SC-004 |
| 9 | JavaScript disabled | Follow both language links | Both pages load with full content | Principle II |
| 10 | Each language and theme | Network panel filtered to fonts | No font requests | SC-005 |
| 11 | Each language, widths 320px, 768px and 1280px | Inspect all headings | No touching letters or overflow, on Windows, macOS or Linux where available | US3, FR-008 |
| 12 | Page source of `/` and `/fr/` | Inspect canonical and `hreflang` | No `lang` parameter in either | FR-005 |

## Quality gates

Run Lighthouse as described in `README.md`.

**Expected**: both pages pass the thresholds in `lighthouserc.json`: 100 for accessibility, best
practices and SEO, and performance at 90 or above (SC-006).
