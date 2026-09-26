# FORMA — Objects for living

A responsive furniture concept store with an editorial layout, product category filters, accessible product dialogs, a shopping bag with quantity controls, and a simulated checkout. Prices and product names are fictional. No payment is collected or order sent. Cart state is in memory and resets on refresh.

The interface is fully animated: an intro loader with a counter, smooth scrolling (Lenis), a full-screen hero whose headline rises letter by letter and which shrinks into a card as you scroll, a marquee that reacts to scroll speed, a statement whose words light up with product photos opening between them, a pinned horizontal lookbook with image parallax, a zoom scene where a small window grows to full screen as the title splits apart, 3D-tilt product cards, magnetic buttons, a custom cursor on desktop, animated dialogs and cart drawer, and a fly-to-bag effect. Visitors who prefer reduced motion, or whose browser fails to load the libraries, get a clean static layout with every shopping feature intact.

## Run locally

Requires Python 3. No installation or build step is needed.

```sh
python3 -m http.server 4173 --directory dist
```

Open http://localhost:4173. The `dist` folder is the complete deployable site. GitHub Actions publishes it to GitHub Pages on pushes to `main`. It also deploys as-is to any static host, such as Cloudflare Pages (no build command, output directory `dist`).

## Files

- `dist/index.html`: semantic page and native dialogs
- `dist/styles.css`: responsive design, animations, motion preferences, typography
- `dist/app.js`: catalog, filters, cart, demo checkout and scroll/pointer animations
- `dist/assets/`: locally hosted photography
- `dist/vendor/`: self-hosted [GSAP 3.15](https://gsap.com) with ScrollTrigger ([standard license](https://gsap.com/standard-license)) and [Lenis 1.3](https://github.com/darkroomengineering/lenis) (MIT)

The optional `list_products` WebMCP tool is feature-detected; unsupported browsers retain all shopping interactions. Fonts load from Google Fonts with system fallbacks.

## Photography

Images are illustrative, not representations of products sold by an actual business. Downloaded from Unsplash under the [Unsplash License](https://unsplash.com/license):

- [Clay Banks — cozy armchair](https://unsplash.com/photos/cozy-armchair-by-a-window-with-a-garden-view-CjmHORCoIfw)
- [TheStandingDesk — white table lamp](https://unsplash.com/photos/white-table-lamp-on-table-PhOABIwQrRE)
- [Tom Crew — ceramic vessels](https://unsplash.com/photos/white-ceramic-vase-lot-JT3W6P1mYtU)
