# Project overview and current status

Snapshot: 18 November 2026. See the [documentation index](README.md) for setup, client requirements and detailed audits.

## What this project is

Timber Acoustics has a React storefront/marketing frontend intended to use the client's existing Shopify store for commerce. This is a headless frontend rather than a Shopify Liquid theme. The desired business flow is standard products purchased through Shopify checkout, with custom rooms/projects handled by quotation.

The client direction calls for a warm, material-led presentation that clearly communicates acoustic treatment. Retain the interactive listening alcove; preserve the supplied brand system and approved homepage order. Use the newer supplied website document over the earlier short brief and the secondhand AI/WhatsApp synthesis when they conflict. Detailed design decisions live in [CLIENT_BRIEF.md](CLIENT_BRIEF.md).

## Current completion map

| Area         | Implemented                                                                                                                    | Still needed / unverified                                                                                                    |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| Catalogue    | Real client CSV import, product listings/details, variants/options, gallery references, prices, basic supported specifications | Live-store connection, currency/collections confirmation, current inventory and real variant IDs                             |
| Commerce     | Private server-side Shopify adapter; variant loading; cart creation and hosted-checkout redirect                               | Client credentials/publication; end-to-end pricing, stock, shipping, tax, payment and order tests                            |
| Bag          | Browser-persisted product selections and room-shortlist support; preview protection                                            | Continuous Shopify-cart sync, account sync, checkout-return sync and enquiry submission                                      |
| Admin        | Working password/session backend and four-tab read-only catalogue workspace                                                    | Production environment setup; client-owned production account; host-wide rate limit; any commissioned write/admin operations |
| Homepage     | Approved structure, interactive alcove, collection links, project/space blocks                                                 | Approved client logos, authentic projects/media and copy sign-off                                                            |
| Contact      | Form and contextual product/option/quantity prefilling                                                                         | Delivery/storage backend; team receipt; confirmations and spam handling                                                      |
| Room builder | Interactive concept options and room/finish drawing                                                                            | Real product mapping, verified option rules/pricing, working save path and quote transmission                                |
| Content      | Complete placeholder audit and individual media inventory                                                                      | Final story, case studies, product documents, policies and approved media                                                    |
| Hosting      | Vercel project configuration committed; user reports a Vercel deployment                                                       | Production environment verification, working admin login, live-store smoke tests and final domain/DNS cutover                |

## Technology and important boundaries

- Single npm package: TanStack Start, React 19, TanStack Router/Query, Tailwind v4, shadcn/Radix UI, Framer Motion, Three.js and Nitro.
- Use npm locally. `package-lock.json` and `bun.lock` both exist; the Bun lock/config has Lovable-specific behavior. Do not change Bun's release-age exceptions without the confirmation required by repository instructions.
- File routes live in `src/routes/`; current site components are largely under `src/components/experience/` and adapted `src/reference/` modules.
- `src/components/site/` and several `src/data/*.ts` files retain older demos. The audit distinguishes these from active route dependencies.
- `src/routeTree.gen.ts` is generated. Do not hand-edit it or add Next.js-style route/layout directories.
- `vite.config.ts` uses `@lovable.dev/vite-tanstack-config`, which already supplies the core plugins, aliases and React dedupe. Duplicate plugins break the app.
- Preserve `src/server.ts` and its HTML-error fallback, `src/start.ts` and its CSRF middleware, and root `<Outlet />` rendering.
- Keep browser/WebGL work out of SSR. The active alcove has an SVG fallback; desktop WebGL loads behind browser/device/reduced-motion checks.
- TypeScript is strict, including `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes` and `noPropertyAccessFromIndexSignature`.
- The local standalone build defaults through the wrapper to a Cloudflare/Nitro output. `vercel.json` configures the TanStack Start framework with `npm ci` and `npm run build`; a local build alone does not verify a particular Vercel runtime deployment.

## Active page map

