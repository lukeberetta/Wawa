import type { Product } from '@/lib/types';
import { products as mockProducts } from '@/data/products';
import { disciplines } from '@/data/disciplines';
import { site } from '@/lib/site';

/**
 * Catalog access layer. Today returns mock data; in phase 2 swap the body of
 * `getProducts()` for a Shopify Storefront GraphQL fetch — callers don't change.
 *
 *   // phase 2:
 *   const res = await storefront(QUERY);
 *   return res.products.edges.map(e => e.node);
 */

export async function getProducts(): Promise<Product[]> {
  return byFilterOrder(mockProducts);
}

/** Order products as the shop's filters read: discipline pill order, then
 *  category order within it. Stable, so the catalog order breaks ties. */
function byFilterOrder(list: Product[]): Product[] {
  const rank = (p: Product) => {
    const di = disciplines.findIndex((d) => d.handle === slug(p.productType));
    const d = disciplines[di];
    const ci = d ? d.categories.findIndex((c) => p.tags.includes(c)) : -1;
    return [di < 0 ? Infinity : di, ci < 0 ? Infinity : ci];
  };
  return [...list].sort((a, b) => {
    const [ad, ac] = rank(a);
    const [bd, bc] = rank(b);
    return ad - bd || ac - bc || 0;
  });
}

export async function getFeatured(): Promise<Product[]> {
  return mockProducts
    .filter((p) => p.featured)
    .sort((a, b) => a.featured! - b.featured!);
}

/** Stable slug: lowercase, drop punctuation, collapse to single hyphens. */
export function slug(s: string): string {
  return s
    .toLowerCase()
    .replace(/&/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export { disciplines };

/** Product types that aren't boards: fixed-price goods, not made-to-order builds. */
const GOODS_TYPES = new Set(['Accessories', 'Art & Prints']);
export const isGoods = (p: Product): boolean => GOODS_TYPES.has(p.productType);
/** Discipline handles of those types (kept off the board-order form). */
export const GOODS_DISCIPLINES = new Set([...GOODS_TYPES].map(slug));

/** Shaping your own board in the workshop costs the board price plus 20%,
 *  for the extra workshop time. Used by the board PDPs' "Make it yourself" build. */
export const MAKE_YOUR_OWN_MARKUP = 1.2;
export const makeYourOwnPrice = (amount: string | number): number =>
  Math.round(Number(amount) * MAKE_YOUR_OWN_MARKUP);

/** Can go in the cart: sales open, in stock, a shop configured and a Shopify
 *  id on every variant (or on the product, when it has none). */
export function isBuyable(p: Product): boolean {
  const v = p.variants ?? [];
  return (
    site.salesOpen &&
    p.availableForSale &&
    !!site.shopDomain &&
    (v.length > 0 ? v.every((x) => x.id) : !!p.variantId)
  );
}

/** Format Storefront Money as a ZAR price string, or "Enquire" when POA.
 *  Accessories read "Coming soon" while sales are closed (salesOpen off). */
export function formatPrice(p: Product): string {
  if (isGoods(p) && !site.salesOpen) return 'Coming soon';
  const amt = Number(p.priceRange.minVariantPrice.amount);
  if (amt <= 0) return 'Enquire';
  // R25,000 — comma thousands, no decimals (not the en-ZA space/comma)
  const n = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(amt);
  const price = `R${n}`;
  // Boards are custom builds priced from a base; accessories and anything
  // sold online (has Shopify ids) are fixed, unless their variants are priced
  // differently (sizes, framed or not).
  const tiered = new Set(p.variants?.map((v) => Number(v.price ?? amt))).size > 1;
  const online = Boolean(p.variantId) || Boolean(p.variants?.some((v) => v.id));
  return (isGoods(p) || online) && !tiered ? price : `From ${price}`;
}
