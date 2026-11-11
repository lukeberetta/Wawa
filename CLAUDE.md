# Wawa

Astro static site for Wawa Surfboards. Deployed on Cloudflare (builds from `main`).

## Workflow

- **Work directly on `main`.** Do not create feature branches for this project.
- Commit and push to `main` when asked — pushing `main` is what triggers the Cloudflare production deploy.

## Images

- Photos live in `public/img/**` as `.webp`. After adding or replacing one, run `npm run images` — it writes `-480`/`-800`/`-1200` cuts beside the original (skips up-to-date ones). Commit the cuts.
- Pass any `/img/...webp` through `srcset()` from `src/lib/img.ts` with a `sizes` that matches the slot. `src` stays the original (Shopify CSV, JSON-LD and OG use it).
- `/img/*` is cached 30 days (`public/_headers`). Give a replaced photo a **new filename**, or returning visitors may see the old one.
- ProductCard's hover (back) image ships as `data-src`/`data-srcset`; `Motion.astro` promotes it on hover-capable devices only, so phones never download it.
- After `scripts/recolor-plates.mjs`, re-run `npm run images`.

## Motion

- No scroll reveals or entrance animations — not on sections, cards, copy or hero headlines. The old `.fade-in` system was removed (2026-11-11) after trying slide, soft-slow and blur-in variants: blanket reveals read as generic template motion, and even hero-only ones didn't feel right. Content is simply there. Don't reintroduce without asking.

## URLs

- Build is `build.format: 'file'` + `trailingSlash: 'never'`: `/products` serves `products.html` directly; `/products/` 308s to `/products`.
- Write internal links slashless. Canonicals and schema URLs go through `pagePath()`/`abs()` in `src/lib/schema.ts` (strips `.html` and trailing slash) — don't use raw `Astro.url.pathname` for a public URL.
- Test routing/headers like production: `npm run build && npx wrangler@4 pages dev dist`.