| URL                               | Main implementation / behavior                                                              |
| --------------------------------- | ------------------------------------------------------------------------------------------- |
| `/`                               | `components/experience/HomeExperience.tsx`; kinetic hero/alcove and approved section layout |
| `/products`                       | `reference/pages/Products.tsx`; search, family and price filters, sorting                   |
| `/products/:slug`                 | `reference/pages/ProductDetail.tsx` with shared `ProductExperience.tsx`                     |
| `/collections/:family`            | Redirects to `/products?family=...`                                                         |
| `/projects` and `/projects/:slug` | `reference/pages/Projects.tsx`; three illustrative project records                          |
| `/guides` and `/guides/:slug`     | `reference/pages/Guides.tsx`; home-theatre, studio and office guides                        |
| `/story`                          | `reference/pages/Story.tsx`; draft story and reference photography                          |
| `/build-a-room`                   | `reference/pages/Configurator.tsx`; concept room builder                                    |
| `/configurator`                   | Redirects to `/build-a-room`                                                                |
| `/basket`                         | `components/experience/ShoppingBagPage.tsx`; current bag, not the old reference Basket page |
| `/contact`                        | Local preview form; no delivery                                                             |
| `/admin/login`                    | Working server-authenticated team sign-in                                                   |
| `/admin`                          | Protected read-only workspace; other `/admin/*` paths return to login                       |

The shared header/footer comes from `components/experience/SiteChrome.tsx`. The current bag uses `reference/context/BasketContext.tsx` and localStorage key `timber-enquiry-basket-v1`; the old in-memory `lib/cart.tsx` provider is still mounted but is not the active storefront bag UI.

## Catalogue provenance and exact snapshot

Source CSV: `docs/products_export_1 (1).csv`. Importer: `scripts/import-shopify-products.mjs`. Generated data: `src/data/shopify-products.json`.

| Quantity                                       | Snapshot |
| ---------------------------------------------- | -------- |
| CSV records                                    | 2,045    |
| Published active products                      | 79       |
| Variants                                       | 1,186    |
| Gallery image placements                       | 1,946    |
| Products excluded by publication/status filter | 0        |
| Assumed currency                               | INR      |

Names, handles, option combinations, numeric prices, SKUs, compare-at values, galleries, variant image references, tags, vendor, SEO and selected custom metafields came from the export. Body HTML is converted to safe plain text. Full original HTML/app/metafield data stays in the CSV; importing it does not recreate custom-option apps, subscriptions, reviews or bundles.

The CSV does not supply currency, live stock, Shopify product/variant IDs or collection membership. All imported variant IDs are synthetic `csv:...` values, and checkout is disabled for them. `availableForSale: false` is a guard against purchasing from a snapshot, not a statement the product is sold out.

Seven inferred display families currently contain 41 Absorption Panels, 1 TimberSlat, 8 Bass Traps, 6 Diffusion, 5 Room Kits, 12 Racks & Tables and 6 Accessories & Materials products. These must be mapped to actual client collections. Navigation also assumes specific family handles.

Reimport:

```powershell
npm run products:import
# Optional alternate file and confirmed currency:
npm run products:import -- "docs/products_export_1 (1).csv" INR
```

Importing changes local generated catalogue data; it does not create/update products in Shopify.

## Data selection and purchase behavior

`lib/commerce.ts` server functions call `lib/catalogue.server.ts`, which uses `lib/shopify.server.ts` when configured. With neither Shopify setting supplied, it serves the imported CSV. Partial/malformed settings or configured API failures surface errors rather than silently reverting to CSV prices.

Live Shopify success replaces the CSV products and inferred families. It is not a combined catalogue. The adapter queries Storefront API `2026-10`, paginates products/variants and reads the supported `custom` metafields. Browser catalogue queries have a short cache; no webhook sync, background importer or local Shopify database is implemented.

Checkout accepts real Shopify ProductVariant GIDs and quantities, creates a Shopify cart, checks warnings/errors/quantity consistency and redirects to its HTTPS checkout URL. Shopify determines current prices, inventory, shipping, taxes and payment. Local browser prices are not sent as pricing authority. Customer accounts and order history are not implemented.

## Admin workspace in practical terms

The admin is a review workspace, not a replacement Shopify backend. It has Overview, Products, Media & quality, and Connection tabs; search/filter/sort/pagination, field-presence checks, a full product inspector and CSV/JSON review exports work. Shopify operational links open Shopify itself and need separate merchant permissions.

There is no local product editing, asset upload, inventory mutation, order/refund handling, discount/customer management, enquiry inbox, role system, audit log, password-reset email or MFA. A **Complete** badge checks a few fields exist; it does not verify their truth, approval, media rights or remote reachability.

