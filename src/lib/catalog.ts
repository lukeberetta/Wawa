import type { Product } from '@/lib/types';
import { products as mockProducts } from '@/data/products';
import { disciplines } from '@/data/disciplines';

/**
 * Catalog access layer. Today returns mock data; in phase 2 swap the body of
 * `getProducts()` for a Shopify Storefront GraphQL fetch — callers don't change.
 *
 *   // phase 2:
 *   const res = await storefront(QUERY);
 *   return res.products.edges.map(e => e.node);
 */

export async function getProducts(): Promise<Product[]> {
  return mockProducts;
}

export async function getFeatured(): Promise<Product[]> {
  return mockProducts.filter((p) => p.featured);
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  return mockProducts.find((p) => p.handle === handle);
}

/** Stable slug: lowercase, drop punctuation, collapse to single hyphens. */
export function slug(s: string): string {
  return s
    .toLowerCase()
    .replace(/&/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function getByDiscipline(handle: string): Promise<Product[]> {
  return mockProducts.filter((p) => slug(p.productType) === handle);
}

export { disciplines };

/** Format Storefront Money as a ZAR price string, or "Enquire" when POA. */
export function formatPrice(p: Product): string {
  const amt = Number(p.priceRange.minVariantPrice.amount);
  if (!p.availableForSale || amt <= 0) return 'Enquire';
  // R25,000 — comma thousands, no decimals (not the en-ZA space/comma)
  const n = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(amt);
  return `R${n}`;
}
