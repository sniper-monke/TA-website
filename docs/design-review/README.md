# Brand-led design review

The brand book and client brief in `public/images/` governed this pass. `DESIGN_DIRECTION.md` records the source hierarchy and design decisions.

## Review images

- [Desktop - 1440 x 1000](desktop.png)
- [Wide desktop - 1920 x 1080](wide-desktop.png)
- [Tablet - 768 x 1024](tablet.png)
- [Mobile - 390 x 844](mobile.png)
- [Small mobile - 320 x 700](small-mobile.png)
- [Live hero motion preview](hero-motion.gif)
- [Inside the build](inside-build.png)
- [No-WebGL architectural fallback](fallback.png)
- [Scroll-led acoustic study](acoustic-study.png)

## What changed

- Original sound-wave wordmark from the brand book, warm off-white/beige surfaces, navy type and burnt-orange accents. Small text and active controls use a darker orange tint for contrast.
- Bold, oversized Raleway in the revised hero, with lighter headings on interior pages. Local Quicksand body fonts follow the brand book's fallback guidance; Gotham font files were not supplied.
- Interactive timber finishes and an architectural backing reveal in the hero. The acoustic study advances through absorption, diffusion and low-frequency balance on larger screens; it remains a tabbed section on smaller screens and with reduced motion.
- Product exploration, catalogue filters and room configuration remain. The room atelier adds a finish-study view and supports home theatre, listening room, studio and workplace presets.
- Shared page introductions, header and footer, responsive controls, and redirects for older collection/configurator URLs.

## Listening alcove revision

Commit `492dfe2` replaces the hero slab with a timber-ribbed listening alcove, felt backing, a rust-coloured seat, warm lighting and ground shadows. Cursor movement adjusts the perspective; ambient light travels across the ribs. The headline, live grain field, studio card and badge frame the architecture. Three.js was already installed; no dependency was added. An inline architectural illustration supplies the initial server render and the unavailable-WebGL state.

The revised hero was reviewed at all five widths shown above. Browser checks verified actual rendered timber recolouring and rib separation, keyboard activation, stable scene pixels after pause, WebGL frame-loop suspension/resumption, offscreen suspension, reduced motion on first load and live preference changes, both CTA destinations and scene cleanup, mobile navigation and Escape. WebGL context creation was deliberately disabled to verify the fallback illustration and its finish/build controls. Normal browser operation showed no console errors, hydration errors, runtime exceptions, broken images or horizontal overflow.

The existing SSR-consistent preference hook and hydration regression test remain in use. Shadows are cached during ambient motion; the scene stops drawing when hidden/offscreen and releases its resources on navigation. Reduced-motion controls update the scene directly without interpolating the geometry.

The images show the current alcove hero. The broader route audit below records the preceding brand redesign; this revision rechecked the homepage and its catalogue/room-builder destinations.

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
