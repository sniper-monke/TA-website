# Demo, placeholder and unfinished-content inventory

Audited against local source on 18 November 2026; expanded to include media on the same date. This is a source audit, not a check of a deployed store. No storefront content was changed by this audit.

**Media is included.** Section 11 covers reference photographs, product images and videos, branding, fonts, documents, generated graphics, empty media slots and historical review assets. The companion [complete media inventory](media-content-audit.csv) lists individual local files and imported media URLs, their placements and review status. Imported client product media is distinguished from demo/reference media.

Three different statuses matter:

- **Demo**: explicitly invented/example content, including sample projects and old products.
- **Draft / needs approval**: authored website copy or reference imagery without client verification. This does not establish that the claim is false or that the asset must be replaced.
- **Missing / unconnected**: a real feature or imported field that still needs data or a service connection. These are listed separately from invented content.

## 1. Real imported content: do not replace this as demo

Source: [Shopify export](<products_export_1 (1).csv>), [normalized catalogue](../src/data/shopify-products.json), [importer](../scripts/import-shopify-products.mjs), [catalogue selection](../src/lib/catalogue.server.ts).

- 79 products, 1,186 variants and 1,946 gallery-image references were imported from 2,045 CSV records. Zero products were excluded.
- Product names, handles, descriptions where present, prices, option names/values, SKUs, gallery URLs, vendor, tags, SEO fields and supported custom metafields come from the export.
- These are a static export snapshot. Prices, publication status and options have not been verified against the current live store.
- The export also contains **Item Customizations** and **Lavalier microphone microphone**. They are imported records, not fabricated demo products; confirm whether they should appear in the public catalogue. Item Customizations may need the original customization app's workflow.
- No imported description contains the words demo, placeholder, lorem or sample. This is a text check, not validation of the descriptions' business or acoustic claims.

## 2. Homepage `/`

Sources: [HomeExperience](../src/components/experience/HomeExperience.tsx), [KineticHero](../src/components/experience/KineticHero.tsx), [site content](../src/data/site-content.ts).

### Explicit placeholders and concepts

1. **Client logo 01**.
2. **Client logo 02**.
3. **Client logo 03**.
4. **Client logo 04**.
5. **Client logo 05**.
6. The trust strip's **Approved names & logos to follow** message. `trustedClients` is empty; no approved names or client-logo assets populate it.
7. The interactive listening alcove itself is an architectural **concept study**, not a model of a saleable product or a real installed room.
8. The alcove's three finish previews: **Natural oak**, **Walnut**, **Smoked ebony**, including their swatch colours and rendered textures. They are visual studies rather than measured/photographed samples of a selected Shopify variant.
9. Alcove cutaway/layer diagrams: **Timber face**, **Acoustic backing**, **Space behind**. They illustrate construction principles; they do not document a particular product's approved construction.
10. Alcove **Bare / Treated** reflection paths and the shorter/softer reflection trail. The animations are illustrative, not an acoustic solver, test result or performance comparison.
11. The **Use this finish in a room** link carries a concept finish to the prototype builder, not a validated Shopify product configuration.
12. Featured project **The listening retreat**, including its cinema concept copy and reference photograph.
13. More-project card **A room for the record**, including its reference photograph.
14. More-project card **Space to think**, including its reference photograph.
15. The approach image `/images/timber-detail.webp`: reference material imagery, not confirmed client product/workshop photography.

### Authored copy awaiting client sign-off

16. Hero kicker **Less echo. More clarity. Better balance.**, headline **Sound, in better shape.**, intro about panels/diffusers/bass traps, and the **Acoustics with a natural soul.** tagline.
17. Hero geographical label **Timber Acoustics / India**.
18. Entire **Our approach** copy: **Acoustics, materials and design.**, the room-understanding paragraph, and **Thoughtful treatment. Honest materials. A finish that belongs in your space.**
19. Four category captions: **Soften echo. Bring speech into focus.**, **Scatter reflections. Keep the room alive.**, **Give lingering low frequencies less room.**, **A considered place for your studio setup.**
20. Featured-project claims **Clearer dialogue. More balanced bass.** They describe a concept, not measured results from a completed project.
21. Consultation banner **Build your acoustic space.** and **Every room tells a different story. Our job is to help yours sound like it should.**
22. **Book a consultation** currently leads to the preview contact form. It does not reserve a slot or deliver a request.

The four homepage category choices and room-type navigation are editorial navigation decisions, not fabricated products. Category images now come from the imported catalogue, rather than the old demo-family image file.

## 3. Project index and all three project pages

Sources: [all project records](../src/data/reference-projects.json), [project presentation](../src/reference/pages/Projects.tsx).

Every field in all three project records is illustrative: title, slug, room type, location, area, dimensions, summary, challenge, approach, intended outcome, gallery and suggested product associations. `sample: true` explicitly marks each record.

| Project / route                                           | Example setting and size                             | Reference gallery         | Old suggested product handles                  |
| --------------------------------------------------------- | ---------------------------------------------------- | ------------------------- | ---------------------------------------------- |
| The listening retreat — `/projects/the-listening-retreat` | Illustrative residential space; 21.3 m²; 5.2 × 4.1 m | photo-3, photo-2, photo-1 | slat-panel-2400; corner-trap-pro               |
| A room for the record — `/projects/a-room-for-the-record` | Illustrative recording space; 12.8 m²; 4.0 × 3.2 m   | photo-16, photo-1         | felt-tile-600; corner-trap-pro; qrd-diffuser-7 |
| Space to think — `/projects/space-to-think`               | Illustrative workplace; 27.0 m²; 6.0 × 4.5 m         | photo-17, photo-1         | edge-panel-1200; slat-panel-2400               |

- All project summaries and the **The brief / The approach / The intention** text blocks are example briefs, not client case studies.
- None establishes a completed installation, real customer, installation location or measured result.
- All five distinct suggested product handles above are absent from the imported catalogue. Their **Suggested collection** sections currently match no products.
- Project badges, reference-photography notices and sample-dimension notices explain the demo state. Remove/update those notices only when real case studies replace the records.
- `/projects` introduction **Sound, given a sense of place.** and **Rooms with a point of view. Materials with a purpose.** are draft editorial copy.

## 4. About / story `/story`

Source: [Story](../src/reference/pages/Story.tsx). The brief explicitly says the company story is still awaiting confirmation.

All of these are draft copy or unverified brand claims, rather than sourced company history:

