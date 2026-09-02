# What agents are trusted for

Being precise about this is what keeps the standard from reading as distrust. Agents are
fast and useful. They are just not the final authority on their own work.

## Trusted and encouraged

- Reading and mapping an unfamiliar codebase.
- Explaining architecture, data flows, dependencies, and code paths.
- Drafting delivery contracts, acceptance criteria, and test plans.
- Implementing scoped features from approved specifications.
- Generating boilerplate, UI components, API clients, schemas, migrations, documentation.
- Writing first pass unit, integration, and end to end tests.
- Identifying likely defects, inconsistent patterns, dead code, and missing tests.
- Reviewing pull requests and diffs as a secondary reviewer.
- Creating reproducible audit checklists and remediation plans.
- Summarizing test output, logs, and changed files.
- Producing proof artifact checklists and human verification steps.

## Not trusted without independent verification

- Final production security approval.
- Final authorization and tenant isolation approval.
- Real world payment correctness.
- Live customer data migration approval.
- Production credentials and secret management.
- Legal, compliance, privacy, or retention decisions.
- Irreversible production actions.
- Declaring that a real external integration works without staging or live evidence.
- Releasing software that handles sensitive data or business critical actions.

## The independence rule

The same agent may implement code, write tests, run tests, gather proof, and produce a
delivery report. The same agent may not be the sole source that accepts its own delivery
as correct, secure, or production ready.
