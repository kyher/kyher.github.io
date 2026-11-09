# Research: Simplify the Frontend

No unknowns remained after reading the spec, the constitution, Tailwind's reset and the built CSS.
These are the design decisions behind the plan.

## R1. What replaces Tailwind's reset

- **Decision**: Add a small reset to `src/index.css` containing only the rules this site relies on:

| Selector | Rules kept | Why the site needs it |
|---|---|---|
| `*, ::before, ::after, ::backdrop` | `box-sizing: border-box`, `margin: 0`, `padding: 0`, `border: 0 solid` | Spacing throughout assumes zero defaults |
| `html` | `-webkit-text-size-adjust: 100%`, `-webkit-tap-highlight-color: transparent` | Mobile text size and tap appearance |
| `h1` to `h6` | `font-size: inherit`, `font-weight: inherit` | No heading sets a weight, so without this they'd all turn bold |
| `a` | `color: inherit`, `text-decoration: inherit` | Links in the contact panel and elsewhere would gain underlines |
| `ol, ul, menu` | `list-style: none` | Lists have no markers |
| `img, svg` | `display: block`, `vertical-align: middle` | Stops inline gaps around images and icons |
| `img` | `max-width: 100%`, `height: auto` | Responsive images |
| `button` | `font: inherit`, `letter-spacing: inherit`, `color: inherit`, `border-radius: 0`, `background-color: transparent`, `opacity: 1`, `appearance: button` | The theme toggle would otherwise get default button styling |
| `:-moz-focusring:where(:not(iframe))` | `outline: auto` | Keeps Firefox's focus style |

- **Rationale**: Copying the whole of Tailwind's reset would carry rules for elements the site doesn't
  use, such as tables, forms and code blocks (Principle V). The table covers every element in use.
- **Alternatives considered**: A third-party reset package adds a dependency to replace a dependency.

## R2. Keeping the cascade identical

- **Decision**: Put the reset in `@layer reset`, and fold the existing `*`, `a` and `button, select`
  rules in `src/index.css` into it.
- **Rationale**: Tailwind's reset is layered today, so all site rules beat it regardless of
  specificity or order. A layer keeps that exactly, while an unlayered `* { margin: 0 }` would be
  safe only by depending on stylesheet order. `select` isn't used, so it's dropped.
- **Alternatives considered**: An unlayered reset at the top of the file. It should behave the same
  but relies on import order for equal-specificity rules.

## R3. Replacing the utility classes

- **Decision**: Add these to the existing token and component pattern, keeping Tailwind's resolved
  values exactly:

| New name | Values |
|---|---|
| `.sr-only` in `src/index.css` | `position: absolute`, `width: 1px`, `height: 1px`, `margin: -1px`, `padding: 0`, `overflow: hidden`, `clip-path: inset(50%)`, `white-space: nowrap`, `border-width: 0` |
| `--divider` | Light `oklch(87.2% .01 258.338)`, dark `oklch(44.6% .03 256.802)` |
| `--toggle` | Light `oklch(55.1% .027 264.364)`, dark `oklch(70.7% .022 261.325)` |
| `--toggle-hover` | Light `oklch(27.8% .033 256.848)`, dark `oklch(92.8% .006 264.531)` |
| `.header-divider` | `width: 1px`, `height: 1.25rem`, `background: var(--divider)` |
| `.theme-toggle` | `display: flex`, `cursor: pointer`, `color: var(--toggle)`, `border-radius: .25rem`, `transition: color .15s cubic-bezier(.4, 0, .2, 1)` |
| `.theme-toggle:hover` | `color: var(--toggle-hover)`, inside `@media (hover: hover)` as Tailwind does |
| `.theme-toggle:focus-visible` | `outline: none`, `box-shadow: 0 0 0 2px oklch(62.7% .265 303.9)` |

- **Rationale**: Tokens match how `src/index.css` already handles the two themes, and keeping the
  exact values satisfies FR-003 and FR-006.
- **Alternatives considered**: Reusing `--muted` and `--ink`. It's tidier, but it would change the
  toggle's colours, which the spec rules out.

## R4. Requiring a screenshot

- **Decision**: Make `image` a required prop on `ProjectTile`.
- **Rationale**: `npm run build` starts with `tsc -b`, so a project without an image fails the build
  (FR-008) with no new code.
- **Alternatives considered**: A check in the prerender script duplicates what the type system
  already does.

## R5. Redundant rules

- **Decision**: Remove `src/App.css:248` and `src/App.css:257`.
- **Rationale**: Line 248 repeats the base grid columns at line 161. Line 257 repeats the base 190px
  height at line 185, and the taller featured image uses a more specific selector, so it's
  unaffected.

## R6. Verifying no visual change

- **Decision**: Capture full-page screenshots of the current build before any change, then repeat
  after and compare all 12 combinations pixel by pixel. Hover and focus states are checked by hand.
- **Rationale**: The reset affects every element, and a pixel comparison catches differences that
  are easy to miss by eye (SC-001). The comparison is a one-off check and doesn't belong in the repo.
- **Alternatives considered**: Adding a visual regression tool to CI is more than one change needs.

## R7. Script size

- **Decision**: No action, as recorded in the spec. Lighthouse scored 99 for performance on both pages.