1. **Designed in India. Built for the world.**
2. The opening claim about affordable soundproofing and acoustic treatment for studios, theatres, restaurants, offices and auditoriums.
3. **The room comes first** chapter and its description of how treatment starts.
4. **Timber, by intent** chapter and the wood/felt/mineral-core construction description.
5. **Shaped by geometry** chapter and its measured/repeatable/curved design language.
6. **The workshop / Where offcuts became instruments.**
7. The entire origin story beginning **The first prototype was built from offcuts...**. This must be confirmed or replaced with the actual founding/workshop story.
8. **Material honesty** and **Real timber, real felt, real cores. Nothing pretending to be something else.**
9. **Measured acoustics** and **Every product targets a behaviour — absorb, diffuse, trap, shape, tune.**
10. **Craft in every joint** and **Built by hand in India, finished like furniture, not fixtures.**
11. Closing statement beginning **The final test is not a graph...**
12. All five story photographs: photo-7 (studio), photo-18 (slats), photo-6 (geometry), photo-21 (workshop), photo-22 (wood grain). In particular, the carpenter photograph is not evidence of the client's actual workshop or staff.

## 5. Guides `/guides` and `/guides/:slug`

Sources: [guide records](../src/reference/data/guides.tsx), [guide pages](../src/reference/pages/Guides.tsx).

These are authored educational articles. They can remain after technical/editorial approval, but their room examples and scheme configurations are explicitly illustrative, not commissioned acoustic plans.

| Guide                  | Draft title / phrase             | Example dimensions | Demo scheme                                                                             |
| ---------------------- | -------------------------------- | ------------------ | --------------------------------------------------------------------------------------- |
| `/guides/home-theatre` | Home theatre / Feel every scene. | 5.2 × 4.1 m        | The cinema edit: walnut, charcoal felt, 600 × 1200, 3 panels/wall, both walls, vertical |
| `/guides/studio`       | Studio / Hear what is there.     | 4.0 × 3.2 m        | The reference edit: oak, charcoal felt, 600 × 1200, 3 panels/wall, both walls, vertical |
| `/guides/office`       | Office / Space to think.         | 6.0 × 4.5 m        | The focus edit: oak, bone felt, 600 × 1200, 2 panels/wall, side wall, vertical          |

- The guide-index headline, introductory text, each guide's intro, objective, four article sections and four-item consultation checklist are draft editorial content.
- Home-theatre sections: **Start with the seats, not the panels. / Make room for the dialogue. / Give bass the space it needs. / Keep the room alive.**
- Studio sections: **Find your reference position. / Control the first arrival. / Work on the low end first. / Measure. Listen. Adjust.**
- Office sections: **Listen to how the room is used. / Spread the quiet around. / Put speech first. / Treat privacy as a separate brief.**
- `/images/timber-theatre.webp`, `timber-studio.webp`, `timber-office.webp` are illustrative guide photography, not authenticated client installations.
- Scheme names, selected materials, panel counts, coverage and module sizes are sample presets.
- **Indicative modules and pricing** and **not a complete treatment prescription** notices explain the limitation.
- Each record also retains unused old demo-product handles in its `products` array. The current guide UI uses a family link instead; those arrays do not establish real product recommendations.

## 6. Room builder `/build-a-room` (`/configurator` redirects here)

Sources: [configuration data](../src/reference/data/configurator.tsx), [builder page](../src/reference/pages/Configurator.tsx), [room drawing](../src/reference/components/RoomPreview.tsx), [material study](../src/components/experience/MaterialStudy.tsx).

1. Entire rendered room layout is a concept drawing, not a site survey, construction drawing or scaled model.
2. Finish-study renderings and colours are illustrative, not calibrated product samples.
3. Home Theatre preset: **5.2 × 4.1 m**, 3 panels/wall, both walls.
4. Listening Room preset: **4.5 × 3.6 m**, 2 panels/wall, rear wall.
5. Studio preset: **4.0 × 3.2 m**, 3 panels/wall, both walls.
6. Office preset: **6.0 × 4.5 m**, 2 panels/wall, side wall.
7. All four room-type explanatory notes are generic prototype guidance.
8. Finish options: **Natural Oak**, **Walnut**, **Smoked Ebony**, including swatch values.
9. Felt options: **Charcoal**, **Rust**, **Bone**, including swatch values.
10. Module options: **600 × 600**, **600 × 1200**, **900 × 900 mm** and their drawing sizes.
11. Coverage options: **1–4 panels per wall**. These are selectable demo counts, not calculated acoustic requirements.
12. Wall options **Rear / Side / Both** and **Vertical / Horizontal slats** are visual choices without verified product/installation compatibility.
13. Prototype finish upcharges: Walnut **₹1,500**, Ebony **₹2,500**.
14. Prototype module upcharges: 600 × 1200 **₹2,400**, 900 × 900 **₹3,200**.
15. A **₹14,900** demo base-price constant remains in `CONFIG`; the active page does not use that constant as a fallback.
16. Active base-price lookup still requests old demo handle **slat-panel-2400**, which is absent from the imported catalogue. In CSV mode this fails, leaves the price as a dash, shows scheme unavailable and disables **Save room for a quote**.
17. The price formula `(looked-up base price + finish upcharge + module upcharge) × panel count` is prototype pricing, not Shopify variant pricing or an actual quotation.
18. Demo compatibility rule: **Smoked Ebony isn't offered over Bone felt**.
19. Demo compatibility rule: **Both walls supports up to 3 panels per wall**.
20. Generated scheme names/descriptions and saved scheme payloads are local concept data, not a Shopify bundle, order, approved bill of materials or submitted quote.
21. Draft copy **Your space. Your signature. / A little timber. A little intention. A room that feels more like you.**

## 7. Current product pages: assumptions and generic filler around real CSV data

Sources: [importer](../scripts/import-shopify-products.mjs), [shared product page](../src/components/experience/ProductExperience.tsx), [family guidance](../src/lib/product-presentation.ts), [detail related-product selection](../src/reference/pages/ProductDetail.tsx).

