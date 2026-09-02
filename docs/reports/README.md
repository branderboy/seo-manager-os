# Reports

| File | Written by | When |
|---|---|---|
| `_TEMPLATE.md` | The implementing agent | At the end of every contract delivery |
| `_VERIFICATION_TEMPLATE.md` | A verifier who did not implement the work | Before a contract can be marked Verified |

Audit reports live in `docs/audits/`. Name completed reports
`<CONTRACT-ID>-<yyyy-mm-dd>-delivery.md` and `<CONTRACT-ID>-<yyyy-mm-dd>-verification.md`
so the pair is obvious at a glance.

A delivery report with no matching verification report means the contract is not done,
regardless of what the delivery report says about itself.
