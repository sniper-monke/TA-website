# Homepage wireframe alignment — 11 November 2026

The subsequent [interactive alcove experiment](../alcove-experiment/README.md) has a separate checkpoint, comparison instructions and current hero screenshots.

The homepage now follows the user-approved reference structure:

1. Shared header with a product menu grouped by acoustic treatment, studio furniture and space.
2. Retained listening-alcove hero with Explore Products and Book a Consultation.
3. Compact trusted-partner strip, with explicitly labelled logo placeholders until approved names arrive.
4. Our Approach as text alongside a material photograph.
5. Four categories: Absorption, Diffusion, Bass Management, Studio Furniture & Racks.
6. Featured project as a full-width image banner, clearly labelled illustrative.
7. More Projects and Explore Spaces together: two project cards and four space links.
8. Compact consultation banner.
9. Shared light footer with product, space and company columns.

The retained alcove replaces the reference slideshow. No announcement, account, social or policy controls were invented without content or working destinations. The full catalogue and room builder remain accessible through navigation, while their additional homepage showcases have been removed.

## Screenshots

- [Full desktop homepage](desktop-full.png)
- [Desktop hero](desktop.png)
- [Grouped product menu](menu.png)
- [Projects, spaces, consultation and footer](projects-spaces.png)
- [Full mobile homepage](mobile-full.png)
- [Tablet](tablet.png), [mobile](mobile.png), [small mobile](small-mobile.png)

## Verification

Changed-source ESLint, strict TypeScript, all 10 existing tests and the production build pass. Browser checks at 1440, 768, 390 and 320px found no horizontal overflow or broken images. The observed section order matches the reference; there are four category cards, two more-project cards and four space links. Desktop WebGL remains available; tablet and phone loads use the interactive SVG and make no Three.js request for the hero.

Hero CTA destinations, the approach anchor, grouped-menu opening/Escape and mobile menu/space links were checked. No runtime exceptions or console errors were observed. Current projects, products and imagery remain preview content; real partner names and assets are still pending. Shopify purchases and enquiry delivery remain unconnected, as agreed. No push or deployment was performed.
