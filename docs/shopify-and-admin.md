# Shopify connection and team workspace

## What is implemented

The customer catalogue now reads `src/data/shopify-products.json`, generated from
`docs/products_export_1 (1).csv`: 2,045 records, 79 published active products,
1,186 variants, and 1,946 image references. Handles (including Unicode), names,
descriptions, option combinations, SKU values, variant prices, compare-at prices,
gallery order, variant image URLs, tags, vendor and SEO fields are retained.
HTML descriptions are converted to plain text and displayed as text, never injected HTML.
Original metafield and app data remains in the source CSV; supported specification
fields are mapped, but app-specific behavior is not recreated by importing its data.

The export has **no live stock, Shopify product/variant IDs, currency field, or
collection membership**. INR is assumed; the seven display groups are inferred
from titles and tags, not Shopify collections. Confirm these with the client.
Imported variants cannot be purchased and are not described as sold out. Images
use the exported CDN URLs; files are not copied into this repository.

Reimport with `npm run products:import`. An alternate input/currency can be supplied:

```powershell
npm run products:import -- "docs/products_export_1 (1).csv" INR
node --test scripts/import-shopify-products.test.mjs
```

Only active, published products are included. Malformed CSV, missing required
columns, invalid variant prices and non-HTTPS image URLs fail the import. Import
does not create or update anything in the client's Shopify store.

## Ask the client for

1. **Permanent store domain**: `example.myshopify.com`, plus the current public domain.
2. **An individual collaborator/staff invitation**, with product/collection and
   Apps and channels access needed to configure Headless. The merchant approves
   permissions. Use your own Shopify account rather than their owner password or 2FA.
