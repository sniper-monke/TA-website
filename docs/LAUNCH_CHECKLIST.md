# Remaining work, launch checks and client handoff

Updated 18 November 2026. Check boxes represent work still needing completion/evidence, even when supporting code is present. Refer to [current status](PROJECT_REFERENCE.md), [Shopify/admin details](shopify-and-admin.md), [deployment guide](DEPLOYMENT_AND_ACCESS.md) and the [complete content/media audit](placeholder-content-audit.md).

## 1. Obtain access and business decisions

- [ ] Confirm the permanent `*.myshopify.com` domain, existing public domain and intended new public domain.
- [ ] Receive an individual client-approved staff/collaborator invitation with the permissions needed for products/collections and Apps/channels setup.
- [ ] Create/identify the intended Headless storefront and obtain its private Storefront token through an appropriate secret channel.
- [ ] Publish intended products/collections to that storefront and expose required metafields.
- [ ] Confirm store currency; INR currently labels the CSV prices by assumption.
- [ ] Confirm real collection handles, product grouping, display order, featured products and custom-quote-only items.
- [ ] Confirm whether Item Customizations and Lavalier microphone microphone belong in the public catalogue.
- [ ] List option/customization, review, bundle and subscription apps whose behavior must carry over; scope their integrations separately from CSV import.
- [ ] Confirm markets, shipping zones/rates, taxes, stock policy, locations, payment methods, COD and gift-card/discount expectations.
- [ ] Confirm whether customer login/order history is required; plan Customer Account API work if it is.
- [ ] Obtain Vercel project/team and DNS/domain access; agree cutover/rollback ownership and whether this replaces or coexists with the current storefront.

Shopify's official setup covers Headless creation and permissions; select the appropriate operations for the actual integration rather than treating a copied scope list as a substitute for testing. [Storefront setup](https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/getting-started), [Headless permissions/publication management](https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/manage-headless-channels).

## 2. Configure and verify production access

- [ ] Resolve the reported Vercel admin-settings error with `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` and `ADMIN_SESSION_SECRET` in the correct environments, then redeploy.
- [ ] Set a client-owned production identity/password and store the credential securely.
- [ ] Verify sign-in, protected-route rejection, refresh, sign-out and session invalidation after deliberate rotation on the actual deployed domain.
- [ ] Configure host-level rate limiting across instances; confirm HTTPS/session-cookie behavior.
- [ ] Set `SHOPIFY_STORE_DOMAIN` and `SHOPIFY_STOREFRONT_PRIVATE_TOKEN`, redeploy and verify a successful live catalogue query in the admin.
- [ ] Confirm no private token/hash/session value appears in client assets or shared documentation.

## 3. Complete catalogue and technical information

- [ ] Verify live product/variant count against intended channel publication and compare representative imported/live prices.
- [ ] Confirm actual currencies/markets rather than assuming the CSV currency.
- [ ] Map the seven inferred families to approved Shopify collections and align menu, guide and acoustic-need links.
- [ ] Map the CSV's custom sizes/material/installation fields to the live adapter's different field names or update the adapter intentionally.
- [ ] Fill missing normalized fields: 62 dimension, 56 material and 56 installation gaps; inspect descriptions/options before requesting duplicate content.
- [ ] Supply the full Pinewood TimberSlat Panels body description.
- [ ] Link verified product sheets, installation/assembly documents, acoustic test reports, load ratings and drawings as relevant; all current imported downloads are empty.
- [ ] Review generic benefit/performance/FAQ/installation text for each product family, especially accessories using the default absorption template.
- [ ] Confirm custom-size/finish service promises and quotation-only exceptions with the client.

The existing admin exports/inspector support this review. Its field-complete flag is not a verification or approval certificate.

## 4. Replace or approve draft content and media

