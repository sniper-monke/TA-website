# Frontend client pass — 10 November 2026

Historical review of the first pass. The current homepage follows the subsequently approved wireframe; see [the 11 November layout review](../wireframe-review/README.md).

This pass follows the client’s newer Word document and the user’s corrections: warmer and calmer around the retained alcove, with acoustic products and acoustic needs clearly foregrounded. See [confirmed decisions](../CLIENT_BRIEF.md) and [future Shopify setup](../SHOPIFY_INTEGRATION.md).

## Visual review

- [Desktop homepage](desktop.png)
- [Product mega menu](menu.png)
- [Acoustic principles](acoustics.png)
- [Featured illustrative space](featured.png)
- [Mobile homepage](mobile.png)
- [Mobile shopping bag](mobile-bag.png)
- [Small mobile homepage](small-mobile.png)
- [Tablet homepage](tablet.png)

The desktop renders the actual Three.js alcove. On small screens, the existing SVG illustration retains finish and build controls while the hero avoids loading Three.js. Decorative contours are static on small screens. Room photos and catalogue data remain explicitly illustrative.

## Checks

- Production build and strict TypeScript check passed.
- All 10 automated tests passed, including six mocked Shopify boundary tests. No live Shopify account or checkout/payment was tested.
- Changed-source ESLint passed with one existing Fast Refresh warning in the basket context. Repository-wide lint cannot traverse the unrelated protected `tmp/pets` tools directory; a source-only scan also encounters existing formatting errors in untouched files.
- Browser-reviewed desktop at 1440px, tablet at 768px, mobile at 390px, and small mobile at 320px; no horizontal overflow was observed. Desktop WebGL and the mobile SVG fallback both worked. The mobile homepage made no Three.js resource request and had no broken images.
- Checked product menu opening and Escape, acoustic tabs, category filtering, adding products, persistent quantities after navigation, preview checkout disabled, and custom room schemes appearing as “By quotation.” No runtime exceptions or console errors were observed in that interaction pass.

Walnut finish selection was verified through persistent bag data after React updated. Screenshots show the design preview, not production installations or purchasable inventory. Performance on representative physical devices remains to be measured.

No publishing, remote push or git history rewrite was performed.