Read [every workspace screen](shopify-and-admin.md#every-workspace-screen) and [access/deployment](DEPLOYMENT_AND_ACCESS.md).

## Content/media state and known unfinished links

- All three project stories, sizes and photographs are illustrative, not completed client installations.
- Five client-logo slots are still empty; no approved names are populated.
- Story, product-family guidance, benefit strips, FAQ answers and generic installation text need client/technical sign-off.
- 62 products lack normalized dimensions; 56 lack material; 56 lack installation instructions. All 79 lack linked technical downloads. Pinewood TimberSlat Panels lacks a full imported body description. Information may still exist in titles/descriptions/options or original metafields.
- The room builder still looks up old demo handle `slat-panel-2400`, absent from the CSV. Its base-price request fails, price stays blank and save is disabled. Remaining finish/module upcharges and compatibility rules are demo rules, not Shopify variant logic.
- Sample projects retain five distinct old product handles; their suggested-product sections match no imported products.
- The contact form only changes local UI state. Consultation, quote and document-request links do not deliver anything. Room schemes are not transmitted by the generic bag-to-contact link.
- Footer **Sample catalogue** wording is stale after real CSV import; **Illustrative projects** remains accurate.
- Shipping/returns/privacy/terms pages, final support details and final social-share images are missing.

The [full audit](placeholder-content-audit.md) is the complete per-page/legacy record. The [media CSV](media-content-audit.csv) has 2,019 entries: 87 local assets, 1,913 remote media URLs, 9 generated visual systems, 5 empty logo slots and 5 variant-image gaps. The remote set contains 1,773 gallery/variant URLs and 140 source-only description media URLs, including one MP4. Media reachability, provenance/licensing and all-image visual suitability are unverified.

## Validation record

Before the catalogue/admin push, these passed: strict TypeScript, ESLint on changed files, production build, 22 Vitest tests across 8 files, and 2 standalone Node importer tests. Local HTTP checks also covered sign-in, protected-route redirect, authenticated catalogue access and logout; those were not live Vercel/Shopify payment tests.

Earlier review documents contain older browser checks and lower test totals. The later admin style/responsiveness revision and subsequent local work have a separate history; the earlier 24-test result does not automatically certify every future change. This reference-documentation pass checks links, data counts and secret exclusion rather than rerunning the whole app suite.

Normal verification commands:

```powershell
npx tsc --noEmit
npm test
node --test scripts/import-shopify-products.test.mjs
npm run build
```

Use `npm run dev` locally, normally port 8080, and reuse the running server. Format/lint changed files only because unrelated formatting violations exist. For worker-resource problems, the historical fallback is `npm test -- --maxWorkers=1 --no-file-parallelism`. For invalid-hook-call/cache issues, follow [DEV_SERVER.md](DEV_SERVER.md) before changing hooks.

## Git publication and collaboration record

Repository: [sniper-monke/TA-website](https://github.com/sniper-monke/TA-website). It is connected to Lovable; preserve published history and keep the connected branch working.

1. The implementation was committed locally as `384aafb` on `experiment/alcove-interactions-20261112`.
2. The initial direct push was rejected because an earlier unpublished commit also contained `tmp/pets` tooling, including an FFmpeg binary over GitHub's 100 MB limit.
3. A clean publication commit **44b3515** was created on top of then-current remote main. It retained the verified project files and excluded the unrelated temporary directory. Existing branch history was preserved; no force push or rewrite of published commits was used.
4. **44b3515 was successfully pushed to main**. It includes the imported CSV/catalogue, admin, handoff and original placeholder audit.
5. At this documentation snapshot, local `main` and cached `origin/main` point to **ccbb7a5**, titled **fix: isolate admin styles and repair responsive workspace**. This reference records that observed revision; it does not establish which deployment is serving it.
6. The expanded media audit and this reference pack are local documentation changes until separately committed/pushed. Current checkout remains the experiment branch; source styling differences against that checkout must not be accidentally bundled or discarded.

Do not retry a direct push of the old experiment history to main: its temporary-tool ancestors still exist locally. For future publication, use a clean checkout/worktree based on current remote main and carry over only intended changes. An ordinary later deletion of a large file does not remove that file from commits being newly sent.

The brand-book PDF is about 59 MB and was accepted with a GitHub size warning. It is under `public/`, as is the short website brief, so confirm whether those source documents should be publicly served. No local secrets were included in the successful catalogue/admin commit.
