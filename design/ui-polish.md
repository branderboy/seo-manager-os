# UI Polish Pass

Run a structured two-phase visual audit across any codebase — then apply approved fixes. Phase 1 audits and waits for scope approval. Phase 2 implements. Never touches logic, only style.

## Process

1. **Identify the project.** Read `$ARGUMENTS` or ask which project. Read the project's `claude.md` and client's `claude.md` to understand what NOT to change — intentional aesthetic choices (e.g. brutalist/flat designs that shouldn't get hover lifts or deep shadows).

2. **Scan the codebase.** Find all CSS/module files, token files, globals, and component files. Note the styling approach (CSS Modules, Tailwind, styled-components, plain CSS).

3. **Run the audit.** For each of the 10 categories below, scan relevant files. Output a structured report:
   ```
   [CATEGORY] File: path/to/file — Line: XX
   Problem: <what's wrong>
   Fix: <what to do>
   Priority: HIGH / MEDIUM / LOW
   ```
   Flag any finding that conflicts with the project's design philosophy as `SKIP — [reason]`.

4. **Present the full audit report** grouped by priority. Do not write any code yet.

5. **Wait for approval.** Ask which priorities to implement: all HIGH, HIGH+MEDIUM, or a specific subset.

6. **Token consolidation first.** Add/update token files (`tokens.css`, `variables.css`, `theme.ts`) before touching component files, so components can reference the new tokens immediately.

7. **Apply approved fixes.** For each change: state the file and reason, make the edit, note cascading files that need updating.

8. **Verify visually.** Use `preview_screenshot`, `preview_inspect`, and `preview_snapshot` to confirm changes. Check token resolution with computed styles.

9. **Reduced-motion check.** Confirm all new animations follow the guard pattern in Guardrails. Toggle macOS Reduce Motion and spot-check.

10. **Report skipped items.** Report what was intentionally left out and why.

---

## Audit Categories

**1. Design Tokens** — Hardcoded hex values, magic pixel sizes, arbitrary `z-index` numbers (e.g. `999`), ad-hoc `box-shadow` definitions, off-scale spacing. Flag if no central token file exists (HIGH). Token system should cover: duration scale, easing curves, radius scale, shadow scale, spacing scale (4px base unit), z-index scale, semantic state colors.

**2. Typography** — Body font below 16px, line-height outside 1.4–1.8, unconstrained line lengths (optimal: 60–75ch), headings missing `text-wrap: balance`, body paragraphs missing `text-wrap: pretty`, no font-smoothing on `<body>`, fixed `px` font sizes instead of `rem`, dynamic numbers missing `font-variant-numeric: tabular-nums`, `font-display: swap` missing from `@font-face`.

**3. Color & Contrast** — Text below WCAG AA (4.5:1 normal, 3:1 large text), too-light placeholders, solid `border` where a layered `box-shadow` would be more versatile, images missing inner outline overlay (`outline: 1px solid rgba(0,0,0,0.08); outline-offset: -1px`), inconsistent accent color usage across interactive elements.

**4. Spacing & Layout** — Padding/margin values not on the 4px scale (e.g. `13px`, `7px`), broken concentric border-radius (inner element radius should equal outer − padding), touch targets below 44×44px, text containers without `max-width`, inconsistent `gap` values in flex/grid layouts.

**5. Transitions & Animations** — `transition: all` (performance antipattern — causes layout recalcs), keyframe animations used for hover/toggle states (should be `transition` — it's interruptible), interactive durations above 400ms (feels broken), no easing function (defaults to `linear`), enter animations with no stagger on multi-item lists, abrupt icon state swaps with no opacity/scale transition, animating `width`/`height`/`top`/`left`/`margin` (forces layout).

**6. Accessibility & Motion** — Animations not guarded by `@media (prefers-reduced-motion)`, nuclear `* { animation: none }` (removes all state communication — wrong), missing `:focus-visible` custom styles, `:focus` used instead of `:focus-visible`, missing `cursor: pointer` on clickable non-buttons, missing `cursor: not-allowed` on disabled elements, ARIA live regions missing from dynamic content (toasts, counters, status).

**7. Loading & Feedback States** — Full-page spinners where skeletons would preserve layout, buttons with no loading/disabled state during async actions, no success/error feedback after form submissions, completely blank empty states, skeleton shapes that don't match real content.

**8. Micro-interactions & Hover States** — Clickable elements with no hover feedback, icon-only buttons without tooltip on hover, dropdowns/modals that appear instantly with no animation, form fields with only browser-default focus style, missing CTA subtle lift on hover (only flag if design philosophy allows — skip for flat/brutalist designs).

**9. Shadows & Depth** — Single-layer flat shadows, opaque shadow colors (breaks on dark/coloured backgrounds), no elevation differentiation between component levels (tooltip vs card vs modal), missing hover shadow deepening on interactive cards. Recommended system: `--shadow-xs` through `--shadow-xl` using `rgba` only.

**10. Scrolling & Page-Level Polish** — Missing `scroll-behavior: smooth` (with reduced-motion guard), unstyled browser-default scrollbars breaking visual cohesion, instant route transitions, sticky headers with no `backdrop-filter: blur()`, no page-entry animation on content.

---

## Guardrails

**Check project philosophy first.** Flat/brutalist designs should not receive hover lifts, deep shadows, or scroll-linked entrances. Read the project `claude.md` before flagging Categories 8 and 9. When in doubt, mark SKIP.

**CSS Modules keyframe scoping — critical gotcha.** CSS Modules transforms animation names in `.module.css` files to scoped hashes (`fadeUp` → `ComponentName_fadeUp__abc123`). Keyframes defined in `globals.css` stay unscoped. The names never match → animation silently never fires with no error. **Fix: always define `@keyframes` locally inside the same `.module.css` file that references them.** Never cross-reference globals.css keyframes from module files.

**`animation-fill-mode: both`** on all entrance animations. Holds the `from` state (opacity: 0) before the delay fires — prevents a flash of fully-visible content before the animation starts.

**Opacity-only card cascades.** Prefer pure `opacity: 0 → 1` over `opacity + translateY` for list/card stagger. Movement at short durations looks cheap. Reserve `translateY` for single focal-point entrances (modals, sheets, drawers).

**Layout shift from client-side state.** When a component reads `localStorage`/cookies in `useEffect` and conditionally renders above other content, it causes a layout shift. Fix: replace `useEffect` with `useLayoutEffect` (fires before browser paint). Also add a 300–400ms `animation-delay` to the content below it to mask the gap on slow hydration.

```css
/* Pattern: isomorphic layout effect (suppresses SSR warning) */
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;
```

**Hover states on dense list items.** Background color change only — no `transform: translateY` or `box-shadow` depth. Lift/depth works in gallery card contexts but feels unstable in tight lists or reading UIs.

**Reduced-motion pattern — always provide a fallback, not just a guard:**
```css
/* Guard: run the full animation only if motion is OK */
@media (prefers-reduced-motion: no-preference) {
  .el { animation: fadeIn 450ms var(--ease-out-expo) both; }
}
/* Fallback: still communicate state, just fast */
@media (prefers-reduced-motion: reduce) {
  .el { animation: fadeIn 150ms ease both; }
}
/* Never: */
/* @media (prefers-reduced-motion: reduce) { .el { animation: none; } }
   — this removes visual confirmation that a transition happened */
```

**Stagger animation pattern for card lists:**
```css
/* Define keyframes locally — not in globals.css */
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@media (prefers-reduced-motion: no-preference) {
  .card { animation: fadeIn 450ms var(--ease-out-expo) both; }
  .card:nth-child(1)  { animation-delay: 0ms; }
  .card:nth-child(2)  { animation-delay: 20ms; }
  .card:nth-child(3)  { animation-delay: 40ms; }
  .card:nth-child(4)  { animation-delay: 60ms; }
  .card:nth-child(5)  { animation-delay: 80ms; }
  .card:nth-child(6)  { animation-delay: 100ms; }
  .card:nth-child(7)  { animation-delay: 120ms; }
  .card:nth-child(8)  { animation-delay: 140ms; }
  .card:nth-child(9)  { animation-delay: 160ms; }
  .card:nth-child(10) { animation-delay: 180ms; }
  .card:nth-child(n+11) { animation-delay: 200ms; } /* cap the tail */
}
@media (prefers-reduced-motion: reduce) {
  .card { animation: fadeIn 150ms ease both; }
}
```

**Transition scope — always specific, never `all`:**
```css
/* Good */
transition: background-color 150ms ease, box-shadow 150ms ease;
/* Bad — triggers layout recalc on every transition tick */
transition: all 200ms ease;
```

---

## Rules

- Only change visual/style code — never component logic, props, or data flow
- Always read project `claude.md` before auditing — skip anything conflicting with stated design philosophy
- Present the full audit and wait for scope approval before writing any code
- Token changes always go before component changes
- Animate only `transform` and `opacity` — never `width`, `height`, `top`, `left`, or `margin`
- Specify exact transition properties — never `transition: all`
- `@keyframes` must be defined locally in each `.module.css` file that references them
- All new animations require a `prefers-reduced-motion: reduce` fallback — not just a guard
- Mark philosophy conflicts as `SKIP — [reason]` in the audit; never silently omit them

---

## Verification

After applying:
1. `preview_screenshot` the main surface — share with the user
2. `preview_inspect` computed styles on changed elements to confirm token values resolved correctly
3. Spot-check animations via eval: `getComputedStyle(el).animationName` — if it returns a scoped hash with no matching keyframe, the CSS Modules scoping bug is present
4. Toggle macOS Reduce Motion (System Settings → Accessibility → Reduce Motion) — confirm animation fallbacks fire
5. Tab through the page — confirm `:focus-visible` rings appear on all interactive elements
