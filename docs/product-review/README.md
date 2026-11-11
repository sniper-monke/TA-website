# Cleaner product-page reference pass — 11 November 2026

The detailed client reference is implemented with a calmer visual hierarchy: one primary purchase action, fewer badges and borders, and the supporting information grouped into clear sections.

## Structure and behaviour

- Gallery with desktop thumbnail rail, previous/next controls and an accessible image enlargement dialog.
- Product title, description, unit price, relevant options, quantity and Add to Bag. The same presentation supports preview products and future Shopify products.
- Three understated, product-family-appropriate benefits.
- Sticky section links for Overview, Acoustic Performance (Use & Fit for furniture), Specs & Installation, and FAQs.
- Overview with material/room imagery; family-specific performance guidance; scannable specifications; available downloads or a clear pending-document state; and three installation-planning steps.
- Four expandable FAQs, three compact related-product cards, and team/custom-quote actions.
- Room preview remains accessible from the overview, with supported finishes passed to the builder.
- Quote links prefill the contact form with product, options and quantity. Contact submission remains a design preview and sends nothing.

Reference photographs, prices and specifications remain clearly labelled as sample content. No acoustic curve is drawn without verified frequency data. The sample NRC value is identified as sample-only in specifications and is not turned into a performance claim. Diffusers and furniture do not receive an invented NRC rating. Technical documents, test curves, shipping promises and certifications are not fabricated.

## Screenshots

- [Full desktop product page](desktop-full.png)
- [Desktop gallery and purchase panel](desktop.png)
- [Image enlargement](gallery-zoom.png)
- [Mobile image enlargement](gallery-zoom-mobile.png)
- [Specifications and installation](specifications.png)
- [Full mobile product page](mobile-full.png)
- [Tablet](tablet.png), [mobile](mobile.png), [small mobile](small-mobile.png)

## Verification

All 13 tests pass, including three new interaction tests covering selected options and quantities, real variant price/image/ID mapping with simulated Shopify data, unavailable combinations, sold-out variants and basket quantity limits. TypeScript and changed-file lint pass, with the existing basket-context Fast Refresh warning.

Browser checks cover thumbnail changes, image enlargement/Escape on desktop and mobile, saving finish/size/quantity, persistent bag quantity, disabled preview checkout, quote-prefill values and expandable FAQs. Responsive review covers 1440, 768, 390 and 320px with no horizontal overflow or broken images observed. No runtime exceptions or console errors were observed. The production build passes separately from the local preview. Live Shopify access, payments and enquiry delivery remain untested and unconnected. No push or deployment was performed.
