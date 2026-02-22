# Catia Castelbranco — Photographer Website

Minimal, professional photography portfolio website.

## Structure

```
catiacastelbranco/
├── index.html          # Main page (single-page layout)
├── style.css           # All styles — minimal, film-grain aesthetic
├── script.js           # Interactions: nav, lightbox, gallery filter, form
└── assets/
    ├── hero.jpg        # Hero full-screen image (replace with actual photo)
    ├── catia.jpg       # About section portrait
    └── portfolio/
        ├── 01.jpg – 09.jpg   # Portfolio gallery images
```

## Sections

1. **Hero** — Full-screen image with name overlay and scroll cue
2. **Work** — Filterable grid gallery with lightbox (Portrait / Editorial / Wedding / Landscape)
3. **About** — Bio, portrait photo, stats
4. **Services** — 4 service cards with hover state
5. **Testimonials** — Auto-advancing slider
6. **Contact** — Text + contact form
7. **Footer**

## To customise

- Replace all placeholder images in `assets/`
- Update bio text, stats, services pricing in `index.html`
- Update email, phone, social links in `index.html`
- For the contact form to actually send email, connect it to [Formspree](https://formspree.io) or [Netlify Forms](https://www.netlify.com/products/forms/) — replace the `setTimeout` in `script.js` with a real `fetch` POST

## Image guidelines

| File | Recommended size | Notes |
|------|-----------------|-------|
| `hero.jpg` | 2400 × 1600px | Portrait or landscape, dark tones work well |
| `catia.jpg` | 900 × 1200px | 3:4 portrait crop |
| `portfolio/01–09.jpg` | 1600 × 1200px | Mix of orientations |

Optimise images with [Squoosh](https://squoosh.app) before uploading.
