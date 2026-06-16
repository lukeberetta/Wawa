/**
 * Framework-free cart store, persisted to localStorage. Lines hold a Shopify
 * variant id so checkout is a single Shopify cart permalink:
 *
 *   https://{shopDomain}/cart/{variant}:{qty},{variant}:{qty},…
 *
 * This keeps the site static — no Storefront token, no server. When commerce
 * moves headless, swap callers to the Storefront cart API; this module's shape
 * (add/remove/setQty/subtotal) stays the same.
 */
import { site } from '@/lib/site';

export interface CartLine {
  variantId: string;
  handle: string;
  title: string;
  price: number; // ZAR amount per unit
  image: string;
  qty: number;
}

const KEY = 'wawa-cart-v1';
const EVT = 'wawa-cart-change';

function read(): CartLine[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

function write(lines: CartLine[]): void {
  localStorage.setItem(KEY, JSON.stringify(lines));
  window.dispatchEvent(new CustomEvent(EVT, { detail: lines }));
}

export function getLines(): CartLine[] {
  return read();
}

export function count(): number {
  return read().reduce((n, l) => n + l.qty, 0);
}

export function subtotal(): number {
  return read().reduce((n, l) => n + l.price * l.qty, 0);
}

export function add(line: Omit<CartLine, 'qty'>, qty = 1): void {
  if (!line.variantId) return;
  const lines = read();
  const found = lines.find((l) => l.variantId === line.variantId);
  if (found) found.qty += qty;
  else lines.push({ ...line, qty });
  write(lines);
}

export function setQty(variantId: string, qty: number): void {
  let lines = read();
  if (qty <= 0) {
    lines = lines.filter((l) => l.variantId !== variantId);
  } else {
    const line = lines.find((l) => l.variantId === variantId);
    if (line) line.qty = qty;
  }
  write(lines);
}

export function remove(variantId: string): void {
  setQty(variantId, 0);
}

export function clear(): void {
  write([]);
}

/** Subscribe to cart changes (same tab via CustomEvent, other tabs via storage). */
export function onChange(cb: (lines: CartLine[]) => void): void {
  window.addEventListener(EVT, (e) => cb((e as CustomEvent<CartLine[]>).detail));
  window.addEventListener('storage', (e) => {
    if (e.key === KEY) cb(read());
  });
}

/** Shopify cart permalink for the current lines; '' when not checkout-ready. */
export function buildCheckoutUrl(lines: CartLine[] = read()): string {
  if (!site.shopDomain) return '';
  const parts = lines.filter((l) => l.variantId && l.qty > 0).map((l) => `${l.variantId}:${l.qty}`);
  if (!parts.length) return '';
  return `https://${site.shopDomain}/cart/${parts.join(',')}`;
}

/** Format a ZAR amount the same way product prices render. */
export function formatZAR(amount: number): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    maximumFractionDigits: 0,
  }).format(amount);
}
