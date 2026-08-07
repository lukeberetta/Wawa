// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
// Static brand site. Cloudflare Pages target. Commerce islands added phase 2.
export default defineConfig({
  site: 'https://wawawave.com',
  // Mostly static; switch to output:'server' + adapter when cart island lands.
  output: 'static',
  // /sitemap-index.xml + /sitemap-0.xml, referenced from public/robots.txt.
  // The old 2012 WordPress URLs are still in Google's index (they surface as
  // stale sitelinks); a sitemap is what gets the current set recrawled.
  integrations: [
    sitemap({
      // The redirect stubs below are not content — they'd list the same pages
      // twice under URLs that immediately bounce.
      filter: (page) => !/\/products\/(surf|foil|kite|skate|body-belly|accessories)\/?$/.test(page),
      serialize: (item) => ({
        ...item,
        // Home and shop are the pages worth recrawling most often; the story
        // and press pages are essentially static once published.
        changefreq: /\/(products)?$/.test(new URL(item.url).pathname) ? 'weekly' : 'monthly',
        priority: new URL(item.url).pathname === '/' ? 1.0 : 0.7,
      }),
    }),
  ],
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
