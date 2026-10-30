# Design direction - material, made precise

## Source hierarchy

1. `public/images/Timber Acoustics Brand Book.pdf` (26 pages): authority for identity, colour, type and brand patterns.
2. `public/images/Timber-Acoustics-Website-Brief-Short.docx`: client requirements and the two screenshots of the earlier demo.
3. Commit `fb98ae259a7045a618bc43ae7fdc31411f680bb3`: earlier implementation context, especially the immersive acoustic journey, catalogue and room builder.
4. The new inspiration references inform composition and motion, while the Timber identity remains authoritative.

## Brand requirements

- Light, warm beige/off-white surfaces. Primary navy `#153A54`, burnt orange `#BF673B`, beige `#E9DCC9`. Supporting mustard `#F3A228`, teal `#248082`, grey-black `#282828`, white `#E2E2E2`.
- The official mark is the vertical sound-wave/TA symbol. The logo SVGs are extracted from the supplied book, with their proportions preserved.
- Raleway for headings, lighter and substantially smaller than the old bold demo. Playfair is an optional accent, not the dominant visual language.
- Gotham is named for body copy; the book also names Quicksand as a fallback. Gotham font files were not supplied, so use the book's available fallback rather than extracting an incomplete embedded font.
- Organic wood-grain contours are a supporting pattern, distinct from the logo.
- Keep product exploration, catalogue search/filter/price controls and the room configurator. Room choices include home theatre, listening room, studio and office.
- Keep any trust/partner typography small. Do not invent clients or claims.

## Reference observations

- [Teenage Engineering](https://teenage.engineering/): product-led composition, precise functional labels, industrial geometry, generous empty space and restrained colour controls.
- [OP-XY showcase](https://opxy.mengto.here.now/): dimensional product studies, motion tied to product structure, compact specification labels and large but light type. Translate this into acoustic material rather than copying the synthesizer UI.
- [Alt Shift](https://altshift.agency/): strong editorial pacing, shifts of scale and art-directed transitions. Borrow its confidence and choreography while respecting the client's smaller headings and light palette.

## Implementation

Create a light material-led homepage with an interactive timber panel, an acoustic-principle study, a retained product collection, illustrative spaces and room presets. Introduce a shared brand-correct header/footer and carry the precise grid, smaller type, consistent controls and technical detail through existing routes. Use reduced-motion fallbacks and keep browser-only rendering outside SSR. Keep real sample content labelled.
