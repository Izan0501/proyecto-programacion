# Los Amigos Bar

Landing page for "Los Amigos Bar" (San Miguel de Tucumán): hero, about, cocktail/food menu, gallery, upcoming events, reservations/booking, customer reviews, and a contact form.

Static site — plain HTML, CSS and vanilla JS, no build step, no dependencies to install.

## Running it locally

Just a static site, so any local server works. From `client/`:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Opening `index.html` directly (`file://`) also works, since nothing here depends on a server (no fetch calls, no CORS-sensitive assets).

## Project structure

```
client/
├── index.html
├── css/
│   ├── base/         # tokens, reset, global element styles, shared keyframes
│   ├── layout/        # page chrome: header, navbar, footer, page skeleton
│   ├── components/    # reusable widgets: buttons, forms, cards, carousel...
│   └── sections/      # one-off page sections: hero, about, gallery, events...
├── js/
│   └── carousel.js    # image carousel (prev/next + dots), no external deps
└── img/
```

CSS is organized by scope, following common architecture conventions (ITCSS/7-1 style):

- **base/** — design tokens (`variables.css`), reset, base element styles, shared `@keyframes` (`animations.css`). Loaded first; everything else builds on it.
- **layout/** — structural chrome that wraps the whole page and appears once: header, navbar, footer, overall page layout.
- **components/** — self-contained, reusable UI pieces that could appear more than once or be reused elsewhere: buttons, form fields, the booking card, the reviews list, the carousel.
- **sections/** — styles for a specific, single-instance section of the page (hero, about, menu, gallery, events, contact). These generally aren't reused elsewhere on the page.

`index.html` links each file individually (no CSS bundler/preprocessor), grouped under `<!-- comments -->` roughly matching this same structure.

## Scroll parallax

Several sections have a subtle scroll-linked parallax/reveal effect, implemented in pure CSS via `animation-timeline: view()` — the animation's progress is driven directly by the element's scroll position, running on the compositor thread (no JS scroll listeners, no layout thrash).

- **Continuous drift**: hero text, the about-page image, and card images (menu, events, carousel) shift a little as they scroll past.
- **Entry reveal**: gallery images, review cards, the booking card/reservations list, and the contact form fade + rise into place once as they first enter the viewport.

Notes for anyone touching this:

- Every rule is wrapped in `@supports (animation-timeline: view()) { @media (prefers-reduced-motion: no-preference) { ... } }`. Browsers without scroll-driven-animations support (and users with reduced motion enabled) just get the static layout — nothing breaks, the effect simply doesn't run.
- Keyframes use the individual `translate`/`scale` properties (not the `transform` shorthand), so the parallax can run on an element that already has its own `:hover`/`:active` `transform` (e.g. `.carta-item`, `.events__item`) without either one overwriting the other.
- Any image driven by a continuous drift is deliberately oversized (`scale`) so the drift never uncovers an edge inside its card's `overflow: hidden`. If you increase a drift keyframe's amplitude in `css/base/animations.css`, bump the matching `scale` too (needed scale ≈ `1 + 2 × drift%`), or you'll crop the image too aggressively / risk revealing an edge.
- Shared keyframes live in `css/base/animations.css`; each section/component file only sets `animation-name`/`animation-range`/`scale` against its own selectors.

## Known issues / follow-ups

- **Contact form**: in the reservation form (`#contacto-reservas`), the `.row-group` div meant to hold the date/time fields is empty and its closing tag is missing — the date and time inputs aren't in the markup. Needs a look before that form is considered functional.
- **Duplicate design tokens**: `css/base/variables.css`, `css/base/base.css`, `css/base/main.css`, and `css/layout/layout.css` each define their own `:root` custom properties (different names/values), left over from merging separate branches. Works today because each file's own selectors consistently use its own tokens, but it should eventually be consolidated into a single token set.
- **Orphaned files**: `css/sections/hero.css` and `css/sections/reservas.css` exist but aren't linked from `index.html` — superseded by rules living in `css/base/main.css` and the booking/contact sections respectively. `css/components/formularios.css`, `css/sections/secciones.css`, and `css/sections/servicios.css` are empty placeholders, also unlinked.
