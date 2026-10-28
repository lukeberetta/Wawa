/**
 * Generate a Shopify product-import CSV from the mock catalog.
 *
 *   npx tsx scripts/gen-shopify-csv.ts > shopify-products.csv
 *   npx tsx scripts/gen-shopify-csv.ts --new > shopify-new.csv   # only products not yet in Shopify
 *
 * Then in Shopify admin: Products → Import → upload the CSV.
 * Images are pulled by URL from the live site, so no manual upload is needed.
 *
 * Conventions:
 *   - Type   = productType (Surf/Foil/Kite/…) so it maps to the discipline pages.
 *   - Tags   = the product's tags (subcategory).
 *   - POA items (availableForSale:false) import as Active but out of stock with
 *     price 0 → the storefront still renders them with an "Enquire" CTA.
 *   - Priced items don't track inventory (made-to-order) → always buyable.
 */

import { products } from '../src/data/products';

const ORIGIN = 'https://wawawave.com';
const VENDOR = 'Wawa';

const HEADERS = [
  'Handle',
  'Title',
  'Body (HTML)',
  'Vendor',
  'Type',
  'Tags',
  'Published',
  'Option1 Name',
  'Option1 Value',
  'Option2 Name',
  'Option2 Value',
  'Option3 Name',
  'Option3 Value',
  'Variant Inventory Tracker',
  'Variant Inventory Qty',
  'Variant Inventory Policy',
  'Variant Fulfillment Service',
  'Variant Price',
  'Variant Grams',
  'Variant Weight Unit',
  'Variant Requires Shipping',
  'Variant Taxable',
  'Image Src',
  'Image Position',
  'Image Alt Text',
  'Status',
  'Gift Card',
] as const;

// Estimated packed weights (grams) for Shopify's weight-band shipping rates.
// Rough figures, not weighed — replace with real ones when known.
const GRAMS: Record<string, number> = {
  'cotton-duck-cover': 1800,
  'canvas-carryall': 1200,
  'canvas-tote': 500,
  'canvas-tog-bag-large': 600,
  'canvas-tog-bag-regular': 500,
  'wooden-wax-comb': 100,
  'beach-bats': 1000,
  'geoprene-jacket': 800,
  'cape-town-crest-tee': 300,
  'swallow-tee': 300,
  'wood-is-good-tee': 300,
  'posters-and-prints': 400,
  'spex-wave-photography': 400,
  'wooden-cruiser': 2500,
  'wooden-surfskate': 2000,
  alaia: 7000,
  bodyboard: 3000,
  paipo: 3500,
  handslide: 800,
};

// Per-variant overrides where one product spans very different parcels
// (keyed `${handle}/${variant title}`). Framed prints ship with glass and timber.
const VARIANT_GRAMS: Record<string, number> = {
  [`cotton-duck-cover/5'0"`]: 1300,
  [`cotton-duck-cover/9'6"`]: 2300,
  'posters-and-prints/A5 print': 300,
  'posters-and-prints/A3 print': 500,
  'posters-and-prints/A5 framed': 1500,
  'posters-and-prints/A4 framed': 2500,
  'posters-and-prints/A3 framed': 4000,
  'spex-wave-photography/A4 framed': 2500,
  // multi-option variants match on any one value ('… / 4ft / …')
  'paipo/4ft': 4500,
  'wooden-cruiser/Complete': 4000,
  'wooden-surfskate/Rounded tail, complete': 3500,
  'wooden-surfskate/Swallow tail, complete': 3500,
};
// Gift cards — nothing is posted, so checkout skips shipping.
const NO_SHIPPING = new Set(['gift-card']);

// Shopify handle when it differs from the site's. Paipo and alaia were first
// imported with a single option; their multi-option replacements import fresh
// under these handles (the originals are drafted in Shopify).
const SHOPIFY_HANDLE: Record<string, string> = {
  paipo: 'paipo-models',
  alaia: 'alaia-models',
};

const col = (name: (typeof HEADERS)[number]) => HEADERS.indexOf(name);

const grams = (handle: string, variant = '') => {
  const keys = [variant, ...variant.split(' / ')].map((v) => `${handle}/${v}`);
  const hit = keys.find((k) => k in VARIANT_GRAMS);
  return String(hit ? VARIANT_GRAMS[hit] : (GRAMS[handle] ?? ''));
};

