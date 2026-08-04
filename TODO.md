# Launch TODO — 100% customer-ready

## Blocking (customers hit these today)

- [ ] **Real prices.** 7 accessories still at R999 placeholder (`src/data/products.ts:554–695`). Customers can currently buy at wrong prices.
- [ ] **Activate Yoco on Shopify checkout.** Checkout is live but payments won't capture until Yoco is enabled.
- [ ] **Product photography — 23 products still `soon()` placeholders** (`src/data/products.ts`): all guns/eggs/models, foilboards, kiteboards, cruiser, paipo, handslide, and every accessory. Only Classic Fish, Long Fish, alaia, bodyboard have real shots.
- [ ] **Cart line thumbnails** — `Cart.astro:340` still renders a `.wf-ph` box instead of the product image.
- [ ] **Product page gallery fallback** — `[handle].astro:87` shows a grey placeholder slide for imageless products; decide on a branded "photos coming" treatment or hide.

## Wireframe imagery still in place (`.wf-ph`)

- [x] Cafe page: hero + 2 gallery slots — real photography in
- [ ] Contact page: 1 image (`contact.astro:23`)
- [ ] Story page: 2 images (`story.astro:43,121`)
- [ ] Video thumbnails: `VideoCard.astro:10` — real poster frames instead of placeholder

## Content migration from old 2012 site (archived in ~/Downloads)

- [ ] Product copy for boards that had it on the old site
- [ ] Board care notes page
- [ ] Stockists page (zero mentions of "stockist" or "care" in current build)

## Contact & trust

- [ ] Only contact channel is `surfboards@wawawave.com` — add phone/WhatsApp and physical address (workshop/cafe) if wanted
- [ ] Shipping & returns policy page (required for e-commerce trust; link from cart/checkout)
- [ ] Terms & privacy policy pages

## Nice-to-have before calling it done

- [ ] Analytics (none installed — no gtag/plausible/umami found)
- [ ] Test full purchase end-to-end on wawawave.com once Yoco is live (mobile Safari + desktop)
- [ ] 404 page check
- [ ] Lighthouse/perf pass after real images land (webp sizes, lazy-loading)
