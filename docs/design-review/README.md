# Brand-led design review

The brand book and client brief in `public/images/` governed this pass. `DESIGN_DIRECTION.md` records the source hierarchy and design decisions.

## Review images

- [Desktop - 1440 x 1000](desktop.png)
- [Wide desktop - 1920 x 1080](wide-desktop.png)
- [Tablet - 768 x 1024](tablet.png)
- [Mobile - 390 x 844](mobile.png)
- [Small mobile - 320 x 700](small-mobile.png)
- [Live hero motion preview](hero-motion.gif)
- [Scroll-led acoustic study](acoustic-study.png)

## What changed

- Original sound-wave wordmark from the brand book, warm off-white/beige surfaces, navy type and burnt-orange accents. Small text and active controls use a darker orange tint for contrast.
- Bold, oversized Raleway in the revised hero, with lighter headings on interior pages. Local Quicksand body fonts follow the brand book's fallback guidance; Gotham font files were not supplied.
- Interactive timber finishes and separated material layers. The acoustic study advances through absorption, diffusion and low-frequency balance on larger screens; it remains a tabbed section on smaller screens and with reduced motion.
- Product exploration, catalogue filters and room configuration remain. The room atelier adds a finish-study view and supports home theatre, listening room, studio and workplace presets.
- Shared page introductions, header and footer, responsive controls, and redirects for older collection/configurator URLs.

## Kinetic hero revision

The latest feedback asked for more futuristic character and moving background patterns. Commit `b2cf41d` introduces “SOUND. SHAPED.”, travelling timber-slat motion, pointer tilt, a live wood-grain canvas, a studio-photo ticket and a navy finish/layer control band. Supporting SVG patterns also move subtly. No additional animation dependency was needed.

The revised hero was reviewed at all five widths shown above. Browser checks verified canvas evolution, product tilt, finish selection, actual layer separation, pause/resume, offscreen canvas suspension, reduced motion on first load and live preference changes, both CTA destinations, mobile navigation and Escape. Canvas snapshots remain identical when paused or reduced; CSS animations also pause. No runtime exceptions, broken images or horizontal page overflow were found.

Follow-up `76cc28e` adds SSR-consistent motion preferences and a hydration regression test. Clean normal and reduced-motion loads of the homepage, catalogue and room builder were checked for hydration errors, console errors and runtime exceptions; none remained.

The images show the current hero. The broader route audit below records the preceding brand redesign; this revision rechecked the homepage and the catalogue/room-builder destinations affected by its links.

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
- `npm test`: 4 tests passed across 3 files.
- `npm run build`: passed.
- Targeted ESLint for the hero revision: passed.
- Repository-wide lint has legacy formatting errors outside this pass. Existing user edits in `src/styles.css` and `src/components/site/StoryPanel.tsx` were preserved.

The sample catalogue, indicative pricing and illustrative project labels remain visible. Enquiry delivery and team authentication retain the existing preview behavior; this pass does not connect a production backend.
