/**
 * Build-time `srcset` for the photographs in /public/img.
 *
 * scripts/gen-image-sizes.mjs writes `name-480.webp` etc. beside each original;
 * this lists whichever of those exist, plus the original at its real width.
 * Reading the folder rather than assuming the cuts are there means a photo
 * added without re-running the script still renders — it just ships whole.
 *
 * `src` on the <img> stays the original, so Shopify, JSON-LD and share cards
 * keep pointing at the same URLs they always did.
 */
import { existsSync, openSync, readSync, closeSync } from 'node:fs';
import { join } from 'node:path';

// Keep in step with WIDTHS in scripts/gen-image-sizes.mjs.
const WIDTHS = [480, 800, 1200];
const PUBLIC = join(process.cwd(), 'public');
const cache = new Map<string, string | undefined>();

/** Pixel width from a WebP header (lossy, lossless or extended). */
function webpWidth(file: string): number | undefined {
  const b = Buffer.alloc(30);
  const fd = openSync(file, 'r');
  try {
    readSync(fd, b, 0, 30, 0);
  } finally {
    closeSync(fd);
  }
  const chunk = b.toString('ascii', 12, 16);
  if (chunk === 'VP8 ') return b.readUInt16LE(26) & 0x3fff;
  if (chunk === 'VP8L') return (b.readUInt32LE(21) & 0x3fff) + 1;
  if (chunk === 'VP8X') return b.readUIntLE(24, 3) + 1;
  return undefined;
}

/** `undefined` (attribute omitted) when the image has no smaller cuts. */
export function srcset(url: string | undefined | null): string | undefined {
  if (!url || !url.startsWith('/img/') || !url.endsWith('.webp')) return undefined;
  if (cache.has(url)) return cache.get(url);

  let out: string | undefined;
  const file = join(PUBLIC, url);
  if (existsSync(file)) {
    const cuts = WIDTHS.filter((w) => existsSync(file.replace(/\.webp$/, `-${w}.webp`)));
    const full = webpWidth(file);
    if (cuts.length && full) {
      out = [
        ...cuts.map((w) => `${url.replace(/\.webp$/, `-${w}.webp`)} ${w}w`),
        `${url} ${full}w`,
      ].join(', ');
    }
  }
  cache.set(url, out);
  return out;
}
