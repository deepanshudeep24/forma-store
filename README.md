# FORMA — Objects for living

A responsive furniture concept store with an editorial layout, product category filters, accessible product dialogs, a shopping bag with quantity controls, and a simulated checkout. Prices and product names are fictional. No payment is collected or order sent. Cart state is in memory and resets on refresh.

The interface is fully animated: an intro loader, a sticky glass header that hides on scroll, an auto-advancing hero slideshow with a clip-path reveal and parallax, word-by-word headline reveals, a values marquee, 3D-tilt product cards with a spotlight hover, a sliding filter pill, count-up stats, scroll-lit text, magnetic buttons, a custom cursor on desktop, animated dialogs and cart drawer, and a fly-to-bag effect. All motion is disabled when the visitor prefers reduced motion.

## Run locally

Requires Python 3. No installation or build step is needed.

```sh
python3 -m http.server 4173 --directory dist
```

Open http://localhost:4173. The `dist` folder is the complete deployable site. GitHub Actions publishes it to GitHub Pages on pushes to `main`.

## Files

- `dist/index.html`: semantic page and native dialogs
- `dist/styles.css`: responsive design, animations, motion preferences, typography
- `dist/app.js`: catalog, filters, cart, demo checkout and scroll/pointer animations
- `dist/assets/`: locally hosted photography

The optional `list_products` WebMCP tool is feature-detected; unsupported browsers retain all shopping interactions. Fonts load from Google Fonts with system fallbacks.

## Photography

Images are illustrative, not representations of products sold by an actual business. Downloaded from Unsplash under the [Unsplash License](https://unsplash.com/license):

- [Clay Banks — cozy armchair](https://unsplash.com/photos/cozy-armchair-by-a-window-with-a-garden-view-CjmHORCoIfw)
- [TheStandingDesk — white table lamp](https://unsplash.com/photos/white-table-lamp-on-table-PhOABIwQrRE)
- [Tom Crew — ceramic vessels](https://unsplash.com/photos/white-ceramic-vase-lot-JT3W6P1mYtU)
