# Pillar 6: Accessibility and user experience

Baseline: WCAG 2.2, Level AA where reasonably applicable. Full checklist:
`docs/audits/accessibility-audit.md`.

Build these in rather than auditing them in afterward:

- Every interactive control is reachable and operable by keyboard, with visible focus and a
  logical order.
- Every control has an accessible name that says what it does.
- Form fields have persistent labels, not placeholder only, and errors say how to fix the
  problem.
- Loading, empty, success, warning, and error states are designed, not left to chance.
- Meaning is never carried by color alone, and text contrast meets AA.
- Modals, menus, dialogs, and notifications trap nothing and announce themselves.
- The layout survives 200 percent zoom and a narrow mobile width.
- Destructive actions confirm and explain the consequence.
- Users can recover from errors without losing what they typed.

WCAG 2.2 covers authentication too. A sign in flow that requires a cognitive puzzle with no
alternative is an accessibility failure, not a security feature.

Automated checks find a minority of real problems. The keyboard pass and the screen reader
aware pass are the ones that count, and they are human owned.