1. **INR is assumed** for all 79 products because this export does not provide store currency. The numeric prices are imported; the currency label needs confirmation.
2. All seven display families are inferred from title/tag keyword rules, not exported Shopify collection membership: **Absorption Panels (41), TimberSlat (1), Bass Traps (8), Diffusion (6), Room Kits (5), Racks & Tables (12), Accessories & Materials (6)**.
3. Family images are automatically the first matching product's first gallery image, not curated collection cover images.
4. Family `principle` and `blurb` values in the normalized catalogue are empty.
5. All 1,186 variant IDs use synthetic `csv:<handle>:<number>` identifiers. These are not valid Shopify checkout IDs.
6. All imported variants carry `availableForSale: false` to prevent CSV checkout. This means availability is unknown/unconnected, not that the client is actually out of stock.
7. Imported download arrays are empty for all 79 products. The importer does not extract technical PDF links from body HTML.
8. **62** products lack normalized dimensions, **56** lack normalized material details, **56** lack normalized installation instructions. Appendix B identifies each one. Data might still exist in the description, options, title or other original export fields.
9. **Pinewood TimberSlat™ Panels** lacks a full imported body description. Its short summary is populated from SEO text.
10. All product-family headlines, overview paragraphs, performance explanations and three-benefit strips come from five generic templates: **Studio furniture / Diffusion / Bass management / Room treatment / Absorption**.
11. The default template is Absorption. Families such as Accessories & Materials and TimberSlat also receive that template unless explicitly handled. It needs product-level review; it is not verified product-specific performance copy.
12. **Measured data matters** and the request for verified frequency-response/test conditions are generic holding content. No verified acoustic curve or test report is linked by the current CSV importer.
13. Furniture **Confirm fit and assembly** text is generic; no load rating is generated or verified.
14. The **Technical downloads** empty state says verified product sheets and installation documents will be added with the final catalogue.
15. Products without an installation field show **Confirm the appropriate installation method with the team.**
16. All three installation/assembly steps are shared generic text, not product-specific instructions.
17. FAQ answer about treatment quantity/equipment fit is shared generic guidance.
18. FAQ answer about custom sizes/finishes is a draft service promise requiring client confirmation.
19. FAQ answer about technical documents is a shared placeholder when downloads are absent.
20. FAQ about buying online correctly describes the pending live connection.
21. **Online purchasing coming soon**, the CSV connection notice and the export-currency notice are temporary launch-state messages.
22. Product custom-quote, consultation, product-sheet and test-data links all lead to the undelivered contact preview form.
23. Related products are selected by a simple same-family/featured rule. These are automatic suggestions, not curated compatibility recommendations.
24. Product **Explore a room layout / See this finish in a room** routes to the concept builder. This is not a link to a matching purchasable kit.
25. `/brand/timber-mark.svg` is the generic missing-image fallback for products and collections. No imported product currently needs it; this is a fallback state, not an actual product photo.

Legacy sample NRC/price/finish branches still exist in the shared product component, but the current CSV catalogue does not feed demo products into it. See Appendix A rather than treating those sample NRC ratings as active imported specifications.

## 8. Contact, consultation, quote and bag flows

Sources: [contact route](../src/routes/contact.tsx), [bag page](../src/components/experience/ShoppingBagPage.tsx), [browser basket](../src/reference/context/BasketContext.tsx), [API adapter](../src/reference/lib/api.tsx).

1. The whole `/contact` form is a frontend preview: name, email, space type, room size and message are never sent to a server or email service.
2. Submit only changes local UI state. **Your enquiry preview. / Demo form — nothing was sent.** is not an enquiry receipt.
3. **Book a consultation**, **Contact us**, **Consult the team**, **Get a custom quote**, **Request a document** and **Request verified test data** all inherit that limitation.
4. Product/option/quantity query parameters prefill the form, but do not create a quotation or ticket.
5. The bag is real local-browser state in localStorage; it is not yet a persistent Shopify cart or a customer-account shortlist. No customer order exists merely because items are saved there.
6. Old saved demo products can still appear from browser storage. Their preview labels, indicative subtotals and disabled-checkout copy remain intentional safeguards.
7. **Room study** is the text thumbnail for schemes without an image.
8. Room schemes are **By quotation**; the bag's quote link opens the generic contact page. It does not currently send the room scheme or bag contents to the team.
9. Shopify checkout code exists, but CSV purchases are disabled pending real variant IDs and connection. Payment, current stock, shipping and tax results have not been verified against a live store.
10. There is no implemented enquiry inbox/backend behind `api.post`; it always rejects with **Enquiries are not configured on this preview.**

## 9. Shared footer, metadata and missing final content

Sources: [shared chrome](../src/components/experience/SiteChrome.tsx), [root metadata](../src/routes/__root.tsx), [home metadata](../src/routes/index.tsx), [route files](../src/routes/).

1. Active footer still says **Sample catalogue / Illustrative projects**. The first half is stale now that CSV products are imported; the illustrative-project half is still accurate.
2. Footer paragraph **Acoustic solutions for studios, homes and creative spaces.** is draft brand copy.
3. Footer tagline **Designed in India. Felt everywhere.** is draft brand copy.
4. Root description **Wood acoustic treatment for studios and spaces.** and home title/description are generic authored SEO copy. Contact title/description and Open Graph description are authored too.
5. Open Graph/Twitter type/card defaults exist, but final canonical store URLs and share-image metadata are not configured in these route definitions.
6. No final shipping policy, returns/refunds policy, privacy policy or terms page is implemented in the route tree. This is missing content, not hidden demo policy text.
7. Active contact/footer has no confirmed support email, telephone, postal address, opening hours or social links. Obtain those if they are to appear; there are no visible invented replacements to swap out.
8. Approved client testimonials and customer-review content are not implemented; there are no visible fabricated reviews to remove.

The supplied brand logo assets, typography and colours are governed by the brand documentation. They are not automatically demo assets just because other content is provisional.

## 10. Admin: working functionality versus pending integration

Sources: [admin workspace](../src/components/admin/AdminWorkspace.tsx), [admin server](../src/lib/admin.server.ts), [login](../src/routes/admin.login.tsx), [handoff](shopify-and-admin.md).

