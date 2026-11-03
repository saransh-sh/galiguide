# ADR 0004: Privacy-First Phone Masking for Informal Vendors

## Context
Many informal street vendors are vulnerable to unsolicited commercial calls, spam, and predatory lending when their personal mobile numbers are published openly online.

## Decision
All vendor records include a boolean flag `hasConsentForPhone`. When `hasConsentForPhone` is `false`, public explorer endpoints mask the phone number as `+91 98XXX-XX123` (displaying only the last 3 digits). Full numbers are restricted to authenticated Municipal Ward Admins.

## Rationale
1. **Vendor Protection:** Respects vendor privacy and prevents automated harvesting of personal contact info.
2. **Regulatory Compliance:** Aligns with Indian Digital Personal Data Protection (DPDP) principles for consent-based publication.
3. **Admin Traceability:** Verified municipal ward leads can still contact vendors for administrative or health audit purposes.

## Consequences
- **Positive:** Protects vendors from harassment and data scraping.
- **Negative:** Public users cannot call unconsented vendors directly (mitigated by showing landmark guidance and operating hours).
