# Reference analysis

Reference inspected: https://ta-website-revamp--8mgqxtz9.preview.emergentagent.com/ (30 October 2026). The reference serves a React application and exposes a source map containing the original components and CSS. Its catalogue and project API endpoints respond with sample data.

## Routes

The public routes are `/`, `/products`, `/products/:slug`, `/build-a-room`, `/story`, `/basket`, `/projects`, `/projects/:slug`, `/guides`, and `/guides/:slug`. The reference also contains authenticated admin routes under `/admin`. Navigation includes Home, All Products, Build a Room, Spaces, Room Guides, Story and an enquiry basket.

## Visual system

The site uses cream `#f8f4ee`, navy `#153a54`, rust `#bf673b`, teal `#248082`, and fine translucent navy rules. Raleway is used for headings, Playfair Display for italic emphasis, and Montserrat for body text. The header is 76px high and becomes translucent on scroll. Desktop content has a 1500px maximum width and 40px side padding.

The homepage starts with a full-width photographic hero of a yellow chair against timber slats, with the heading “Less noise. More feeling.” It continues with a two-column acoustic principles section with selectable Absorb, Diffuse and Trap tabs, an editorial marquee, product collection, spaces, room guides and a room atelier invitation. The reference has scroll reveal, hero entrance and parallax animations, and a responsive navigation menu.

## Data and assets

The five editorial images are `/images/timber-hero.webp`, `/images/timber-detail.webp`, `/images/timber-theatre.webp`, `/images/timber-studio.webp`, and `/images/timber-office.webp`. The reference API provides sample products and illustrative projects; the page explicitly labels these as sample content. Product images include externally hosted photographs.

## Verification limitations

The supplied URL is accessible outside the network sandbox; the browsing service could not open it. The reference source map was accessible. Screenshot and interactive inspection still need to be completed at desktop, tablet and mobile sizes.

## Comparison refinements

Desktop, tablet and mobile homepage hero screenshots were compared with the reference. A desktop catalogue comparison identified a display-font conflict and encoding artifacts; both were corrected. The reference fonts and catalogue/project photographs are now served locally. The original catalogue slider uses two independently adjustable handles.

## Current hero direction

The subsequent brand-book redesign and latest user feedback supersede exact replication for the hero. The supplied screenshot shows the preceding thin “Sound, in better shape.” composition; the user requested a bolder futuristic treatment and live patterns. The revision keeps the book's Raleway, navy, burnt orange and wood-grain language while introducing uppercase poster-scale type, animated material geometry and a pointer-responsive contour canvas. It reuses the local studio photograph and existing finish/layer controls. Current screenshots, motion preview and browser findings are in `docs/design-review/README.md`; `DESIGN_DIRECTION.md` records the source hierarchy and decisions.
