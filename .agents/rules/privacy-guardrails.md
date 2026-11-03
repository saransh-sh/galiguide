# Informal Vendor Privacy & Ethical Data Guardrails

Strict privacy policies safeguarding informal street vendors in Indore.

## Rules
1. **Consent-Based Phone Exposure:**
   - When `hasConsentForPhone = false`, public APIs MUST mask the vendor phone number (`+91 98XXX-XX123`).
   - Only authenticated `ADMIN` and `SUPER_ADMIN` sessions can retrieve unmasked phone numbers for field coordination.
2. **Strict Non-Residential Mapping:**
   - Residential home addresses and private dwellings must NEVER be mapped or collected.
   - All coordinates must represent public sidewalk, chauraha, market, or cart vending spots.
3. **Sensitive Data Redaction:**
   - Database connection passwords, JWT secrets, and auth tokens must be redacted from server console logs (`redactSensitiveData()`).
4. **Immediate De-Listing:**
   - Any vendor request to deactivate or remove a listing must be supported immediately by setting `isVerified: false` or deleting the record via the admin portal.
