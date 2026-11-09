# Feature Specification: Improve Accessibility and SEO

**Feature Branch**: `accessibility`

**Created**: 2026-11-09

**Status**: Draft

**Input**: User description: "issue 67" (GitHub issue #67, "Improve accessibility and SEO")

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Keyboard and screen reader users can move around the page (Priority: P1)

A visitor who navigates by keyboard or screen reader can jump straight to the main content, can
identify the page's regions, and can always see where focus is, including on the contact panel.

**Why this priority**: Accessibility is the constitution's only non-negotiable principle, and these
are its known gaps. They also serve as direct evidence of the owner's engineering care.

**Independent Test**: Using only a keyboard and a screen reader on either language page, skip to the
main content, list the page's landmarks, and tab through the contact panel in both themes.

**Acceptance Scenarios**:

1. **Given** a keyboard user has just loaded a page, **When** they press Tab, **Then** a skip link
   becomes visible as the first focusable item, in the language of the page.
2. **Given** the skip link has focus, **When** the user activates it, **Then** focus moves to the
   main content and the next Tab continues from there.
3. **Given** a screen reader user, **When** they list landmarks, **Then** they find one banner, one
   main region, one footer region, and navigation regions that each have a distinct label.
4. **Given** either theme, **When** a keyboard user moves focus to any item in the contact panel,
   **Then** the focus indicator has at least 3:1 contrast with the colours next to it.
5. **Given** a mouse user, **When** they use the page without a keyboard, **Then** the skip link
   stays out of sight and the layout looks the same as before.

---

### User Story 2 - French visitors read French throughout (Priority: P2)

A French-speaking recruiter reads the page, shares it, or reaches it through a search engine, and
gets French wherever translation applies.

**Why this priority**: The constitution requires complete bilingual parity, and these are its last
known gaps.

**Independent Test**: Review the French page's visible text, sharing metadata and structured data,
and confirm that only permitted proper nouns and employment history job titles remain in English.

**Acceptance Scenarios**:

1. **Given** the French page, **When** a visitor reads the experience section, **Then** each role
   title appears in English, as the title actually held.
2. **Given** the French page is shared on a social platform, **When** the preview image's description
   is read, **Then** it is in French.
3. **Given** a search engine reads the French page's structured data, **When** it reads the job
   title, **Then** it is in French.
4. **Given** the English page, **When** compared with before this change, **Then** its text, metadata
   and structured data are unchanged.
5. **Given** the French profile description, **When** it is read, **Then** its apostrophes match the
   typographic style used in the rest of the French text.

---

### User Story 3 - A wrong address still leads somewhere useful (Priority: P2)

A visitor follows a broken or mistyped link. Instead of a generic hosting error, they see a page that
looks like the rest of the site, in both languages, with a way back and a way to get in touch.

**Why this priority**: Broken links are shared in CVs and messages that can't be corrected, and a
generic error loses a visitor who wanted to see the portfolio.

**Independent Test**: Visit several missing addresses, including deep ones and ones under the French
section, and confirm the page appears styled and the links work, with and without scripts.

**Acceptance Scenarios**:

1. **Given** an address that doesn't exist, **When** a visitor opens it, **Then** they see a styled
   message in English and French.
2. **Given** the error page, **When** a visitor chooses a home link, **Then** they reach the home page
   in the language of that link.
3. **Given** the error page, **When** a visitor looks for a contact route, **Then** one is available
   on the first screen.
4. **Given** a deeply nested missing address, **When** the page loads, **Then** its styling and images
   still load.
5. **Given** a visitor who prefers dark, **When** the error page loads, **Then** it uses the dark theme
   from the first paint.
6. **Given** a visitor with scripts disabled, **When** the error page loads, **Then** all its content
   and links work.

---

### User Story 4 - The site is recognisable in the browser (Priority: P3)

A visitor with many open tabs, or who has saved the site to their phone's home screen, recognises it
by a mark that matches the site's identity, and the browser's interface blends with the page.

**Why this priority**: A small amount of polish that doesn't affect access to the content.

**Independent Test**: View the browser tab in light and dark browser themes, add the site to a phone's
home screen, and view it in a mobile browser that colours its interface.

**Acceptance Scenarios**:

1. **Given** a browser tab, **When** the site is open, **Then** the tab shows a "KH." mark that is
   legible at tab size against both light and dark browser themes.
2. **Given** a phone, **When** a visitor adds the site to their home screen, **Then** the "KH." mark is
   used as the icon.
3. **Given** a mobile browser that colours its interface, **When** the site is open, **Then** the
   interface colour blends with the page, following the visitor's system light or dark setting.

### Edge Cases

- A skip link is activated when the page is scrolled: the view moves to the main content.
- Focus indicators in the contact panel sit against a panel whose colour reverses between themes: each
  theme must meet the contrast requirement on its own.
- A focusable item in the contact panel is a plain link rather than a button: it must also meet the
  contrast requirement.
- A missing address under the French section: the single error page still appears, with both languages.
- The language redirect must not apply to the error page, and the error page must not be listed for
  search engines as a page of the site.
- A browser that doesn't support scalable icons: a fallback must still show a recognisable icon.
- Moving the header, navigation and footer must not change their position or appearance.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Each page MUST have exactly one banner, one main region and one footer region, each recognised by assistive technology, and the main region MUST contain only the page's main content.
- **FR-002**: Each navigation region MUST have a distinct accessible label in the language of the page.
- **FR-003**: Each page MUST provide a skip link as its first focusable item, which is visible when focused, is in the language of the page, and moves focus to the main content when activated.
- **FR-004**: The skip link MUST NOT be visible or change the layout unless it has keyboard focus.
- **FR-005**: Every focus indicator on the site MUST have at least 3:1 contrast with adjacent colours, in both themes.
- **FR-006**: On the French page, the sharing preview image's description and the job title in structured data MUST be in French.
- **FR-007**: Proper nouns such as people, employers, products, technologies and official qualification names, and the job titles in the employment history, MAY remain untranslated. The employment history job titles MUST remain in English.
- **FR-008**: The English page's text, metadata and structured data MUST remain unchanged, apart from the new skip link text.
- **FR-009**: The French profile description MUST use the same apostrophe style as the rest of the French text.
- **FR-010**: Any address that doesn't exist on the site MUST display a styled error page with its message in both English and French, with each language marked for assistive technology.
- **FR-011**: The error page MUST provide a link to the home page in each language and a contact route on the first screen.
- **FR-012**: The error page MUST work without scripts, load its styling and images from any depth of address, honour the visitor's theme, and not trigger the language redirect.
- **FR-013**: The error page MUST NOT be listed in the site's sitemap, and MUST meet the same accessibility and quality requirements as other pages.
- **FR-014**: The site MUST use a "KH." mark as its browser icon, legible at tab size on light and dark browser themes, in place of the current emoji.
- **FR-015**: The site MUST provide a home screen icon of the "KH." mark for phones, and a fallback for browsers that don't support scalable icons.
- **FR-016**: The site MUST declare a browser interface colour matching the page background for the visitor's system light or dark setting.
- **FR-017**: Apart from the changes described here, there MUST be no visual differences on the two language pages.

### Key Entities

- **Error page**: A single page shown for every missing address, carrying both languages.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On both language pages, a keyboard user can reach the main content with two key presses from page load.
- **SC-002**: A landmark review of both pages finds exactly one banner, one main region and one footer region, and no unlabelled or identically labelled navigation regions.
- **SC-003**: 100% of focusable items on the site have a focus indicator of at least 3:1 contrast in both themes.
- **SC-004**: A review of the French page finds no English text apart from permitted proper nouns and employment history job titles.
- **SC-005**: From any tested missing address, a visitor reaches the home page in their language in one action, with or without scripts.
- **SC-006**: The "KH." mark is legible at 16 pixels on light and dark browser themes, and appears on a phone home screen.
- **SC-007**: Every page, including the error page, meets the project's automated quality thresholds, with accessibility, best practices and SEO at 100 and performance at 90 or above.
- **SC-008**: A side-by-side comparison of the two language pages shows no unintended visual differences, apart from the apostrophes in the French profile description.

## Assumptions

- Employment history job titles stay in English, as the titles actually held (decided 2026-11-09). The constitution is amended to permit this. The hero headline and the job title in structured data describe the owner's profession and remain translated.
- The hosting platform serves a single error page for every missing address, so one page carries both languages rather than one page per language. Language-specific error pages would need scripts and wouldn't work without them.
- The browser interface colour follows the visitor's system setting, and doesn't change when they use the site's theme toggle.
- The existing qualification name remains in English as an official qualification name.
- The suggestions in issues #65 and #69 are out of scope.
- The site remains static and prerendered on GitHub Pages.