const esc = (v: string | number): string => {
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const rows: string[][] = [[...HEADERS]];

// Launch scope: accessories plus the small craft below sell online. Boards
// stay on-site as Enquire and are NOT imported to Shopify yet.
const SMALL_CRAFT = new Set([
  'wooden-cruiser',
  'wooden-surfskate',
  'paipo',
  'handslide',
  'alaia',
  'bodyboard',
]);
// --new: skip products that already have Shopify variant ids.
const onlyNew = process.argv.includes('--new');
const inShopify = (p: (typeof products)[number]) =>
  Boolean(p.variantId) || Boolean(p.variants?.some((v) => v.id));
// R999 is the unpriced placeholder — importing it would put a live R999
// product on the Shopify storefront, so those wait for a real price.
const PLACEHOLDER = '999.00';
const forImport = products.filter(
  (p) =>
    (p.productType === 'Accessories' || SMALL_CRAFT.has(p.handle)) &&
    p.priceRange.minVariantPrice.amount !== PLACEHOLDER &&
    !(onlyNew && inShopify(p)),
);

for (const p of forImport) {
  const priced = p.availableForSale;
  const amount = p.priceRange.minVariantPrice.amount;
  const handle = SHOPIFY_HANDLE[p.handle] ?? p.handle;
  // Skip the empty-room placeholder — Shopify would store it as the product photo.
  const images = p.images.filter((im) => !im.placeholder);
  const img0 = images[0];

  // Sized/coloured products get one row per variant; the first carries the product.
  const variants = p.variants ?? [];
  // Gift cards: Shopify names the option "Denominations", valued "R 100.00".
  const giftCard = Boolean(p.customAmount);
  // Each variant's values, one per option ('Model / Size / Colour' → 3).
  const values = variants.map((v) => (giftCard ? [`R ${v.price}`] : v.title.split(' / ')));
  const names = giftCard ? ['Denominations'] : (p.optionNames ?? [p.optionName ?? 'Size']);
  const ships = NO_SHIPPING.has(p.handle) ? 'FALSE' : 'TRUE';
  const priceOf = (i: number) => (priced ? (variants[i]?.price ?? amount) : '0.00');
  // Gift cards import as Shopify gift-card products (variants = denominations),
  // so the buyer gets a code redeemable on anything; they carry no tax.
  const taxable = giftCard ? 'FALSE' : 'TRUE';

  // One row per variant (or a single 'Default Title' row); the first also
  // carries the product fields and first image.
  const count = Math.max(variants.length, 1);
  for (let i = 0; i < count; i++) {
    const r: string[] = new Array(HEADERS.length).fill('');
    const vals = values[i] ?? ['Default Title'];
    r[col('Handle')] = handle;
    vals.forEach((v, k) => {
      if (i === 0) r[col(`Option${k + 1} Name` as (typeof HEADERS)[number])] = variants.length ? names[k] : 'Title';
      r[col(`Option${k + 1} Value` as (typeof HEADERS)[number])] = v;
    });
    r[col('Variant Inventory Tracker')] = priced ? '' : 'shopify'; // priced = made-to-order, untracked = always available
    r[col('Variant Inventory Qty')] = priced ? '' : '0';
    r[col('Variant Inventory Policy')] = 'deny';
    r[col('Variant Fulfillment Service')] = 'manual';
    r[col('Variant Price')] = priceOf(i);
    r[col('Variant Grams')] = grams(p.handle, variants[i]?.title);
    r[col('Variant Weight Unit')] = 'kg';
    r[col('Variant Requires Shipping')] = ships;
    r[col('Variant Taxable')] = taxable;
    if (i === 0) {
      r[col('Title')] = p.title;
      r[col('Body (HTML)')] = `<p>${p.description}</p>`;
      r[col('Vendor')] = VENDOR;
      r[col('Type')] = p.productType;
      r[col('Tags')] = p.tags.join(', ');
      r[col('Published')] = 'TRUE';
      r[col('Image Src')] = img0?.url ? `${ORIGIN}${img0.url}` : '';
      r[col('Image Position')] = img0?.url ? '1' : '';
      r[col('Image Alt Text')] = img0?.altText ?? '';
      r[col('Status')] = 'active';
      r[col('Gift Card')] = giftCard ? 'TRUE' : 'FALSE';
    }
    rows.push(r);
  }

  // Extra images: Handle + image columns only.
  images.slice(1).forEach((im, i) => {
    const r: string[] = new Array(HEADERS.length).fill('');
    r[col('Handle')] = handle;
    r[col('Image Src')] = `${ORIGIN}${im.url}`;
    r[col('Image Position')] = String(i + 2);
    r[col('Image Alt Text')] = im.altText ?? '';
    rows.push(r);
  });
}

process.stdout.write(rows.map((r) => r.map(esc).join(',')).join('\n') + '\n');
