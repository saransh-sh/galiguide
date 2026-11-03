# Ticket 05: Admin Authentication & RBAC Guardrails

## Goal
Secure admin endpoints (`/api/admin/*`) with JWT bearer authentication and role checks.

## Scope
- Endpoint `POST /api/admin/auth/login` validating email + password via bcrypt.
- Signed JWT token returning user role (`ADMIN` or `SUPER_ADMIN`).
- Middleware `requireAuth` verifying bearer token and rejecting unauthorized requests with 401.
- Role checks for privileged actions.

## Acceptance Criteria
- [x] Unauthenticated calls to `/api/admin/vendors` reject with 401.
- [x] Valid login returns JWT token and user profile.
- [x] Meets PAC-07.