- [ ] Replace the three illustrative projects with authentic case studies, correct dimensions/locations, permissions, real installed products and evidenced outcomes.
- [ ] Supply approved company history and workshop/staff photographs; confirm or replace the offcuts story and handmade/material claims.
- [ ] Supply approved client names/logos for all five trust slots, or intentionally reduce/remove the strip.
- [ ] Review the 32 reference photos; 15 have active usage and 17 are legacy-only.
- [ ] Review all imported gallery URLs, collection-cover choices, descriptive alt text and image order using [media-content-audit.csv](media-content-audit.csv).
- [ ] Associate dedicated images for the five listed variants if needed; their product galleries already exist.
- [ ] Decide whether to restore the 139 source-only embedded image URLs and single MP4 from product-description HTML.
- [ ] Approve the alcove/room/finish diagrams as concept illustrations, or supply accurate models/material samples if stronger product fidelity is required.
- [ ] Confirm wordmark/favicon variants and provide final social-share media.
- [ ] Decide whether the brand book and short website brief should remain under publicly served `public/images/`.
- [ ] Update stale Sample catalogue/footer and any temporary export/connection messages only when their replacement state is true.

The audit distinguishes imported client media, reference/demo imagery, generated decoration and historical screenshots; it does not classify every image as a fake photograph.

## 5. Repair the room-builder and enquiry journey

- [ ] Replace the missing `slat-panel-2400` lookup with an approved actual product/configuration model.
- [ ] Replace prototype finish/module surcharges, coverage presets and compatibility rules with confirmed product/project rules.
- [ ] Decide whether builder schemes need a quote-only estimate or real variant/bundle mapping; do not send conceptual panel pricing to checkout.
- [ ] Restore a working Save room for a quote path and include complete scheme/quantity/options in the eventual enquiry payload.
- [ ] Replace old project-product handles with real approved associations; review guide presets and unused fixture references.
- [ ] Implement server-side enquiry validation, delivery/storage, spam controls and clear error/receipt behavior.
- [ ] Preserve product name/options/quantity and room scheme details throughout the quote journey; verify the team actually receives them.
- [ ] Confirm the recipient email/service, outbound sender, response expectations and any consultation scheduling workflow.

## 6. Final business content and commerce validation

- [ ] Obtain and publish approved shipping, returns/refunds, privacy and terms content.
- [ ] Add approved support email, telephone/address/hours/social links as required.
- [ ] Confirm analytics/consent requirements and implementation.
- [ ] Verify product selection, images, quantities, unavailable combinations and sold-out variants on desktop/mobile.
- [ ] Confirm checkout pricing/discounts, shipping zones/rates, taxes and payment methods against the merchant's settings.
- [ ] Use an agreed test-order method; confirm order creation, Headless-channel attribution, customer/team notifications and fulfillment handling.
- [ ] Verify a cancellation/refund flow with the merchant and the intended checkout return path.
- [ ] Confirm custom rooms are quoted separately and are not silently included as purchasable standard products.
- [ ] Check deployed admin, forms, error pages, redirects, social metadata, keyboard use, reduced motion and representative device performance.
- [ ] Run appropriate local checks, record the tested revision and deploy it; keep rollback and owner responsibilities clear.

## Suggested implementation order

1. Production admin configuration and client Shopify access.
2. Successful live catalogue/publication/collection/metafield mapping.
3. Product content/media review and authentic projects/brand copy.
4. Enquiry delivery and room-builder mapping/pricing repair.
5. Policies, checkout/order validation, deployment QA and domain cutover.

An expanded writable admin is an optional separately scoped phase. Product/order/customer mutations require appropriate server-side Admin API authorization and permission design; existing links to Shopify admin do not implement those features inside this site.

## Reusable request to the client

> To finish connecting the new Timber Acoustics website, please provide the permanent Shopify store domain and an individual staff/collaborator invitation for setup. We also need the intended Headless storefront/private Storefront API token through a secure channel, publication of the intended products/collections, and confirmation of currency, collections, markets, shipping, taxes, payments and stock rules.
>
> Please identify any existing customization, reviews, bundles or subscription apps that must continue working. Confirm whether customer login/order history is part of this launch and whether this site replaces the existing storefront.
>
> For content, please send approved company copy, real installation case studies and photos, workshop/material images, client logos with permission, current product specifications and technical/installation documents. Please review the supplied placeholder and media inventories and confirm which reference assets can remain.
>
> We also need approved policies/support details, the enquiry recipient/email service, Vercel/DNS access, the launch date and an agreed test-order/fulfillment process. Please grant individual access rather than sharing the owner password or 2FA codes.

This is a draft request for the project owner to send; no message has been sent to the client by this documentation task.
