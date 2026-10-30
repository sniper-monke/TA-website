# Brand-led design review

The brand book and client brief in `public/images/` governed this pass. `DESIGN_DIRECTION.md` records the source hierarchy and design decisions.

## Review images

- [Desktop - 1440 x 1000](desktop.png)
- [Tablet - 768 x 1024](tablet.png)
- [Mobile - 390 x 844](mobile.png)
- [Scroll-led acoustic study](acoustic-study.png)

## What changed

- Original sound-wave wordmark from the brand book, warm off-white/beige surfaces, navy type and burnt-orange accents. Small text and active controls use a darker orange tint for contrast.
- Raleway headings with lighter weight and smaller scale. Local Quicksand body fonts follow the brand book's fallback guidance; Gotham font files were not supplied.
- Interactive timber finishes and separated material layers. The acoustic study advances through absorption, diffusion and low-frequency balance on larger screens; it remains a tabbed section on smaller screens and with reduced motion.
- Product exploration, catalogue filters and room configuration remain. The room atelier adds a finish-study view and supports home theatre, listening room, studio and workplace presets.
- Shared page introductions, header and footer, responsive controls, and redirects for older collection/configurator URLs.

## Browser review

| Route or component                   | Viewports / checks                                                                          |
| ------------------------------------ | ------------------------------------------------------------------------------------------- |
| Home                                 | Desktop 1440 x 1000, tablet 768 x 1024, mobile 390 x 844; finishes, layers, menu and Escape |
| Acoustic study                       | Scroll chapter changes; sticky viewport containment; keyboard tabs; reduced-motion fallback |
| Catalogue                            | Desktop and mobile; category filtering, both price handles, local image loading             |
| Product detail                       | Mobile; add to enquiry and persisted basket count                                           |
| Room atelier                         | Desktop and mobile; room preset URL, finish changes and finish-study view                   |
| Spaces and project detail            | Mobile layout, image loading and runtime checks                                             |
| Guides                               | Tablet index and mobile detail                                                              |
| Story, basket, contact, team sign-in | Mobile layout, image loading and runtime checks                                             |
| Older URLs                           | `/configurator` and `/collections/timberslat` redirect to current views                     |

No browser runtime errors, broken images or horizontal page overflow were found in the reviewed routes and sizes.

## Validation

- `npx tsc --noEmit`: passed.
- `npm test`: 3 tests passed across 2 files.
- `npm run build`: passed.
- Targeted ESLint for changed source: passed; the basket context retains a Fast Refresh warning about mixed exports.
- Repository-wide lint has legacy formatting errors outside this pass. Existing user edits in `src/styles.css` and `src/components/site/StoryPanel.tsx` were preserved.

The sample catalogue, indicative pricing and illustrative project labels remain visible. Enquiry delivery and team authentication retain the existing preview behavior; this pass does not connect a production backend.
