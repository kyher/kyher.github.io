# Feature Specification: Fix Small Site Bugs

**Feature Branch**: `bug-fixes`

**Created**: 2026-11-09

**Status**: Draft

**Input**: User description: "issue 66" (GitHub issue #66, "Fix small bugs in footer year, inline script and font loading")

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Language choice is always respected (Priority: P1)

A visitor whose browser is set to French chooses English, however they open the link: a normal
click, a middle-click, a modified click or "open in new tab". They see the English page and stay
on it. Today, any route other than a normal click sends them back to French, and visitors whose
browser blocks site storage cannot reach the English page reliably once redirects are working.

**Why this priority**: This is the only bug that stops a visitor from reading the site in the
language they asked for. A recruiter who cannot get to English may simply leave.

**Independent Test**: With a French browser language, open the English link by each method and
confirm the English page appears and remains displayed.

**Acceptance Scenarios**:

1. **Given** a visitor with a French browser language on the French page, **When** they
   middle-click the English link, **Then** the new tab shows the English page and does not
   redirect.
2. **Given** a visitor with a French browser language on the French page, **When** they choose
   "open in new tab" for the English link, **Then** the new tab shows the English page and does
   not redirect.
3. **Given** a visitor who opened a language link in a new tab, **When** they later return to the
   site's root address, **Then** they see the language they last chose.
4. **Given** a visitor with a French browser language and site storage blocked, **When** they
   choose the English link, **Then** they see the English page and do not get redirected back.
5. **Given** a visitor with an English browser language, **When** they open the French link in a
   new tab, **Then** the new tab shows the French page and that choice applies on later visits to
   the root address.

---

### User Story 2 - Footer never shows an outdated year (Priority: P2)

Any visitor reaching the bottom of the page sees a copyright notice that is never out of date,
whether or not the site has been redeployed recently.

**Why this priority**: Everyone who scrolls to the footer sees it, and an old year makes a
portfolio look neglected. It has low severity but wide reach.

**Independent Test**: View the footer with the device date set to a year later than the last
build and confirm no past year is shown.

**Acceptance Scenarios**:

1. **Given** the site was last deployed in an earlier calendar year, **When** a visitor views the
   footer, **Then** no outdated year is displayed.
2. **Given** a visitor has JavaScript disabled, **When** they view the footer, **Then** the
   notice is still present and correct.

---

### User Story 3 - Headings read well on every device (Priority: P2)

A visitor on any device sees headings in their device's own system font, with spacing suited to
it. Headings are comfortable to read and do not look cramped, and no font has to be downloaded.

**Why this priority**: Typography affects the first impression of every visitor. Today most of
them get a fallback font with spacing that was not chosen for it.

**Independent Test**: View the page on devices with different system fonts and confirm headings
have no touching or colliding letters, and that no font files are downloaded.

**Acceptance Scenarios**:

1. **Given** any device, **When** a visitor loads the page, **Then** headings display in the
   device's system font with legible letter spacing and no font is downloaded.
2. **Given** a narrow mobile screen, **When** a visitor views the main heading in either language,
   **Then** letters do not touch and the text does not overflow.

---

### User Story 4 - System theme works when storage is blocked (Priority: P3)

A visitor who prefers dark mode and whose browser blocks site storage sees the dark theme from the
first paint, as any other visitor with that preference does.

**Why this priority**: It affects few visitors and the site remains usable, but a bright page
ignoring a stated preference is a visible flaw.

**Independent Test**: Block site storage, set the system to dark mode, load the page, and confirm
the dark theme appears with no flash of the light theme.

**Acceptance Scenarios**:

1. **Given** site storage is blocked and the system prefers dark, **When** the page loads,
   **Then** the dark theme is applied before the first paint.
2. **Given** site storage is blocked and the system prefers light, **When** the page loads,
   **Then** the light theme is applied.
3. **Given** site storage is blocked, **When** the visitor uses the theme toggle, **Then** the
   theme changes for the rest of that page view.

---

### User Story 5 - Campaign links survive the language redirect (Priority: P3)

Someone follows a link to the site that carries campaign or tracking parameters. If they are
redirected to the French page, those parameters and any section anchor are kept.

**Why this priority**: The site has little need for attribution today, so losing it has limited
impact, but the fix keeps shared links intact.

**Independent Test**: With a French browser language, open the root address with parameters and a
section anchor, and confirm all of them appear unchanged on the French page.

**Acceptance Scenarios**:

1. **Given** a visitor who will be redirected to French, **When** they open a root address with
   query parameters, **Then** the French page address has identical parameters.
2. **Given** a visitor who will be redirected to French, **When** they open a root address with
   both query parameters and a section anchor, **Then** both are kept and the page scrolls to that
   section.

### Edge Cases

- A visitor has an explicit saved language that differs from their browser language: the saved
  choice takes priority.
- Site storage is blocked and the browser is French: an arrival at the root address with no
  explicit language choice is redirected to French, but an explicit choice of English is honoured.
- A visitor has JavaScript disabled: no redirect occurs, both languages remain reachable by link,
  and the default system-independent theme applies.
- The site's root address is opened with an empty query string or no anchor: the redirect must not
  add stray characters to the address.
- An English link opened by any method must never cause a redirect loop between languages.
- A device has an unusually wide or narrow system font: headings remain legible and do not
  overflow.
- A search engine or a shared link reaches the English page: each language keeps its single
  canonical public address.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The site MUST display the language the visitor explicitly selected, regardless of
  how the language link was opened.
- **FR-002**: The site MUST remember an explicit language choice for later visits to the root
  address, whichever way the link was opened, when site storage is available.
- **FR-003**: Visitors with site storage blocked MUST be able to reach and remain on the page for
  the language they explicitly selected for that page load.
- **FR-004**: An explicit language choice MUST take priority over the browser's language.
- **FR-005**: The site MUST NOT add a new indexable address for either language; each language
  MUST keep its single canonical address.
- **FR-006**: The footer MUST display a copyright notice that cannot show an outdated year,
  including when JavaScript is disabled.
- **FR-007**: Headings and body text MUST be displayed using the device's system font, and the
  site MUST NOT download a typeface.
- **FR-008**: Heading letter spacing MUST remain legible, with no touching letters, at viewport
  widths from 320px upward and in both languages.
- **FR-009**: The design MUST NOT depend on a typeface that is not available to every visitor, so
  visitors who happen to have a particular font installed see the same intended spacing.
- **FR-010**: The site MUST apply the visitor's system theme preference when site storage is
  unavailable, before the first paint.
- **FR-011**: A failure to access site storage MUST NOT prevent any other first-load behaviour
  from running.
- **FR-012**: The redirect to the French page MUST keep all query parameters and any section
  anchor unchanged.
- **FR-013**: All fixes MUST behave the same on the English and French pages, and MUST keep every
  page's existing quality thresholds.

### Key Entities

- **Language preference**: The visitor's explicit choice of English or French. It is stored in the
  browser when possible and takes priority over the browser's language.
- **Theme preference**: The visitor's explicit light or dark choice, falling back to the system
  setting when absent or unavailable.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In testing, 100% of link-opening methods (click, middle-click, modified click and
  "open in new tab") show the language selected, across both languages.
- **SC-002**: With site storage blocked, 100% of page loads match the system theme, with no visible
  flash of the other theme.
- **SC-003**: After a redirect to French, 100% of query parameters and section anchors match the
  original address exactly.
- **SC-004**: With the date set to any year after the last deployment, the footer shows no outdated
  year.
- **SC-005**: On every device tested, headings show no touching letters or overflow at any width
  from 320px upward, in both languages, and no font files are downloaded.
- **SC-006**: Both language pages continue to meet every existing automated quality threshold,
  with the performance score remaining at 90 or above.

## Assumptions

- The footer resolves the stale year by showing the copyright notice without a year, rather than
  setting the year after load. This also meets the constitution's requirement that core content
  works without JavaScript.
- The typeface issue is resolved by using system fonts with looser heading spacing, rather than
  shipping a font (decided 2026-11-09). This fits the constitution's "Lightweight and Simple"
  principle, and the small visual differences between devices are accepted.
- A visitor with no saved choice and storage blocked follows their browser language at the root
  address, as other visitors with no saved choice do.
- With storage blocked, an explicit language choice applies to that page load only, since nothing
  can be remembered between visits.
- The theme continues to be set at page load. Following live system theme changes is out of scope.
- The other suggestions in the wider improvements review are out of scope and tracked in issues
  #65, #67, #68 and #69.
- The site remains a static, prerendered site hosted on GitHub Pages, as the constitution requires.