1. Login/session handling and catalogue inspection are implemented. This is no longer the old visual login mockup.
2. The generated local team identity is a development account, not a client Shopify staff login. A client-owned production identity/secrets still need provisioning.
3. Overview export totals are real counts of the CSV snapshot, not live store analytics, stock counts, sales, customers, orders or revenue.
4. **Complete / Needs review** is a limited field-presence check, not editorial approval, verified specification accuracy or proof an image URL loads. In particular it does not require technical PDFs or a full body description.
5. Media thumbnails are real imported URLs, but reachability/ownership and image quality are not certified by the dashboard.
6. **Not configured / Not connected** are actual connection states when secrets are missing, not fabricated status values. The inspected `.env.local` contains admin settings but no Shopify domain/token entries; no deployed environment was inspected.
7. Products, inventory, orders, customers, discounts, analytics and settings shortcuts depend on a configured store domain and open Shopify's own admin. Those are not implemented management panels inside this site's admin.
8. Product content edits, uploads, bulk mutations, order/refund handling, customer management, discount creation and enquiry management are not implemented locally. The current workspace is read-only catalogue review/export.
9. No invented orders, customers, sales charts or revenue metrics were found in the active admin.

## 11. Complete media inventory

### Scope and classification

The [searchable media inventory CSV](media-content-audit.csv) contains **2,019 records**: all 87 media/supporting-asset files under `public/`, `src/assets/` and `docs/`, all 1,913 distinct gallery/variant/embedded media URLs found in the imported catalogue and its original CSV descriptions, 9 generated visual systems, the 5 empty client-logo slots and the 5 variants without dedicated images. Repeated product-media URLs are consolidated into one record with all placements listed.

- **Reference / confirm or replace**: 32 local photographs: 5 WebP editorial images, 23 numbered reference JPGs and 4 legacy JPG assets. Fifteen have active photo/texture usage; the other 17 have only legacy/unselected usages. Reference assets are not proof of a completed client installation.
- **Imported client media / verify**: 1,773 distinct Shopify CDN image URLs used by product galleries and variant images. These come from the client export; they are not marked as invented placeholders.
- **Original-export embedded media / not rendered**: 140 additional distinct URLs found in description HTML: 139 image URLs and 1 MP4 URL. The plain-text importer does not render these as media.
- **Brand/supporting assets / not automatically demo**: 3 SVG brand files, 1 favicon, 8 font files and 2 client/reference documents.
- **Historical review only**: 41 files under the five review folders, including 40 PNG screenshots and 1 GIF. They are not storefront media.
- **Concept illustrations**: generated alcove, room/finish previews, sound paths and earlier visual experiments. They are not photographs, measured results or validated product models.
- **Decorative graphics**: contours, rings, CSS grain and interface icons. These are design assets, not missing product/customer content.

This is a file/reference audit. No remote media was downloaded, no CDN reachability was tested, no licensing/ownership was authenticated, and no all-image visual review was performed. Counts of distinct URLs do not establish distinct underlying photographs: URL parameters, resized copies or alternate crops may represent the same source image. A URL can also point to a diagram or render rather than a photograph.

### Reference photographs: each file and its placement

These require client approval/replacement or confirmation of appropriate use. Their filenames alone do not establish who photographed them or their licensing. Active reference imagery should be replaced with approved installation, workshop or material photographs where the page implies those subjects belong to Timber Acoustics. Imported Shopify CDN product galleries are separate from these reference assets.

| Asset                            | Current/reference usage                                                      |
| -------------------------------- | ---------------------------------------------------------------------------- |
| `/images/timber-detail.webp`     | Active homepage approach and admin login; also old unused homepage           |
| `/images/timber-hero.webp`       | Active 3D alcove timber texture; old unused homepage hero                    |
| `/images/timber-theatre.webp`    | Active home-theatre guide; old unused homepage invitation                    |
| `/images/timber-studio.webp`     | Active studio guide                                                          |
| `/images/timber-office.webp`     | Active office guide                                                          |
| `/reference-photos/photo-1.jpg`  | All three active sample projects; old Aalto Slat fixture                     |
| `/reference-photos/photo-2.jpg`  | Active listening-retreat project; old Aalto Slat fixture                     |
| `/reference-photos/photo-3.jpg`  | Active listening-retreat project and homepage banner; old Aalto Slat fixture |
| `/reference-photos/photo-4.jpg`  | Old Felt Tile fixture and old family image                                   |
| `/reference-photos/photo-5.jpg`  | Old Felt Tile/Edge fixtures; unused IMG.office mapping                       |
| `/reference-photos/photo-6.jpg`  | Active story geometry chapter; old diffuser fixtures/family                  |
| `/reference-photos/photo-7.jpg`  | Active story studio chapter; old QRD/Corner Trap fixtures                    |
| `/reference-photos/photo-8.jpg`  | Old Skyline fixture                                                          |
| `/reference-photos/photo-9.jpg`  | Old Corner Trap fixture/family; unused chapter imagery                       |
| `/reference-photos/photo-10.jpg` | Old Membrane Trap fixture                                                    |
| `/reference-photos/photo-11.jpg` | Old Membrane Trap/Desk Rack fixtures; unused IMG.listening mapping           |
| `/reference-photos/photo-12.jpg` | Old Edge Panel fixture                                                       |
| `/reference-photos/photo-13.jpg` | Old Studio Kit S fixture and old Room Kits family image                      |
| `/reference-photos/photo-14.jpg` | Old Studio Kit S fixture and TimberSlat family; unused chapter imagery       |
| `/reference-photos/photo-15.jpg` | Old Desk Rack fixture and furniture family image                             |
| `/reference-photos/photo-16.jpg` | Active recording-space project and homepage card                             |
| `/reference-photos/photo-17.jpg` | Active workplace project and homepage card                                   |
| `/reference-photos/photo-18.jpg` | Active story timber chapter                                                  |
| `/reference-photos/photo-19.jpg` | Unused IMG.workshop mapping                                                  |
| `/reference-photos/photo-20.jpg` | Unused IMG.home_theater mapping                                              |
| `/reference-photos/photo-21.jpg` | Active story workshop photograph                                             |
| `/reference-photos/photo-22.jpg` | Active story wood-grain inset                                                |
| `/reference-photos/photo-23.jpg` | Unused chapter/IMG.living mapping                                            |
| `src/assets/hero-studio.jpg`     | Legacy product/story/material components                                     |
| `src/assets/macro-slats.jpg`     | Legacy product/story/material components                                     |
| `src/assets/diffuser.jpg`        | Legacy product/material components                                           |
| `src/assets/office.jpg`          | Legacy product/chapter components                                            |

### Imported product galleries and variant images

Sources: [normalized catalogue](../src/data/shopify-products.json), [original export](<products_export_1 (1).csv>), [importer](../scripts/import-shopify-products.mjs).

