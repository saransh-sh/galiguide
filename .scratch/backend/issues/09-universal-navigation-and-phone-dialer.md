# Ticket 09: Universal Google Maps Navigation Handoff

## Goal
Enable turn-by-turn routing directly from vendor cards without incurring Google Directions API fees.

## Scope
- Implement "Get Directions" action generating:
  `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
- Target `_blank` with `rel="noopener noreferrer"`.
- On mobile devices, this URL natively deep-links into the Google Maps app.
- Provide direct `tel:${phone}` dialer anchors for consented vendors.

## Acceptance Criteria
- [x] Generated URL follows the universal format verified in unit tests.
- [x] Dial action launches phone dialer for consented vendors.
- [x] Meets PAC-05 and PAC-06.