3. **Headless channel storefront and private Storefront API token**. Enable product
   and collection read access, variant availability and cart/checkout access
   (`unauthenticated_read_product_listings`, `unauthenticated_read_checkouts`,
   `unauthenticated_write_checkouts` as applicable to the channel's settings).
   Publish the intended products and collections to this storefront's channel.
   Make the required custom metafields accessible to the Storefront API.
4. **Business confirmation**: store currency, target countries/markets, tax display,
   shipping zones and rates, stock policies, locations, payment gateways, COD,
   discount behavior and whether existing gift cards must work.
5. **Product content decisions**: actual collections and ordering, featured products,
   which products require custom quotations, current option/customisation apps,
   reviews, bundles and subscriptions. App data in a CSV does not recreate an app's
   pricing logic or integration. Confirm the exported catalogue is current.
6. **Hosting and launch access**: server secret management, the existing deployment
   platform/project, public domain and DNS access, and the intended cutover date.
   This is a headless storefront using the existing Shopify backend, not a Liquid
   theme upload. Confirm whether it replaces or coexists with the existing site.
7. **Customer accounts**: whether login, order history and account migration are
   required. Those need separate Customer Account API configuration, application
   client ID and callback/logout URLs; this project has no customer login flow yet.
8. **Enquiries and policies**: recipient address plus email provider credentials if
   enquiry delivery is required; approved shipping, returns, privacy and terms copy;
   analytics/consent requirements. Enquiries currently send nothing.
9. **Test order approval**: an agreed payment test method and fulfilment process.
   Verify stock, variant selection, taxes, shipping, discounts, payment, notifications,
   order attribution, refunds and mobile checkout before launch.

The present storefront needs **no Admin API token, Shopify owner password, payment
gateway secret or credit-card handling**. Shopify hosts checkout. If in-site editing,
orders or customer management is commissioned later, define its exact operations,
then configure an Admin API app with minimal required scopes and server-side OAuth
and token handling. Do not substitute an Admin token for the Storefront token.

Official references:

- [Headless Storefront API setup](https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/getting-started)
- [Headless channel permissions and token rotation](https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/manage-headless-channels)
- [API scopes](https://shopify.dev/docs/api/usage/access-scopes)
- [Collaborator access](https://help.shopify.com/en/partners/manage-clients-stores/client-transfer-stores)

## Configure Shopify

Use ignored `.env.local` for development and the hosting platform's server secrets
for production. Transfer private tokens through a password manager or host secret
UI; do not commit them or prefix them with `VITE_`.

```dotenv
SHOPIFY_STORE_DOMAIN=example.myshopify.com
SHOPIFY_STOREFRONT_PRIVATE_TOKEN=your-private-storefront-token
```

Restart the server. Sign into `/admin/login`, open Connection and click Refresh.
The current adapter uses Storefront API `2026-10`. A successful live query replaces
the imported products and inferred collections. Partial configuration or API errors
are surfaced; the site does not silently fall back to stale CSV prices after a
configured store fails. Confirm channel publication if live results are empty.

The server fetches catalogue and product pages, including all pages of variants,
and creates a Shopify cart when a bag containing live variant IDs proceeds to checkout.
Shopify determines checkout pricing, inventory, delivery, taxes and payment.
No background sync, webhooks or local Shopify database exists. Live catalogue reads
are briefly cached in the browser; Refresh in the workspace requests fresh data.

The current live content adapter supports `custom.dimensions`, `custom.material`,
`custom.installation`, `custom.specifications` (JSON name/value array), and
`custom.downloads` (JSON title/HTTPS-URL array). Confirm or migrate existing metafield
definitions; Shopify page-builder HTML and option apps are not automatically rendered.

## Admin access and credentials

Previously `/admin/login` was a visual mockup and `/admin` redirected there. No
working account existed. A local account has now been generated; its password is
provided in the task handoff. Only the hash and session secret are saved in ignored
`.env.local`. These credentials are for **this workspace**, not Shopify admin.
The client must invite your own account to Shopify; local code cannot create a
Shopify owner/staff account without store access.

```powershell
npm run admin:setup
# Existing accounts are preserved unless rotation is requested:
npm run admin:setup -- --rotate --email=team@example.com
```

Save the generated password when it is printed; it cannot be recovered from the
hash. Rotation replaces the account and session secret and invalidates existing
sessions after restart. There is one server-configured account, with no password
reset email, multi-user roles, audit log or MFA. Set `ADMIN_EMAIL`,
`ADMIN_PASSWORD_HASH` and `ADMIN_SESSION_SECRET` as production server secrets before
deploying. Use a separate account/password for production.

Passwords use PBKDF2-SHA256 with a random salt and 600,000 iterations. Sessions are
sealed, HTTP-only, SameSite=Strict, secure in production and expire after eight hours.
Credential rotation invalidates sessions. TanStack CSRF protection remains enabled.
Protected functions check the server session, not just the page guard; responses
use no-store. Sign-in is limited to ten attempts per minute per running process.
Before public production use, configure host-level rate limiting across instances;
the process limit is not shared between workers. HTTPS is required in production.

## Every workspace screen

The interface keeps four tabs and a product inspector; it does not hide unimplemented
features behind editable controls.

| Area              | Available behavior                                                                                                                                                                                                                                                                                                          |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Header            | Refresh catalogue/connection state; sign out and clear the session and admin query cache.                                                                                                                                                                                                                                   |
| Status strip      | Shows CSV mode, successful live query, or connection failure. It never reveals tokens.                                                                                                                                                                                                                                      |
| Overview totals   | Current visible product/collection counts; explicitly labelled export variant/image counts. Export totals remain historical after live connection.                                                                                                                                                                          |
| Next steps        | Import provenance, currency and collection confirmation, connection and test-order tasks.                                                                                                                                                                                                                                   |
| Catalogue health  | Counts missing dimensions, material, installation and product image fields. A missing dedicated field may still be described in body copy; verify rather than assuming it is absent everywhere.                                                                                                                             |
| Store operations  | Links to Shopify products/inventory, orders/fulfilment, customers, discounts, analytics and settings once the domain is configured. Shopify login and permissions are separate. These are links, not embedded management modules.                                                                                           |
| Products          | Search product name, handle or exported SKU; collection filter, price/name sort, needs-review toggle, 15-per-page pagination and filtered summary CSV export. Live SKU search is not yet supplied by the listing query.                                                                                                     |
| Product inspector | Product name, complete plain-text description, gallery links, handle, dimensions, material, installation, every variant combination, SKU where supplied, prices and stock status. CSV stock is labelled unknown. Open the public page or download the full product JSON, including retained compare-at prices and metadata. |
| Media & quality   | Paginated image cards, image reference counts, missing-field labels; shares filters and opens the same inspector. This does not test CDN reachability, upload assets or edit alt text.                                                                                                                                      |
| Connection        | Store domain, whether a token is set (never its value), actual catalogue query outcome, server environment setup and client handoff checklist.                                                                                                                                                                              |
| Login             | Working email/password sign-in, loading and error states. Other `/admin/*` URLs continue to return to login; the workspace lives at `/admin`.                                                                                                                                                                               |

CSV downloads are review summaries, not Shopify reimport files. Exports quote values
and neutralise formula-leading characters for spreadsheets. Product JSON is a snapshot.
No local edits, bulk price changes, inventory writes, orders, refunds, customer records,
discount creation or email delivery are implemented. Those operations currently belong
in Shopify admin, where they remain the source of truth. The room configurator,
project examples and unrelated prototype content remain illustrative.

## Validation and remaining launch work

Run `node --test scripts/import-shopify-products.test.mjs`, `npx tsc --noEmit`,
`npm test`, and `npm run build`. Format/lint only changed files because the repository
has existing unrelated formatting violations. Integration tests cover CSV import and
fallback boundaries, password verification, unauthenticated access denial, session
creation/rotation/logout, and the existing live Shopify cart adapter.

Actual store authentication, live prices/stock, payment and order creation require
client access and must be verified against the real store. No push or deployment
is performed as part of this local repository implementation.
