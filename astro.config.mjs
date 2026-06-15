// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
// Static brand site. Cloudflare Pages target. Commerce islands added phase 2.
export default defineConfig({
  site: 'https://wawa.lukeberetta.com',
  // Mostly static; switch to output:'server' + adapter when cart island lands.
  output: 'static',
});
