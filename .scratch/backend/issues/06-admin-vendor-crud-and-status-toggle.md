# Ticket 06: Admin Vendor Management & Audit Log

## Goal
Enable Municipal Ward Leads to create, update, verify, and archive vendor listings with audit trails.

## Scope
- Full CRUD: `POST /api/admin/vendors`, `PUT /api/admin/vendors/:id`, `DELETE /api/admin/vendors/:id`.
- Status toggle: `PATCH /api/admin/vendors/:id/status` with `verificationReason` and `isVerified` flag.
- Audit log persistence capturing `action`, `entityId`, `userId`, `details`.

## Acceptance Criteria
- [x] End-to-end CRUD cycle completes successfully.
- [x] Status toggle updates verification status and logs audit entry.
- [x] Meets PAC-08, PAC-10.
