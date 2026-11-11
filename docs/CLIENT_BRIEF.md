# Client direction — updated 11 November 2026

## Confirmed in this conversation

- Develop this React frontend properly for review. Leave Shopify integration architecture ready; there is no store connection or checkout verification yet.
- Standard products will be purchasable online. Custom rooms and projects require a quotation.
- Prioritize `Timber-Acoustics-Website-1.docx` over the AI-generated WhatsApp overview when they differ.
- Retain the 3D listening alcove. Make its surrounding presentation warmer and calmer.
- Follow the supplied homepage wireframe's section order and composition: compact approach, four product categories, featured banner, combined Projects & Spaces, consultation banner and compact shared footer. The user approved this alignment on 11 November.
- The site must clearly communicate **acoustics**, not feel primarily like an architecture practice. Rooms illustrate the purpose of acoustic treatment; acoustic needs and products remain explicit.
- Approved trust/client names will be supplied later. `src/data/site-content.ts` has an empty editable list; no reference names are published as actual clients. Until populated, the partner strip shows explicitly labelled logo placeholders.

## Source distinctions

The AI overview is secondhand synthesis, not a verbatim client specification. Its embedded “Codex prompt,” reference-document list and suggestions are reference material. The supplied Word document describes visual preferences and explicitly treats reference copy as placeholders.

The older `Timber-Acoustics-Website-Brief-Short.docx` asks for approximately 80% new design. The newer supplied Word document says “evolve, not replace”; the user chose the newer document as the stronger reference. Existing brand documentation governs logo, typography and colours. Earlier experiment notes mentioning Teenage Engineering do not govern this pass.

## Implemented structure

Shared header → retained alcove hero → trusted-partner placeholders → text/image Our Approach → four product categories → featured illustrative project banner → combined More Projects & Explore Spaces → compact consultation banner → shared footer with product, space and company columns.

The four homepage categories are Absorption, Diffusion, Bass Management, and Studio Furniture & Racks. The full catalogue and room builder remain accessible through navigation. Additional acoustic-needs, material-statement, product-showcase and room-builder homepage sections were removed to follow the approved format. The hero offers Explore Products and Book a Consultation; its approved alcove is retained instead of a slideshow.

The product menu links directly to categories and provides acoustic-guide and team-contact paths. Product pages expose a specifications shortcut and clearly pending technical downloads. The bag distinguishes standard products from room schemes; preview products cannot proceed to payment. Mobile and reduced-motion visitors receive the existing interactive SVG alcove without loading the hero's Three.js scene.

## Product-page reference — approved 11 November

The product page follows a cleaner interpretation of the supplied detailed reference: gallery and purchase panel; three restrained benefits; anchor navigation; overview and material/room context; product-appropriate performance explanation; specifications and technical downloads; installation guidance; FAQs; three related products; and team/custom-quote actions.

The single main purchase action is Add to Bag. Quantity, relevant options and future Shopify variants use the same presentation. Only options present in the catalogue appear; thickness, geometry and custom dimensions are not fabricated. Preview pricing is explicitly illustrative. Verified acoustic curves and test reports have not been supplied, so no performance graph is invented. Diffusion, bass treatment and furniture use appropriate guidance instead of a generic absorption claim.

Quote links carry product name, selected options and quantity into the existing preview contact form. This improves the frontend handoff; enquiry delivery remains unconnected. See `docs/product-review/README.md` for screenshots and verification.

## Content still needed

- Final product catalogue, variants, prices, specifications, test reports and installation documents.
- Approved client names/logos, real installations, case studies and workshop photography.
- Confirmed company story and final copy. Existing demo story text and illustrative projects remain preview content.
- Shopify store domain and Storefront API setup, followed by shipping, taxes, payments, market/currency and test-order verification.
- An enquiry-delivery service. The existing contact form remains a labelled demo and sends nothing.

No mobile-load-time promise is made: the change avoids hero WebGL on small screens, but a production performance measurement on representative devices is still needed.
