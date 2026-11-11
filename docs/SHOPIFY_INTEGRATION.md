# Shopify connection prepared for later

The frontend works with the existing sample catalogue when both Shopify environment variables are empty. This is the intended current configuration. Samples cannot be checked out. No store or order has been created.

## Boundaries

- `src/lib/commerce.ts`: validated TanStack server functions.
- `src/lib/shopify.server.ts`: private Storefront API requests, catalogue pagination, collection mapping, variant loading, published metafields and checkout creation. Private credentials stay in server requests.
- `src/reference/lib/api.tsx`: adapter preserving existing frontend consumers. Unconfigured means preview; a configured-store failure reports an error instead of falling back to sample products.
- `src/components/experience/ProductExperience.tsx`: shared preview/live presentation, actual option combinations, variant prices and imagery, quantity, availability, specifications, downloads and contextual enquiry links. `StoreProductDetail.tsx` delegates to this shared layout. `src/lib/product-presentation.ts` supplies product-family guidance without manufacturing acoustic measurements.
- `src/components/experience/ShoppingBagPage.tsx`: persistent frontend selection, product subtotals, custom rooms quoted separately, and checkout handoff. Checkout creates a Shopify cart from variant IDs and quantities; browser prices are never sent as authority. Warnings or incomplete quantities stop the handoff.

The local bag is a selection store, not a continuously synchronized Shopify cart. Stock, prices, taxes and shipping are confirmed in Shopify checkout. Customer accounts, discounts in the local bag, quote delivery, order history and checkout-return synchronization are not implemented.

## Connect when the store is available

1. Create a storefront in Shopify's Headless sales channel. Publish the intended products and collections to it and configure Storefront permissions for product listings, product metafields and checkout/cart operations.
2. Set `SHOPIFY_STORE_DOMAIN` to the permanent `your-shop.myshopify.com` domain and `SHOPIFY_STOREFRONT_PRIVATE_TOKEN` to its private **Storefront** token. Do not use an Admin API token or a `VITE_` prefix.
3. For local testing, copy `.env.example` to ignored `.env.local`, populate it privately and launch `node --env-file=.env.local node_modules/vite/bin/vite.js dev`. Production values belong in hosting runtime environment settings. The code does not modify Vite's plugin setup.
4. Align collection handles with navigation and acoustic-need links. Preview category defaults are `absorption`, `timberslat`, `bass-traps`, `diffusion`, `room-kits`, and `racks-and-tables`. Real collections populate the product menu and family grid. Adjust the acoustic-need mappings in `src/data/site-content.ts` and principle links if real handles differ.
5. Optional product metafields in namespace `custom`: `dimensions`, `material`, `installation` (text); `specifications` (JSON array of `{ "name": "…", "value": "…" }`); `downloads` (JSON array of `{ "title": "…", "url": "https://…" }`). Grant Storefront access to these definitions. Use only verified figures/files. Product descriptions render as plain text.
6. Deploy behind a trusted proxy that supplies the buyer IP. The server forwards it via Shopify's required `Shopify-Storefront-Buyer-IP` header. Review proxy header handling for the chosen host.
7. Test real variants (including sold-out and unavailable combinations), catalogue filters, quantities, market currency, taxes/shipping, checkout failures, mobile behaviour and a test order before enabling purchases. Update the API version through routine maintenance; this adapter pins `2026-10`.

Shopify products and collections replace the sample catalogue when configured. Project/guide sample product links and room-builder estimates require mapping to real products before a live launch. Sample room estimates are never sent to checkout.

## References

- [Storefront authentication and buyer IP](https://shopify.dev/docs/api/storefront/latest#authentication)
- [Product queries](https://shopify.dev/docs/api/storefront/latest/queries/products)
- [Variant model](https://shopify.dev/docs/api/storefront/latest/objects/ProductVariant)
- [Cart creation and checkout URL](https://shopify.dev/docs/api/storefront/latest/mutations/cartCreate)

Automated integration tests use mocked Shopify responses. A live store connection and end-to-end payment flow remain unverified.