- **1,946 gallery placements across 79 products**, representing **1,773 distinct image URLs**. All current gallery URLs use `cdn.shopify.com`; no imported product currently uses the generic missing-photo fallback.
- **1,181 variant-image placements**, representing **901 distinct URLs**. All of those URLs also occur in the gallery set, so they are not 901 additional assets.
- The companion CSV identifies each URL's product name/handle, gallery positions, variant names/SKUs and original image-alt values where supplied. This includes real product photos, diagrams, marketing graphics or renders as present in the export; their visual type has not been individually verified.
- Homepage category covers use the first image of the first matching product. These are real exported image URLs, but the image selection is provisional rather than a client-curated collection banner.
- Product cards, product-detail thumbnails/main images/zoom/overview images, related-product cards, admin media cards and product inspectors reuse this image set. A live product saved to the bag also uses its selected product image.
- Original source alt text is inventoried, but the importer stores galleries as URL strings. The UI generates most gallery/card alt text from the product name; it does not preserve separate descriptive alt text for every gallery image. Variant image alt text is retained with a product-name fallback.
- Variant images switch when a matching combination has a dedicated image. Where no dedicated image exists, the page retains a gallery image. This is an image-association gap, not an empty product gallery or proof of a missing photo.

Every variant without a dedicated image:

| Product                                                                                           | Variant / SKU                                             | Current media gap                                                                     |
| ------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Non-Woven Soundproofing Blanket for Noise Reduction, Acoustic Curtains & Blinds, 1 Meter (Black ) | Default Title; no exported SKU                            | No variant image association; product gallery exists                                  |
| High Density Foam Seal Tape \| 12mm x 6mm x 5M                                                    | Default Title; no exported SKU                            | No variant image association; product gallery exists                                  |
| Item Customizations                                                                               | Default Title; no exported SKU                            | No variant image association; also confirm this app helper should be a public product |
| Rockwool Safe 'n' Silent Pro 330                                                                  | Safe & Silent Pro 370 (Density 80 kg/m³); no exported SKU | No dedicated image for this variant; product gallery exists                           |
| Pyramid Foam Panels                                                                               | Set of 18; SKU B0D8N8V2S6                                 | No dedicated image for this variant; product gallery exists                           |

### Embedded images and video in the original CSV

The original `Body (HTML)` fields contain **295 media-source placements**: **287 `<img src>` placements** and **8 `<source src>` placements**. They refer to **140 distinct URLs beyond the displayed gallery set**. All 8 source-tag placements refer to the same MP4 URL. The CSV inventory includes each image/video URL and the product descriptions that contain it.

The video URL is `https://cdn.shopify.com/videos/c/o/v/2e032d71e5464ea98266a4b4206cb1ec.mp4`. It is source-export media, not a currently displayed homepage/product video. The importer strips HTML rather than rendering its images or video players, so neither these 139 embedded image URLs nor that MP4 is currently rendered from descriptions. Decide which media should be restored and where; the mere presence of a video URL does not verify its content, audio track or suitability.

No active storefront video/audio player, audio playback demo, or local MP4/WebM/MP3/WAV/OGG file was found in the audited source/asset folders. The animated sound paths do not play sound. No external GLB/GLTF/OBJ model file was found; the current alcove geometry is generated in code.

### Logos, favicon, empty slots and brand assets

| File / slot                         | Usage                                                                | Status / action                                                                                              |
| ----------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `/brand/timber-acoustics.svg`       | Active shared header and footer wordmark                             | Existing supplied brand asset; confirm final approved version, not an invented client-logo placeholder       |
| `/brand/timber-mark.svg`            | Product/collection missing-image fallback; admin missing-image check | Brand symbol used as a generic fallback, not a product image; currently unused by the imported galleries     |
| `/brand/timber-acoustics-light.svg` | Available light wordmark; no active source reference found           | Supporting brand variant, not a currently missing logo                                                       |
| `/favicon.ico`                      | Root site/browser icon                                               | Existing icon; confirm final brand rendition. Its presence alone is not evidence it is a starter placeholder |
| Client logo 01                      | Homepage Trusted partners                                            | Empty logo slot; approved client name and artwork required                                                   |
| Client logo 02                      | Homepage Trusted partners                                            | Empty logo slot; approved client name and artwork required                                                   |
| Client logo 03                      | Homepage Trusted partners                                            | Empty logo slot; approved client name and artwork required                                                   |
| Client logo 04                      | Homepage Trusted partners                                            | Empty logo slot; approved client name and artwork required                                                   |
| Client logo 05                      | Homepage Trusted partners                                            | Empty logo slot; approved client name and artwork required                                                   |

### Generated graphics, animation and visual placeholders

| Source / visual                                                      | Placement                                                                                     | Status                                                                                                            |
| -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `HeroListeningScene.tsx`, `listening-scene.ts`, `AlcoveExplorer.tsx` | Homepage 3D alcove and inline SVG fallback; finish variants, layers, bare/treated reflections | Concept illustration, including fallback; not a real product model, manufactured assembly or acoustic measurement |
| `MaterialStudy.tsx`                                                  | Room builder finish study                                                                     | Procedural finish/construction preview; visual swatches and grain are illustrative                                |
| `reference/components/RoomPreview.tsx`                               | Active room-builder SVG scene                                                                 | Room proportions, furnishings, panels, slats and mounting positions are conceptual and not to scale               |
| `LiveContourField.tsx`                                               | Homepage animated background                                                                  | Decorative generated wood-grain/contour motif; can remain as design artwork                                       |
| `BrandContours.tsx`                                                  | Page-intro, consultation and material-study backgrounds                                       | Decorative vector motif; not a test graph, real material scan or client logo                                      |
| `reference/components/WoodRings.tsx`                                 | Active story background rings; legacy rings marks                                             | Decorative vectors; the legacy rings mark is not the active supplied wordmark                                     |
| `styles.css` inline SVG noise                                        | Grain texture on styled sections                                                              | Procedural decoration; not photographic media needing product replacement                                         |
| `components/site/AcousticCanvas.tsx`                                 | Unselected earlier homepage study                                                             | Legacy abstract 3D animation; not an acoustic simulation                                                          |
| `components/site/RoomCanvas.tsx`, `RoomStage.tsx`                    | Unselected earlier room builder                                                               | Legacy concept room/furniture/material renders                                                                    |

Lucide/UI icons, gradients and CSS shadows are interface artwork rather than demo business content. The bag's **Room study** image substitute is a text block, not an undiscovered photo asset. No approved client-logo artwork exists behind the five text slots.

