# Functional verification — 19 November 2026

This audit checked the current working tree, including existing admin and concurrent mobile-interface changes. It does not certify a deployed site or live Shopify payments.

## Fixes from this audit

- Room schemes can be saved and reopened without requesting the retired `slat-panel-2400` demo product. They are quoted separately; the builder no longer displays unsupported demo price calculations.
- The bag's project-quote link prefills contact with the saved products, room descriptions and requested quantities.
- Missing product, project and guide records return HTTP 404. Product details are loaded on the server, so real product names and content appear in the initial HTML.
- Catalogue query changes use TanStack navigation, keeping the URL and router search state aligned.
- Persisted basket records are validated before rendering. Invalid names, currencies, prices, quantities and variant IDs are discarded. Batched additions respect the 30-line limit, and fractional quantities are rejected.
- Project stories retain a working catalogue link when their historical suggested-product handles no longer exist.
- Product imagery follows the selected available variant on first render and returns to the product photo when a variant has no dedicated image, rather than retaining the previous selection's photo.
- Lint and formatting exclude generated hosting output and local tooling. `npm test` now also runs the standalone CSV importer tests.

## Verification results

| Check                                   | Result                                                                                                |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `npx tsc --noEmit`                      | Passed                                                                                                |
| `npm test`                              | 54 Vitest tests across 12 files, plus 2 Node importer tests, passed                                   |
| `npm run build`                         | Passed with the default Cloudflare module target                                                      |
| Node production build                   | Passed with `NITRO_PRESET=node-server`; production browser tests used an isolated copy of this output |
| ESLint on changed/new source and config | Passed; existing Fast Refresh warnings remain                                                         |
| Whole-repository ESLint                 | 46 existing formatting errors in three untouched legacy files; see below                              |
| Product route coverage                  | All 79 imported product URLs returned 200 with product content in the server HTML                     |
| Primary remote product images           | All 79 URLs returned 200 with an image content type                                                   |
| Browser runtime                         | No uncaught runtime errors in the tested flows                                                        |

The importer tests also check all 1,186 CSV variants for minimum-price consistency, option membership and the safeguards that prevent snapshot IDs being used for purchases.

The first Node build and image checks encountered sandbox filesystem/network restrictions. They succeeded with the corresponding local build/read-only network access. No application workaround was added for those environment restrictions.

## Production browser flows exercised

- Catalogue loading, text search, empty state, reset, family filtering and sorting.
- Guide-to-builder presets; room, finish, backing and view controls; invalid-combination handling; save, quantity changes, persistence across reload and revisiting a saved room.
- Quote prefilling from the shortlist and from a product with its requested quantity; local contact-form preview.
- Imported product purchase protection, gallery enlargement and closing the image dialog.
- Real HTTP 404 responses and recovery UI for missing products, projects, guides and arbitrary routes.
- All three project stories' catalogue fallback links.
- Homepage finish selection, construction-layer exploration, surface/path comparison, pulse control and motion toggle, with normal and reduced-motion preferences.
- Storefront layout checks at 375, 768 and 1440 CSS pixels; mobile menu opening, Escape dismissal and restored focus.
- Production admin authentication with an ephemeral test identity: protected-route redirect, invalid credentials, valid session, product search/sort, CSV export, product inspection, all workspace tabs, responsive layouts at the same three widths, logout and denied access after logout.

The test admin identity was supplied only to the isolated test server. Existing local credentials were preserved. No checkout orders or enquiry messages were sent.

## Remaining limits

- Shopify is not connected to a verified live store in this audit. Checkout boundary/error handling is covered by automated tests, but real stock, shipping, tax, payment and order creation still require merchant configuration and an end-to-end store test.
- Contact remains an explicitly labelled preview with no delivery backend. Prefilling and reviewing an enquiry works; sending it to the team is not implemented.
- Room designs remain visual concepts with demonstration compatibility rules, not verified product mappings or acoustic specifications.
- Only the primary image for each product was checked remotely. Every gallery image, download and source-description media URL has not been verified.
- Whole-repository lint still reports Prettier errors in `src/components/site/Catalogue.tsx` (25), `src/data/products.ts` (18), and `src/lib/cart.tsx` (3). Repository instructions explicitly say to leave unrelated formatting changes alone. Changed/new source passes lint.
- Existing documentation from 18 November describing the room builder as disabled and quote selections as missing predates these fixes; this report supersedes those specific statements.

No commit, push, deployment, or published-history rewrite was performed.
