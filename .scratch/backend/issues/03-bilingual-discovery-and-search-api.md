# Ticket 03: Bilingual Search & Discovery API

## Goal
Provide sub-50ms search matching English keywords ("Dahi", "Hot Dog") and Devanagari Hindi ("दही", "मोची", "चाट").

## Scope
- Multi-field substring search across `name`, `hindiName`, `description`, `popularItems`, `category.name`, and `category.hindiName`.
- Category filtering by slug.
- Area / municipal ward filtering.
- Pagination metadata (`total`, `page`, `limit`, `totalPages`, `hasMore`).

## Acceptance Criteria
- [x] Query `q=Dahi` matches Johny Hot Dog and Dahi Vada vendors.
- [x] Query `q=मोची` matches cobbler repair setups in Devanagari script.
- [x] Pagination headers return accurate counts.
- [x] Meets PAC-01, PAC-02, PAC-11.
