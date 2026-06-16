/**
 * Generate a Shopify product-import CSV from the mock catalog.
 *
 *   npx tsx scripts/gen-shopify-csv.ts > shopify-products.csv
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

const ORIGIN = 'https://wawa.lukeberetta.com';
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
  'Variant Requires Shipping',
  'Variant Taxable',
  'Image Src',
  'Image Position',
  'Image Alt Text',
  'Status',
];

const esc = (v: string | number): string => {
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const rows: string[][] = [HEADERS];

// Launch scope: only accessories sell online. Boards stay on-site as Enquire
// and are NOT imported to Shopify yet. Drop the filter when boards go live.
const forImport = products.filter((p) => p.productType === 'Accessories');

for (const p of forImport) {
  const priced = p.availableForSale;
  const amount = p.priceRange.minVariantPrice.amount;
  const img0 = p.images[0];

  // First row: full product + first image.
  rows.push([
    p.handle,
    p.title,
    `<p>${p.description}</p>`,
    VENDOR,
    p.productType,
    p.tags.join(', '),
    'TRUE',
    'Title',
    'Default Title',
    priced ? '' : 'shopify', // priced = made-to-order, untracked = always available
    priced ? '' : '0',
    'deny',
    'manual',
    priced ? amount : '0.00',
    'TRUE',
    'TRUE',
    img0?.url ? `${ORIGIN}${img0.url}` : '',
    img0?.url ? '1' : '',
    img0?.altText ?? '',
    'active',
  ]);

  // Extra images: Handle + image columns only.
  p.images.slice(1).forEach((im, i) => {
    const r = new Array(HEADERS.length).fill('');
    r[0] = p.handle;
    r[16] = `${ORIGIN}${im.url}`;
    r[17] = String(i + 2);
    r[18] = im.altText ?? '';
    rows.push(r);
  });
}

process.stdout.write(rows.map((r) => r.map(esc).join(',')).join('\n') + '\n');
