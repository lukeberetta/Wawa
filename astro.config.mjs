// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
// Static brand site. Cloudflare Pages target. Commerce islands added phase 2.
export default defineConfig({
  site: 'https://wawawave.com',
  // Mostly static; switch to output:'server' + adapter when cart island lands.
  output: 'static',
  // The /products shop page with its discipline filter replaced the standalone
  // discipline listing pages — keep the old URLs alive by redirecting each to
  // the equivalent filtered shop view.
  redirects: {
    '/products/surf': '/products?discipline=surf',
    '/products/foil': '/products?discipline=foil',
    '/products/kite': '/products?discipline=kite',
    '/products/skate': '/products?discipline=skate',
    '/products/body-belly': '/products?discipline=body-belly',
    '/products/accessories': '/products?discipline=accessories',
  },
});
