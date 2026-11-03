# Mandatory Unit Tests & Full Scenario Coverage

**No task is complete without unit and integration tests.** Production code and tests ship together in the same change.

## 5 Scenario Categories (Compulsory)
Every feature, fix, or refactor must cover:
1. **Happy path:** Valid coordinates, authentic keywords, valid login credentials.
2. **Invalid inputs:** Out-of-bounds coordinates, malformed phone strings, invalid role strings.
3. **Boundary values:** Indore bounding box limits (`[22.650000, 22.780000]` lat, `[75.800000, 75.930000]` lon), zero radius, 6-decimal-place float precision.
4. **Error paths:** 401 Unauthorized on admin routes, 404 NotFound on missing vendors, 400 ValidationError.
5. **Domain edge cases:** Phone masking for unconsented vendors, roaming vendor approximate locations, Devanagari Unicode search matching.

## Verification Gate
- `npm test --workspace=server` must pass with 0 failures before any pull request or deployment.
