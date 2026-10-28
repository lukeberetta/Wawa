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
];

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
};
// Gift cards — nothing is posted, so checkout skips shipping.
const NO_SHIPPING = new Set(['gift-card']);

const grams = (handle: string, variant?: string) =>
  String(VARIANT_GRAMS[`${handle}/${variant}`] ?? GRAMS[handle] ?? '');

const esc = (v: string | number): string => {
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const rows: string[][] = [HEADERS];

// Launch scope: only accessories sell online. Boards stay on-site as Enquire
// and are NOT imported to Shopify yet. Drop the filter when boards go live.
// --new: skip products that already have Shopify variant ids.
const onlyNew = process.argv.includes('--new');
const inShopify = (p: (typeof products)[number]) =>
  Boolean(p.variantId) || Boolean(p.variants?.some((v) => v.id));
// R999 is the unpriced placeholder — importing it would put a live R999
// product on the Shopify storefront, so those wait for a real price.
const PLACEHOLDER = '999.00';
const forImport = products.filter(
  (p) =>
    p.productType === 'Accessories' &&
    p.priceRange.minVariantPrice.amount !== PLACEHOLDER &&
    !(onlyNew && inShopify(p)),
);

for (const p of forImport) {
  const priced = p.availableForSale;
  const amount = p.priceRange.minVariantPrice.amount;
  // Skip the empty-room placeholder — Shopify would store it as the product photo.
  const images = p.images.filter((im) => !im.placeholder);
  const img0 = images[0];

  // Sized/coloured products get one row per variant; the first carries the product.
  const variants = p.variants ?? [];
  // Gift cards: Shopify names the option "Denominations", valued "R 100.00".
  const giftCard = Boolean(p.customAmount);
  const options = variants.map((v) => (giftCard ? `R ${v.price}` : v.title));
  const optionName = giftCard ? 'Denominations' : (p.optionName ?? 'Size');
  const ships = NO_SHIPPING.has(p.handle) ? 'FALSE' : 'TRUE';
  const priceOf = (i: number) => (priced ? (variants[i]?.price ?? amount) : '0.00');
  // Gift cards import as Shopify gift-card products (variants = denominations),
  // so the buyer gets a code redeemable on anything; they carry no tax.
  const taxable = giftCard ? 'FALSE' : 'TRUE';

  // First row: full product + first image.
  rows.push([
    p.handle,
    p.title,
    `<p>${p.description}</p>`,
    VENDOR,
    p.productType,
    p.tags.join(', '),
    'TRUE',
    options.length ? optionName : 'Title',
    options[0] ?? 'Default Title',
    priced ? '' : 'shopify', // priced = made-to-order, untracked = always available
    priced ? '' : '0',
    'deny',
    'manual',
    priceOf(0),
    grams(p.handle, options[0]),
    'kg',
    ships,
    taxable,
    img0?.url ? `${ORIGIN}${img0.url}` : '',
    img0?.url ? '1' : '',
    img0?.altText ?? '',
    'active',
    giftCard ? 'TRUE' : 'FALSE',
  ]);

  // Further variants: Handle + option + variant columns.
  options.slice(1).forEach((value, i) => {
    const r = new Array(HEADERS.length).fill('');
    r[0] = p.handle;
    r[8] = value;
    r[9] = priced ? '' : 'shopify';
    r[10] = priced ? '' : '0';
    r[11] = 'deny';
    r[12] = 'manual';
    r[13] = priceOf(i + 1);
    r[14] = grams(p.handle, value);
    r[15] = 'kg';
    r[16] = ships;
    r[17] = taxable;
    rows.push(r);
  });

  // Extra images: Handle + image columns only.
  images.slice(1).forEach((im, i) => {
    const r = new Array(HEADERS.length).fill('');
    r[0] = p.handle;
    r[18] = `${ORIGIN}${im.url}`;
    r[19] = String(i + 2);
    r[20] = im.altText ?? '';
    rows.push(r);
  });
}

process.stdout.write(rows.map((r) => r.map(esc).join(',')).join('\n') + '\n');
