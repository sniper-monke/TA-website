# Shopify technical map

Updated 18 November 2026. The frontend uses the real imported client CSV when both Shopify settings are empty. Its 79 products and 1,186 variants are a static snapshot with synthetic IDs and unknown stock, so they cannot be checked out. No live store connection or order has been verified. See the [documentation index](README.md), [Shopify/admin handoff](shopify-and-admin.md), [deployment/access guide](DEPLOYMENT_AND_ACCESS.md) and [current status](PROJECT_REFERENCE.md).

## Boundaries

- `src/lib/commerce.ts`: validated TanStack server functions.
- `src/lib/catalogue.server.ts`: live-versus-CSV selection, using the generated `src/data/shopify-products.json` snapshot when neither Shopify setting is supplied. The importer lives in `scripts/import-shopify-products.mjs`.
- `src/lib/shopify.server.ts`: private Storefront API requests, catalogue pagination, collection mapping, variant loading, published metafields and checkout creation. Private credentials stay in server requests.
- `src/reference/lib/api.tsx`: adapter preserving existing frontend consumers. Unconfigured means CSV; partial configuration or a configured-store failure reports an error instead of falling back to stale export prices. A product missing in live mode is not recovered from the CSV. Projects still use illustrative local records; enquiry POST is unimplemented.
- `src/components/experience/ProductExperience.tsx`: shared CSV/live presentation, actual option combinations, variant prices and imagery, quantity, availability, specifications, downloads and contextual enquiry links. The active product route delegates here; `StoreProductDetail.tsx` is an unused thin wrapper. `src/lib/product-presentation.ts` supplies generic product-family guidance without manufacturing acoustic measurements.
- `src/components/experience/ShoppingBagPage.tsx`: persistent frontend selection, product subtotals, custom rooms quoted separately, and checkout handoff. Checkout creates a Shopify cart from variant IDs and quantities; browser prices are never sent as authority. Warnings or incomplete quantities stop the handoff.

The local bag is a selection store, not a continuously synchronized Shopify cart. Stock, prices, taxes and shipping are confirmed in Shopify checkout. Customer accounts, discounts in the local bag, quote delivery, order history and checkout-return synchronization are not implemented.

The current shared browser catalogue query has a 30-second stale time. No background sync, webhook processor or local authoritative Shopify database is implemented. Imports of old demo JSON for TypeScript shapes do not restore a runtime demo-catalogue fallback.

## Metafields and source differences

The CSV importer uses existing export field names. The live adapter reads the set below; switching sources does not automatically migrate their definitions.

| Display area         | CSV custom key                                                               | Live Storefront custom key                        |
| -------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------- |
| Dimensions           | `sizes_and_configuration`                                                    | `dimensions` text                                 |
| Materials            | `materials_compatibility`                                                    | `material` text                                   |
| Installation         | `installation_instructions`                                                  | `installation` text                               |
| Other specifications | Product Information, Key Highlights, What's in the Box, Maintenance and Care | `specifications` JSON array of name/value records |
| Download links       | Empty array; no extraction from body HTML                                    | `downloads` JSON array of title/HTTPS-URL records |

Both sets use the `custom` namespace. Confirm or migrate approved values and expose the definitions to Storefront. Invalid live JSON/schema values result in empty specification/download arrays. Descriptions render as plain text; inline images/video, page-builder HTML and customization-app behavior are not automatically reproduced.

The live adapter uses a product's first returned collection as its primary family and all returned collection handles for filtering. Review collection ordering and family-specific guidance. The live query currently limits product images to 12 and omits SKU/compare-at values retained by the CSV; live SKU search is not implemented. No custom buyer-country/currency selector is implemented in this adapter.

## Checkout contract

Validated input is 1–30 lines of real Shopify ProductVariant GIDs with integer quantities from 1–99. Browser price values are not accepted as pricing authority. `cartCreate` errors, warnings, a missing cart or a quantity mismatch prevent redirect; the returned checkout URL must use HTTPS. Custom room schemes are not sent as standard product purchases. Test the real host's buyer-IP/proxy behavior and the merchant's actual payment/fulfillment flow.

## Connect when the store is available

1. Create a storefront in Shopify's Headless sales channel. Publish the intended products and collections to it and configure Storefront permissions for product listings, product metafields and checkout/cart operations.
2. Set `SHOPIFY_STORE_DOMAIN` to the permanent `your-shop.myshopify.com` domain and `SHOPIFY_STOREFRONT_PRIVATE_TOKEN` to its private **Storefront** token. Do not use an Admin API token or a `VITE_` prefix.
3. For local testing, merge the required settings into ignored `.env.local`, preserving existing admin settings. Use `.env.example` as a template only when creating a new file. Launch `npm run dev` (or explicitly `node --env-file=.env.local node_modules/vite/bin/vite.js dev`). Production values belong in hosting environment settings. The code does not modify Vite's plugin setup.
4. Align collection handles with navigation and acoustic-need links. Current inferred groups are `absorption`, `timberslat`, `bass-traps`, `diffusion`, `room-kits`, `racks-and-tables` and `accessories-and-materials`. Live collections replace those groups, but several navigation/guide links use fixed handles. Review `src/components/experience/SiteChrome.tsx`, `HomeExperience.tsx`, guide mappings and `src/data/site-content.ts` if real handles differ.
5. Optional product metafields in namespace `custom`: `dimensions`, `material`, `installation` (text); `specifications` (JSON array of `{ "name": "…", "value": "…" }`); `downloads` (JSON array of `{ "title": "…", "url": "https://…" }`). Grant Storefront access to these definitions. Use only verified figures/files. Product descriptions render as plain text.
6. Deploy behind a trusted proxy that supplies the buyer IP. The server forwards it via Shopify's required `Shopify-Storefront-Buyer-IP` header. Review proxy header handling for the chosen host.
7. Test real variants (including sold-out and unavailable combinations), catalogue filters, quantities, market currency, taxes/shipping, checkout failures, mobile behaviour and a test order before enabling purchases. Update the API version through routine maintenance; this adapter pins `2026-10`.

Shopify products and collections replace the CSV catalogue when configured. Project/guide sample product links and room-builder estimates require mapping to real products before a live launch. In particular, the room builder still requests `slat-panel-2400`, absent from the CSV, which prevents its current base-price/save path from working. Sample room estimates are never sent to checkout.

## References

- [Storefront authentication and buyer IP](https://shopify.dev/docs/api/storefront/latest#authentication)
- [Product queries](https://shopify.dev/docs/api/storefront/latest/queries/products)
- [Variant model](https://shopify.dev/docs/api/storefront/latest/objects/ProductVariant)
- [Cart creation and checkout URL](https://shopify.dev/docs/api/storefront/latest/mutations/cartCreate)

Automated integration tests use mocked Shopify responses. A live store connection and end-to-end payment flow remain unverified.
