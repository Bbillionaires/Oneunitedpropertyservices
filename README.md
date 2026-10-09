# One United Property Services — Website

Marketing site for **One United Property Services** (*A One United Enterprise Company*) — OneUnitedPropertyServices.com.

Built with [Astro](https://astro.build): static HTML output, very little client JavaScript, and responsive WebP images generated at build time.

## Quick start

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # static site → dist/
npm run preview   # serve the production build
npm run check     # type-check .astro / .ts files
```

Requires Node 22.12+. `dist/` can be deployed to any static host (Netlify, Vercel, Cloudflare Pages, S3, etc.).

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Homepage: hero, services, before/after, property types, why One United, programs, quote form, service area, portfolio CTA |
| `/services/` and `/services/<slug>/` | Services overview and one page per service (generated from data) |
| `/property-types/` | Property types served |
| `/before-after/` | Gallery of before/after comparisons |
| `/about/` | Company overview (includes a placeholder for the company story) |
| `/service-area/` | Jacksonville & Northeast Florida |
| `/contact/` | Contact details (placeholders) + quote form |
| `/quote/` | Multi-step quote request |
| `/privacy/`, `/terms/` | **Draft** legal templates — review with counsel before launch |

## Editing content

Content lives in `src/data/`, separate from components:

| File | Controls |
| --- | --- |
| `site.ts` | Business name, tagline, phone/email/address/hours, social links |
| `services.ts` | Services: copy, scope, images, SEO. **Add a service by adding an object**: it shows up on the homepage, the services page, the footer, the quote form, and gets its own page |
| `propertyTypes.ts` | Property types section |
| `gallery.ts` | Before & after photos (after photos first). Only add an after photo once the grass is cut and the pavement or fence is pressure washed |
| `serviceAreas.ts` | Service markets and map markers. **Add a Florida market** by adding an entry (an example is commented in the file) |
| `programs.ts` | Service programs and the “Why One United” points |
| `quoteForm.ts` | Quote form options, conditional size fields, and upload limits |
| `navigation.ts` | Header and footer links |

## Placeholders to replace before launch

Nothing below was invented. Every missing fact is shown on the site with a visible “Placeholder” or “TBD” tag, and none of it goes into structured data.

- **Phone, email, business address, office hours:** `src/data/site.ts`. Set `value`, add an `href` (`tel:` / `mailto:`), and set `placeholder: false`. Phone and email are then added to the schema.org data automatically.
- **Social profiles:** `site.social` in `src/data/site.ts`.
- **Company story:** the placeholder block on `/about/` (`src/pages/about.astro`).
- **Photography:** the site uses **real One United photos only** (`src/assets/projects/`). There is no stock photography. Services and property types without a real photo are listed with an icon instead. To add a photo to a service, import it in `src/data/services.ts` and set `image` / `imageAlt`.
- **Before & after gallery:** `src/data/gallery.ts`. After photos lead and are larger; before photos follow, smaller and muted. There are no per-photo titles. Blur house numbers and license plates before adding photos. The caption stays generic until the client approves naming the property.
- **Legal pages:** fill in the bracketed items and have counsel review them.
- **Scope lists** in `services.ts`: confirm each item matches what the company actually offers.

## Quote form: connecting a backend

The form UI (`src/components/QuoteForm.astro` + `src/scripts/quote-form.ts`) only calls `submitQuote()` in **`src/lib/quote.ts`**.

- **No endpoint configured (current state):** submissions run in *preview mode*. The confirmation screen says plainly that the request was **not sent**, so there is no false success message.
- **Connect an endpoint:** copy `.env.example` to `.env` and set `PUBLIC_QUOTE_ENDPOINT` to any HTTPS URL that accepts `multipart/form-data`: your own API, a serverless function, a CRM webhook, or a form service (Formspree, Basin, etc.). Fields are sent as form fields and photos as repeated `photos` files. Rebuild after changing it.
- **Different integration** (e.g. a CRM SDK, JSON API, email service): change only `submitQuote()`. The `QuoteRequest` type documents the payload.

The form also supports deep links. `/quote/?program=portfolio`, `?service=painting`, and `?property=office` pre-fill those answers. It includes a honeypot field for basic spam filtering. Add server-side validation and rate limiting on whatever endpoint you connect.

## Design system

- **Tokens:** `src/styles/global.css`. Colors are charcoal/ink, white, and warm paper neutrals with a brass accent (`--accent`). `--accent-ink` and `--accent-display` are the accessible accent shades for text on light backgrounds.
- **Type:** Archivo variable (weight + width axes), self-hosted through `@fontsource-variable/archivo`, latin subset preloaded.
- **Shared components:** `SectionHeading`, `SplitText` (build-time word split for headline reveals), `PageHero`, `CtaBand`, `BeforeAfterSlider`, `Icon` (inline SVG set in `components/icons.ts`), `Logo`.

## Motion and accessibility

- Scroll reveals, word-by-word headline reveals, image wipes, parallax, counters, a scroll-linked statement, a marquee, and the hub/map diagrams all use IntersectionObserver, CSS transitions, and `requestAnimationFrame` (`src/scripts/motion.ts`). [Lenis](https://github.com/darkroomengineering/lenis) adds smooth wheel scrolling on desktop only and is lazy-loaded.
- Page transitions use native cross-document View Transitions, a progressive enhancement with no JavaScript.
- `prefers-reduced-motion` turns off reveals, parallax, smooth scrolling, marquees, and transitions. Content is only hidden for animation after a script confirms motion is allowed, so nothing stays invisible.
- Phones get lighter parallax, no smooth-scroll library, and a persistent “Request a Quote” bar.
- Keyboard and screen reader support: skip link, visible focus states, labelled form controls with inline errors (`aria-invalid` and `aria-describedby`), WAI-ARIA tabs on before/after, native range inputs on the sliders, and a focus-trapped mobile menu that closes with Esc.

## SEO

- Per-page titles, descriptions, canonical URLs, Open Graph/Twitter tags, and `public/og-image.jpg`.
- JSON-LD: `Organization` + `WebSite` on every page, `Service` on service pages, an `ItemList` of services on the homepage, and `BreadcrumbList` on interior pages.
- `@astrojs/sitemap` generates `sitemap-index.xml`, and `public/robots.txt` points to it.
- The canonical origin is set in `astro.config.mjs` (`site`).
