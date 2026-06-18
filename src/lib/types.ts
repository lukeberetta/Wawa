/**
 * Product shape mirrors a subset of the Shopify Storefront API `Product`.
 * Keeping these names aligned means the phase-2 swap (mock → real Shopify)
 * is a data-source change only, not a template change.
 */

export interface Money {
  amount: string;
  currencyCode: string; // 'ZAR'
}

export interface ProductImage {
  url: string;
  altText: string;
  width?: number;
  height?: number;
}

export interface Product {
  id: string;
  handle: string; // url slug
  title: string;
  description: string;
  productType: string; // discipline: 'Surf' | 'Foil' | ...
  tags: string[]; // category: 'Short' | 'Mid' | ...
  availableForSale: boolean;
  /** Shopify variant id (numeric) for the cart-permalink checkout. Set on
   *  buyable items; absent on POA/Enquire boards. */
  variantId?: string;
  priceRange: { minVariantPrice: Money };
  /** front + back for the flip-card; first = primary */
  images: ProductImage[];
  featured?: boolean;
  /** PDP spec list, shown as a label/value table. Grouped: each inner array is
   *  a block, rendered with a gap between blocks (e.g. performance vs build). */
  specs?: { label: string; value: string }[][];
}

/** Top-level discipline (Craft sub-section) → maps to a Shopify collection. */
export interface Discipline {
  handle: string;
  title: string;
  blurb: string;
  /** longer intro shown on the discipline page header */
  intro?: string;
  /** hero image path for disciplines without products yet */
  hero?: string;
  /** category tags shown as filters under this discipline */
  categories: string[];
}