### Fonts and supporting documents

- All 8 font files under `public/fonts/` are included individually in the media inventory: the 3 Quicksand TTFs and 5 WOFF2s referenced by the older Montserrat/Playfair Display/Raleway font declarations. These are supporting typography assets, not placeholders for photography or customer content. Brand-font usage/licensing can be confirmed with the client.
- `public/images/Timber Acoustics Brand Book.pdf` is an existing brand-reference document, not a product technical download. No active storefront link to it was found.
- `public/images/Timber-Acoustics-Website-Brief-Short.docx` is an existing website brief, not customer-facing acoustic documentation. No active storefront link to it was found.
- Both documents live under `public/`, so they can be addressed directly by URL when deployed even without a navigation link. Confirm whether they should remain publicly served. Moving them is outside this documentation update.
- All 79 product `downloads` arrays remain empty. Final product sheets, installation/assembly PDFs, test reports, load ratings and CAD/drawings are missing media deliverables, not supplied by the brand book or website brief. There is no per-product downloadable asset to inventory yet.
- Final social-share imagery and per-route `og:image`/`twitter:image` metadata are missing. The existing Twitter card type alone does not supply a share image.

### Historical review screenshots and animation

Every file is individually listed in the media CSV. These are internal review artifacts rather than assets imported by active routes:

| Folder                    | Files            | Purpose                                                         |
| ------------------------- | ---------------- | --------------------------------------------------------------- |
| `docs/wireframe-review/`  | 8 PNGs           | Homepage/menu/layout review at desktop, tablet and mobile sizes |
| `docs/product-review/`    | 9 PNGs           | Product-page, specifications and gallery-zoom review            |
| `docs/alcove-experiment/` | 7 PNGs           | Alcove space/layers/gap/sound-path states                       |
| `docs/design-review/`     | 8 PNGs and 1 GIF | Earlier design, fallback, room and hero-motion review           |
| `docs/client-review/`     | 8 PNGs           | Earlier home, menu, featured content, acoustics and bag review  |

### Client media handoff checklist

1. Supply approved real installation images and permission to publish for each of the three replacement case studies, with correct titles, locations, dimensions and captions.
2. Supply actual workshop/staff/process and material-detail images, or approve the current reference usage without implying they show the client's team/products.
3. Supply five approved client logos and permission to name those clients, or reduce/remove the empty trust strip.
4. Approve or replace the 15 actively used reference photographs/textures; separately decide whether to retain the 17 legacy-only photos.
5. Review the imported image URLs, variant associations, gallery order, collection covers and descriptive alt text. The CSV lets the client review each exact URL.
6. Decide which of the 139 source-only embedded images and the single embedded video should appear in product descriptions, and supply captions/transcripts if relevant.
7. Supply final product PDFs/drawings/test reports and a social-share image; approve the final favicon/wordmark variants.
8. Approve the concept alcove/room illustrations as illustrations, or provide validated product models/finish samples if product accuracy is required.

## 12. Dormant demo content still in the repository

These components/pages are not selected by the current route modules. They should not be mistaken for additional currently visible site sections. Demo JSON imports in `use-catalogue` and `product-presentation` support TypeScript shapes; they do not restore the old runtime catalogue fallback.

