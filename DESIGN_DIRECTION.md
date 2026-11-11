# Design direction - material in motion

The current client pass retains the listening alcove within a warmer, calmer design. Acoustic products and outcomes must be immediately clear; the site must not read primarily as an architecture practice. The brand book governs identity, palette and typography. Current decisions and source distinctions are recorded in `docs/CLIENT_BRIEF.md`; the user’s frontend-first scope supersedes earlier Shopify implementation assumptions.

## Source hierarchy

The current user decisions in `docs/CLIENT_BRIEF.md` and the newer `Timber-Acoustics-Website-1.docx` supersede the older experiment directions below. The client’s acoustic focus governs positioning; earlier architecture-first and Teenage Engineering references are historical context.

1. `public/images/Timber Acoustics Brand Book.pdf` (26 pages): authority for identity, colour, type and brand patterns.
2. `public/images/Timber-Acoustics-Website-Brief-Short.docx`: client requirements and the two screenshots of the earlier demo.
3. Commit `fb98ae259a7045a618bc43ae7fdc31411f680bb3`: earlier implementation context, especially the immersive acoustic journey, catalogue and room builder.
4. The new inspiration references inform composition and motion, while the Timber identity remains authoritative.

## Brand requirements

- Light, warm beige/off-white surfaces. Primary navy `#153A54`, burnt orange `#BF673B`, beige `#E9DCC9`. Supporting mustard `#F3A228`, teal `#248082`, grey-black `#282828`, white `#E2E2E2`.
- The official mark is the vertical sound-wave/TA symbol. The logo SVGs are extracted from the supplied book, with their proportions preserved.
- Raleway for headings. The hero restores weight 300, sentence case and the earlier responsive scale, with orange italic Playfair for “shape.” Interior pages retain lighter headings.
- Gotham is named for body copy; the book also names Quicksand as a fallback. Gotham font files were not supplied, so use the book's available fallback rather than extracting an incomplete embedded font.
- Organic wood-grain contours are a supporting pattern, distinct from the logo.
- Keep product exploration, catalogue search/filter/price controls and the room configurator. Room choices include home theatre, listening room, studio and office.
- Keep any trust/partner typography small. Do not invent clients or claims.

## Reference observations

- [Teenage Engineering](https://teenage.engineering/): product-led composition, precise functional labels, industrial geometry, generous empty space and restrained colour controls.
- [OP-XY showcase](https://opxy.mengto.here.now/): dimensional product studies, motion tied to product structure, compact specification labels and large but light type. Translate this into acoustic material rather than copying the synthesizer UI.
- [Alt Shift](https://altshift.agency/): strong editorial pacing, shifts of scale and art-directed transitions. Borrow its confidence and choreography while respecting the Timber palette and identity.

## Implementation

Create a light material-led homepage with a bold kinetic opening, an acoustic-principle study, a retained product collection, illustrative spaces and room presets. Carry the shared brand-correct header/footer, precise grid and consistent controls through existing routes. Use reduced-motion fallbacks and keep browser-only rendering outside SSR. Keep sample content labelled.

## Applied design and review

The shipped pass uses the official brand-book wordmark, local Raleway and Quicksand, the specified navy/orange/beige palette, and a darker orange tint for small text and active states. The lower-page material studies use CSS geometry; the hero's architectural scene uses client-rendered Three.js and timber texture sampled from the existing local photograph. The acoustic sequence uses native sticky layout and Framer Motion with reduced-motion and smaller-screen fallbacks. Review images and the route/interaction audit are recorded in `docs/design-review/README.md`.

The current hero pairs “Sound, in better shape.” with a sculptural listening alcove: timber ribs curve around a felt-lined interior, a rust-coloured seat and warm light. The geometry stays grounded while lighting travels and the camera responds gently to the pointer. Finish swatches change the timber, and “Inside the build” opens the front ribs to expose the backing. The navy control band, studio photograph, badge and pointer-responsive wood-grain field remain. A server-rendered SVG illustration covers loading and unavailable-WebGL states, with working finish and build controls. Pause, live reduced-motion preferences and offscreen/hidden rendering suspension apply to the scene. Static shadow maps are reused during ambient motion; all geometry, materials, textures and observers are disposed on navigation. The alcove is explicitly labelled as an illustrative listening space.
