# Feature Specification: Simplify the Frontend

**Feature Branch**: `cleanup-frontend`

**Created**: 2026-11-09

**Status**: Draft

**Input**: User description: "issue 68" (GitHub issue #68, "Simplify the frontend and reduce JavaScript")

## User Scenarios & Testing *(mandatory)*

### User Story 1 - One way to style the site (Priority: P1)

The site owner changes how something looks and needs to work in only one place and one style,
instead of working out which of two approaches applies. Visitors see exactly the same site as
before.

**Why this priority**: It removes an ongoing source of confusion and an unnecessary dependency, and
it is the only part of this work that carries a risk of visible regressions.

**Independent Test**: Review the codebase to confirm a single styling approach, then compare the
rendered site against the previous version at each combination of width, language and theme.

**Acceptance Scenarios**:

1. **Given** the finished change, **When** the owner reviews the styling, **Then** only the
   hand-written stylesheets are in use.
2. **Given** each combination of width, language and theme, **When** compared with the previous
   version, **Then** there are no unintended visual differences.
3. **Given** a keyboard user, **When** they move focus to the theme toggle, **Then** a visible focus
   indicator appears, as it does today.
4. **Given** a pointer user, **When** they hover over the theme toggle, **Then** its colour changes
   as it does today, in both themes.
5. **Given** a screen reader user, **When** they reach the site name and the language links,
   **Then** their hidden descriptions are announced and remain visually hidden.

---

### User Story 2 - No dead code (Priority: P2)

The site owner reads the project code and finds only code that is actually used, so nothing
misleads them about how the site works.

**Why this priority**: A small tidy-up with no visitor impact, but cheap to do alongside the
styling work, and the unused placeholder artwork depends on the styling approach being removed.

**Independent Test**: Confirm the unused project placeholder artwork and redundant style rules are
gone and that project cards look the same.

**Acceptance Scenarios**:

1. **Given** every project has a screenshot, **When** the owner reviews the project card code,
   **Then** no placeholder artwork code, data or styles remain.
2. **Given** a new project is added without a screenshot, **When** the site is built, **Then** the
   build fails rather than publishing a broken card.
3. **Given** the redundant style rules are removed, **When** project cards are viewed at any width,
   **Then** they look the same as before.

### Edge Cases

- The removed styling tool also supplied browser-default resets: headings, lists, images, links and
  buttons must not fall back to default browser appearance anywhere on the site.
- The theme toggle is a button: it must not gain a default browser border or background.
- Text selection, focus outlines and the header divider must keep their current appearance in both
  themes.
- A visitor with reduced motion enabled: the site continues to honour that preference.
- The owner adds a project: the required screenshot is enforced before publication.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The site MUST use a single styling approach, the existing hand-written stylesheets, and the utility-class framework MUST be removed from the project.
- **FR-002**: All visible content on both language pages MUST remain the same as before this change.
- **FR-003**: The theme toggle MUST keep its current appearance, including hover and keyboard focus states, in both themes.
- **FR-004**: Text intended only for screen readers MUST remain announced and visually hidden.
- **FR-005**: The site MUST keep the visual baseline previously supplied by the removed framework, so that no element falls back to default browser appearance.
- **FR-006**: There MUST be no unintended visual differences at widths of 320px, 768px and 1280px, in both languages and both themes.
- **FR-007**: Unused placeholder artwork for projects without screenshots MUST be removed, including its data and styles.
- **FR-008**: Every project MUST have a screenshot, and a project without one MUST fail the build.
- **FR-009**: Style rules that repeat the values they override MUST be removed with no visual effect.
- **FR-010**: Theme toggle behaviour, language links and first-load behaviour MUST remain unchanged, and MUST continue to meet the contract in `specs/001-fix-small-bugs/contracts/first-load-behaviour.md`.
- **FR-011**: Both pages MUST continue to meet the project's existing automated quality thresholds.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A side-by-side comparison of all 12 combinations of width, language and theme shows no unintended visual differences.
- **SC-002**: A review of the codebase finds one styling approach, and no remaining placeholder artwork or redundant style rules.
- **SC-003**: The compressed stylesheet downloaded by visitors is no larger than the 5.4 KB it is today.
- **SC-004**: 100% of theme toggle states (default, hover, keyboard focus, light and dark) match the previous version.
- **SC-005**: Both pages meet every existing automated quality threshold, with accessibility, best practices and SEO at 100 and performance at 90 or above.

## Assumptions

- Reducing the site's script size is out of scope and closed with no action (decided 2026-11-09). Lighthouse scored 99 for performance on both pages in the latest CI run, with 40 ms or less of total blocking time and no layout shift, so the extra work would have no meaningful benefit for visitors.
- The tooling used to build pages and the amount of script they ship stay as they are.
- The site's skills list and other content are not changed by this work.
- The suggestions in issues #65, #67 and #69 are out of scope.
- The site remains static and prerendered on GitHub Pages, and this specification satisfies the constitution's requirement that replacing a styling system is specified first.