| File / group                                            | Remaining demo content                                                                                                                                                                                                                                                         |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/data/reference-products.json`                      | All 10 sample product records; every name, price, dimension, material, installation note, purpose, NRC where present, finish, size, gallery association and featured/published flag. See Appendix A.                                                                           |
| `src/data/products.ts`                                  | Parallel 10-product demo array; first product called Slat Panel 2400 instead of Aalto Slat 2400; six demo families with image/blurb/principle; demo wood/fabric finish swatches; legacy formatting helper.                                                                     |
| `src/data/reference-families.json`                      | Six old demo family records: Absorption Panels, TimberSlat, Bass Traps, Diffusion, Room Kits, Racks & Tables; all category descriptions/principles and reference-photo associations. No longer the runtime family source.                                                      |
| `src/data/configurator.ts`                              | Duplicate old Acoustic Room Scheme concept definition, ₹14,900 base, finishes/felts/module sizes, surcharges, coverage and demo compatibility rules.                                                                                                                           |
| `src/data/chapters.ts`                                  | Five old Absorb/Diffuse/Trap/Shape/Tune chapter stories, descriptions, photos and alt text. Unverified numeric callouts: **RT60 / 0.42s**, **1D / quadratic**, **LF / 80–160Hz**, **R / 1200–∞**, **EQ / room balance**. Includes offcuts origin and Meridian geometry claims. |
| `src/reference/data/chapters.tsx`                       | Unused five-chapter CHAPTERS content and extra IMG mappings. Some IMG entries are still used by the active story and are inventoried above.                                                                                                                                    |
| `src/components/site/BrandsMarquee.tsx`                 | **WeWork** and **Amazon** in a legacy Trusted in spaces by strip. These are unapproved reference names; they are not shown by the active homepage.                                                                                                                             |
| `src/components/site/StoryPanel.tsx`                    | We design silence like architecture; invented origin paragraph; **05 acoustic behaviours**, **18mm timber expression**, **01 modular field**; Listening is the final material caption.                                                                                         |
| `src/components/site/MaterialIndex.tsx`                 | Prototype study names **Meridian**, **Vector**, **Signal**; curved slat/diffuser/calibration labels; A system before a catalogue; material thesis and interface-design prose.                                                                                                  |
| `src/components/site/Journey.tsx`, `AcousticCanvas.tsx` | Old five-behaviour visual story/abstract 3D animation; not measured acoustic simulation.                                                                                                                                                                                       |
| `src/components/site/EditorialMarquee.tsx`              | Precision Matters / Rooms Are Instruments / Silence Has Geometry draft slogans.                                                                                                                                                                                                |
| `src/components/site/Catalogue.tsx`                     | Old demo-product cards, price labels, filters and six-family browser.                                                                                                                                                                                                          |
| `src/components/site/Chrome.tsx`                        | Old Demo cart/no-checkout drawer, demo subtotal, old brand copy, Design prototype · demo data notice; unverified Instagram and YouTube URLs.                                                                                                                                   |
| `src/components/site/ReferenceChrome.tsx`               | Old rings-style logo/header/footer and Sample catalogue — prices & specs are indicative notice.                                                                                                                                                                                |
| `src/components/site/RoomCanvas.tsx`, `RoomStage.tsx`   | Earlier concept room/material visualizations driven by demo configuration.                                                                                                                                                                                                     |
| `src/reference/pages/Home.tsx`                          | Old Less noise. More feeling. homepage; manifesto/acoustic-principle copy; material captions; showcase; room notes and invitation. It is not the page served by `/`.                                                                                                           |
| `src/reference/components/Marquee.tsx`                  | Old Absorb / Diffuse / Trap / Shape / Tune marquee used by that old homepage.                                                                                                                                                                                                  |
| `src/reference/pages/Basket.tsx`                        | Old enquiry-basket form and unreachable success copy claiming saved in team inbox, enquiry reference and email-processing status. Current `/basket` uses ShoppingBagPage; API adapter has no inbox.                                                                            |
| `src/lib/cart.tsx`                                      | Old in-memory demo cart, still mounted as a provider by root but not the cart used by the active storefront UI.                                                                                                                                                                |
| `src/components/experience/StoreProductDetail.tsx`      | Unused wrapper around the shared product page; no additional demo dataset.                                                                                                                                                                                                     |

## 13. Documentation and templates, not customer-facing demo content

- `README.md` still has the Lovable starter introduction and `<this-repository-url>` / `<repository-name>` setup placeholders.
- `.env.example` deliberately has empty secret values. Example domains and `team@example.com` in handoff instructions are documentation examples, not working store/client credentials.
- `docs/SHOPIFY_INTEGRATION.md` has been updated to document the current CSV/live boundary; its earlier sample-fallback description has been superseded. `docs/shopify-and-admin.md` and the [reference-pack index](README.md) describe the current handoff.
- `docs/CLIENT_BRIEF.md` retains the approved design direction with an updated status note. Review README files/screenshots in `docs/wireframe-review`, `product-review`, `client-review`, `design-review`, `alcove-experiment` document historical prototype states; statements that all products are samples predate CSV import.
- Test fixtures and assertions under `src/**/*.test.*` and `scripts/import-shopify-products.test.mjs` deliberately contain made-up values; they are not customer-facing content.
- Search-field hints such as Search products, empty required fields, loading skeletons, 404/error messages and normal CSS `placeholder` selectors are functional UI, not business-data placeholders.

## Appendix A. Every legacy demo product

All other fields in these records are also demo: descriptions, dimensions, materials, installation, finish/size availability, photograph associations and merchandising flags. Exact records: [reference-products.json](../src/data/reference-products.json) and [products.ts](../src/data/products.ts).

| Handle          | Demo display name                 | Demo INR price | Demo NRC |
| --------------- | --------------------------------- | -------------- | -------- |
| slat-panel-2400 | Aalto Slat 2400 / Slat Panel 2400 | 14,900         | 0.85     |
| felt-tile-600   | Felt Tile 600                     | 4,200          | 0.90     |
| qrd-diffuser-7  | QRD Diffuser 7                    | 9,800          | —        |
| skyline-2d      | Skyline 2D                        | 11,500         | —        |
| corner-trap-pro | Corner Trap Pro                   | 12,400         | 1.00     |
| membrane-trap   | Membrane Trap                     | 18,900         | —        |
| edge-panel-1200 | Edge Panel 1200                   | 6,900          | 0.80     |
| studio-kit-s    | Studio Kit S                      | 48,000         | —        |
| studio-kit-m    | Studio Kit M                      | 82,000         | —        |
| rack-6u         | Desk Rack 6U                      | 16,500         | —        |

## Appendix B. Every imported product's missing structured content

Generated from `src/data/shopify-products.json` at audit time. Missing means the normalized field is empty, not necessarily that the information is absent everywhere in the original export. Every product below also needs live stock/variant IDs, confirmed currency and collection mapping; none has an imported technical-download link. A dash means the four audited content fields are populated, not that the product is fully approved.

| Imported product                                                                                                           | Missing normalized content                           |
| -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| Low-Frequency Absorption Timberslat Soffit Bass Traps                                                                      | Dimensions; Material; Installation                   |
| Teak Wood Guitar Picks \| Handcrafted Wooden Plectrums for Acoustic, Electric & Bass Guitars For Beginners & Professionals | Dimensions; Material; Installation                   |
| Non-Woven Soundproofing Blanket for Noise Reduction, Acoustic Curtains & Blinds, 1 Meter (Black )                          | Dimensions; Material; Installation                   |
| StudioPad™ Mini, Music Studio Table                                                                                        | Dimensions; Material; Installation                   |
| Timber Acoustics StudioPad™ Pro, Music Studio Table                                                                        | Dimensions; Material; Installation                   |
| Printed Acoustic Wall Panels Set of 3                                                                                      | Dimensions; Material; Installation                   |
| StudioPad Riser- Height Adjustable Music Production Desk                                                                   | Dimensions; Material; Installation                   |
| AcousTiles, 1' x 1' Acoustic Wall Tiles (Set of 8 )                                                                        | Dimensions; Material; Installation                   |
| High Density Foam Seal Tape \| 12mm x 6mm x 5M                                                                             | Dimensions; Material; Installation                   |
| Audio Gear Rack                                                                                                            | Dimensions; Material; Installation                   |
| Printed Rockwool Acoustic Wall Panels                                                                                      | Dimensions; Material; Installation                   |
| Starlit Acoustic Panel \| Fiber Optic Starry Sound Absorbing Wall & Ceiling Panel                                          | Dimensions; Material; Installation                   |
| Wooden Frame Corner Bass Traps 2' x 4' x 5" [Set of 2]                                                                     | Dimensions; Material; Installation                   |
| Noise Absorber Acoustic Art Wall Panels for Gaming Room, 48”x32”                                                           | Dimensions; Material; Installation                   |
| Noise Absorber Acoustic Art Wall Panels for for Music Studio, 48”x32”                                                      | Dimensions; Material; Installation                   |
| Noise Absorber Acoustic Art Wall Panels for Home, 48”x32”                                                                  | Dimensions; Material; Installation                   |
| Timber Acoustics® Soundproofing Acoustic Panels \| Noise Absorber for Home                                                 | Dimensions; Material; Installation                   |
| Wooden Frame Ceiling Absorption Panels [Set of 2]                                                                          | ?                                                    |
| Guitar Chair with Footrest for Studio & On-Stage Performance                                                               | ?                                                    |
| Abfuser Mini Acoustic Panels (1ft x 1ft x 2in), Set of 4                                                                   | ?                                                    |
| Wooden Multipurpose Pegboard Wall Organizer                                                                                | ?                                                    |
| Wooden Long Neck Guitar Stand for Guitars                                                                                  | ?                                                    |
| Wooden Headphone Stand for Over Ear and On Ear Headphones                                                                  | Dimensions; Material; Installation                   |
| Multi Guitar Rack Stand                                                                                                    | ?                                                    |
| Wooden Floor Guitar Stand for Guitars                                                                                      | ?                                                    |
| Wooden Headphone Stand for Over-Ear & On-Ear Headphone                                                                     | Dimensions; Material; Installation                   |
| Stainless Steel Wall Mounting Brackets                                                                                     | Dimensions; Material; Installation                   |
| Sage Green Forest Printed Absorption Panels                                                                                | Dimensions; Material; Installation                   |
| Mute Board Acoustic Sound Absorption Panels \| 1 x 3 ft \| Set of 4                                                        | Dimensions; Material; Installation                   |
| Wooden Stands for Acoustic Panels & QRD                                                                                    | Dimensions; Material; Installation                   |
| Wire Rope Suspension Kit for Hanging Lights, Billboards, Panels \| Adjustable 1 Meter Wire Hanging Cable System            | Dimensions; Material; Installation                   |
| Acoustic Ceiling Grid Cloud for Sound Absorption                                                                           | Dimensions; Material; Installation                   |
| Premium Low Frequency Absorption Soffit Bass Traps                                                                         | Dimensions; Material; Installation                   |
| Wooden Slat Bass Traps, Low Frequency Absorption for Balanced & Clear Audio                                                | Dimensions; Material; Installation                   |
| Printed Series Ceiling Absorption Panels (2.5'x5'x3")                                                                      | Dimensions; Material; Installation                   |
| Abfuser Series Panel for Absorption & Diffusion                                                                            | ?                                                    |
| Acoustic Standing Divider Panel                                                                                            | Dimensions; Material; Installation                   |
| GOBO Portable Acoustic Panel & Room Divider                                                                                | Dimensions; Material; Installation                   |
| Personalized Acoustic Panels                                                                                               | Dimensions; Material; Installation                   |
| StudioBox™ for Music Producers & Creators                                                                                  | Dimensions; Material; Installation                   |
| Absorption Panels 1' x 4' x 1"                                                                                             | ?                                                    |
| Office Desk Partition Aluminum Clamps                                                                                      | Dimensions; Material; Installation                   |
| Intermediate Room Kit                                                                                                      | Dimensions                                           |
| Starter Room Kit                                                                                                           | Dimensions                                           |
| Item Customizations                                                                                                        | Dimensions; Material; Installation                   |
| Lavalier microphone microphone                                                                                             | Dimensions; Material; Installation                   |
| Mass Loaded Vinyl Soundproofing membrane                                                                                   | Dimensions; Material; Installation                   |
| Pyramid Acoustic Foam Sheet                                                                                                | Dimensions; Material; Installation                   |
| Rockwool Safe 'n' Silent Pro 330                                                                                           | Dimensions; Material; Installation                   |
| Acoustic Desk Divider                                                                                                      | Dimensions; Material; Installation                   |
| Wedge Foam Panels                                                                                                          | Dimensions; Material; Installation                   |
| Acoustical Fabric Jute Fabric for DIY Acoustic Panels (1 Meter)                                                            | Dimensions; Material; Installation                   |
| Turbo Acoustic Foam Sheet                                                                                                  | Dimensions; Material; Installation                   |
| HEXAGON PET Panels                                                                                                         | Dimensions; Material; Installation                   |
| Turbo Foam Panels                                                                                                          | Dimensions; Material; Installation                   |
| Pyramid Foam Panels                                                                                                        | Dimensions; Material; Installation                   |
| Sound Absorption Panels 20"x40"x3" (SET OF 2)                                                                              | ?                                                    |
| Broadband Absorbers (2' x 4' x 5") [SET OF 2]                                                                              | Dimensions                                           |
| Ceiling Absorption Panels (Set of 2)                                                                                       | ?                                                    |
| Premium Room Kit                                                                                                           | Dimensions                                           |
| Pro Room Kit                                                                                                               | Dimensions                                           |
| Basic Room Kit                                                                                                             | Dimensions                                           |
| Pinewood TimberSlat™ Panels                                                                                                | Dimensions; Material; Installation; Full description |
| BlockFuser Diffuser Panel                                                                                                  | ?                                                    |
| Timber Acoustics Tri Bass Traps ( Set of 2)                                                                                | Dimensions; Material; Installation                   |
| Timber Acoustics Wooden Foam Panels                                                                                        | Dimensions; Material; Installation                   |
| Timber Acoustics Foldable Isolation Booth                                                                                  | Dimensions; Material; Installation                   |
| Wooden Frame Soundproofing Acoustic Panels [SET OF 3]                                                                      | ?                                                    |
| Timber Acoustics Corner Bass Traps [SET OF 2]                                                                              | Dimensions; Material; Installation                   |
| Sound Absorption Panels 2' x 4' x 1" [SET OF 4]                                                                            | ?                                                    |
| Timber Acoustics QRD Sound Diffusers                                                                                       | Dimensions; Material; Installation                   |
| Timber Acoustics Bevelled Edge Corner Bass Traps (2' x 4' x 5") [SET OF 2]                                                 | Dimensions; Material; Installation                   |
| Timber Acoustics Tube Traps                                                                                                | Dimensions; Material; Installation                   |
| Timber Acoustics Skyline Sound Diffuser (60 X 60 X 12 cm)                                                                  | Dimensions; Material; Installation                   |
| X14 Control Absorption Panels, 1'x4'x3" [SET OF 3]                                                                         | ?                                                    |
| Sound Absorption Panels 2' x 4' x 2" [SET OF 2]                                                                            | ?                                                    |
| Timber Acoustics Bevelled Edge Sound Absorption Panels [SET OF 3]                                                          | Dimensions; Material; Installation                   |
| Sound Absorption Panels (2' x 4' x 3") [SET OF 3]                                                                          | ?                                                    |
| Timber Acoustics Absorb Blocks 2' x 2' x 2" [SET OF 4]                                                                     | Dimensions; Material; Installation                   |
