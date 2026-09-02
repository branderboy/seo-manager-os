# FILES-001: Secure upload, storage, authorized download, and deletion

- Status: Draft
- Owner: <FILL: name>
- Approved by: <FILL: name and date>
- Revision: 1
- Related contracts: AUTH-001, ORG-001
- Workflow spec: docs/workflows/tenant-isolation.md

## 1. Product outcome

Business outcome

Files customers put into the product stay private to the organization that owns them, and
a link that leaks does not become an open door to the bucket.

## 2. Risk level

Critical. Object storage is the most common place a tenant boundary quietly stops existing.

## 3. Agreed delivery

Agreed delivery

An authorized member can upload a file, see it listed within their organization, download
it, and delete it. Storage paths and access policies enforce organization scope. Uploads
are validated by type and size. Download access is authorized per request rather than by
knowing a URL.

## 4. Actors and permissions

| Actor | Permission needed | Actions |
|---|---|---|
| Member | membership | Upload, list, download within the organization |
| Elevated role | <FILL: role name> | Delete, share if the product allows it |
| Anonymous caller | none | No access to the bucket, its listing, or an expired signed URL |

## 5. Preconditions

ORG-001 verified. Storage provider selected and its bucket policy approved by the human owner. Path convention includes the tenant segment.

## 6. Acceptance criteria

Acceptance criteria

| # | Criterion | How it is observed |
|---|---|---|
| 1 | Only permitted file types and sizes are accepted, enforced on the server | Direct API upload with a rejected type and an oversized file |
| 2 | A user cannot download a file belonging to another organization by ID or path | Cross tenant negative test |
| 3 | Signed URLs expire and a stale URL is rejected | Timed integration test |
| 4 | The bucket is not publicly listable or publicly readable | Provider configuration evidence and an unauthenticated fetch |
| 5 | Storage paths include the tenant scope so a path guess cannot cross organizations | Path convention evidence plus a guessed path attempt |
| 6 | Deletion removes both the stored object and the metadata row per <FILL: soft or hard delete rule> | Integration test plus provider evidence |
| 7 | Filenames from users cannot traverse paths or overwrite another record | Negative test with traversal and duplicate name payloads |
| 8 | Upload and download failures do not leak provider errors or credentials to the client | Error path review |

## 7. Failure and edge cases

Rejected file type. Oversized file. Traversal or duplicate filename. Expired signed URL. Guessed object path. Upload interrupted midway. Provider outage during download. A file record whose object was deleted out of band.

## 8. Scope

Scope

- UI: upload control, file list, download action, delete action, error states.
- API routes, server actions, jobs: upload handler, signed URL issuer, delete handler.
  <FILL: paths>
- Database tables, migrations, policies: file metadata table with tenant key. <FILL: name>
- Storage, files, queues, scheduled tasks: <FILL: bucket and path convention>
- Third party providers: <FILL: storage provider>
- Environment variables and configuration: bucket name, credentials, signed URL lifetime.
- Tests, monitoring, documentation, environments: local and staging.

Out of scope: virus scanning, file previews, and versioning.

## 9. Constraints

Constraints

- Storage provider credentials stay server side. The client receives only short lived
  signed access.
- Do not make the bucket public to simplify delivery.
- Do not trust the client reported content type or file size.
- Do not change the tenant scope helper from ORG-001.

## 10. Guardrails

Guardrails

- Security: an unauthenticated fetch against the bucket root is part of the proof, not an
  assumption.
- Integration: provider configuration evidence is captured with credentials redacted.
- Scope: no changes to unrelated upload paths elsewhere in the product.
- Completion: mock only storage evidence does not satisfy this contract.
- Status is Ready for independent verification, never Complete.

## 11. Security and privacy

Uploaded files may contain personal or customer confidential data. Provider credentials stay server side and the client receives only short lived signed access. The bucket is neither publicly listable nor publicly readable. Client reported content type and size are not trusted. Provider errors are not passed through to the client. Deletion follows <FILL: soft or hard delete rule> and the retention policy.

## 12. Performance and cost

File storage and egress are direct cost drivers. Record maximum file size, expected files per tenant, and expected monthly transfer. Uploads above <FILL: size threshold> go direct to storage rather than through the application server. Signed URL lifetime is short enough to limit leak damage and long enough for a real download.

## 13. Test requirements

Test requirements

- Unit: filename sanitization and path construction.
- Integration: upload, list, download, delete with authorized, unauthorized, wrong role,
  and cross tenant callers.
- End to end: full upload to download to delete cycle.
- Negative and authorization: bad type, oversized file, traversal filename, expired URL,
  guessed path, cross organization ID.
- Manual or staging: real provider upload and download.

## 14. Proof of delivery

Proof of delivery

- Branch and commit.
- Test output including every negative case.
- Provider configuration evidence showing access policy, credentials redacted.
- Result of an unauthenticated request against the bucket and against a stale signed URL.

## 15. Independent verification

Independent verification

- Verifier: <FILL: human name>
- Environment: staging with the real storage provider and two organizations.
- Procedure: upload as user A, capture the object path and ID, then attempt download,
  delete, and direct provider access as user B and as an unauthenticated caller.
- Expected result: every unauthorized attempt fails, and no provider error reveals the path
  structure or credentials.

## 16. Ownership

Ownership

- Agent-owned: implementation, tests, report.
- Human-owned: storage provider account, bucket policy approval, retention policy.
- Shared: staging validation.

## 17. Rollback and remediation

Application rollback does not undo object writes, so deletes are soft by default until the retention rule says otherwise. If a bucket misconfiguration is found, correct the policy first, then rotate any signed URLs and assess exposure from provider access logs as a security incident.

## 18. Definition of done

- [ ] Approved scope implemented
- [ ] Every acceptance criterion recorded as Pass, Fail, or Not verified
- [ ] Required tests added or updated, including the negative cases above
- [ ] Required commands run and results reported
- [ ] Proof artifacts available and labeled by environment
- [ ] Security, authorization, privacy, and data handling reviewed
- [ ] Performance and cost expectations checked against the stated limits
- [ ] Rollback path documented and, where the risk level requires it, tested
- [ ] Known limitations and human owned follow ups documented
- [ ] Independent verification report produced by someone other than the implementer
- [ ] No unresolved critical or high severity issue
