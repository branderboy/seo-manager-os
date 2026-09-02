# helpers

The standard's shipped `auth.ts` helper was removed rather than left as a stub: this
application has no authentication, so a sign-in helper here would be a fixture pretending
to exercise a control that does not exist.

When authentication lands under AUTH-001, restore it from the kit and wire it here. Until
then, `tests/e2e/routes.ts` is the single place the e2e suites get their route list.
