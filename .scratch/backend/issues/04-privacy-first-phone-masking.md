# Ticket 04: Privacy-First Phone Masking Engine

## Goal
Protect informal street vendors from unsolicited harvesting by masking phone numbers when explicit consent is absent.

## Scope
- Schema field `hasConsentForPhone` (Boolean, default `false`).
- Public API masks phone numbers as `+91 98XXX-XX123` when `hasConsentForPhone = false`.
- Full E.164 phone numbers returned only when `hasConsentForPhone = true` or request originates from authenticated Admin.

## Acceptance Criteria
- [x] Unconsented vendors show masked strings in public responses.
- [x] Consented vendors expose full callable numbers for native `tel:` dialer.
- [x] Unit tests verify `maskPhoneNumber()` regex handling.
- [x] Meets PAC-05, PAC-13.
