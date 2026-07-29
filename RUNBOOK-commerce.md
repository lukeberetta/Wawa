# Commerce go-live runbook (accessories → Shopify + Yoco)

Launch scope: the 7 **accessories** sell online. Boards stay on-site as
"Enquire" (WhatsApp). The site stays static — checkout hands off to Shopify
via a cart permalink, where **Yoco** is the payment provider.

Commerce is gated by one switch: `site.shopDomain` in `src/lib/site.ts`.
Empty = no cart UI anywhere. Set it (plus per-product variant IDs) to go live.

---

## 1. Access (blocked on client)

- Get **Shopify** access: Partner collaborator request (preferred, no staff
  seat) or staff invite. Minimum permission: **Products**.
- **Client** installs the **Yoco** app and connects their Yoco merchant
  account (their bank/money — not us), then activates Yoco under
  Settings → Payments.

## 2. Store setup (Shopify admin)

- Settings → store **currency = ZAR**, region South Africa.
- Settings → **Shipping** — add rates for physical accessories.
- Settings → **Taxes** — confirm VAT handling (SA prices usually VAT-inclusive).

## 3. Import the catalog

```bash
npx tsx scripts/gen-shopify-csv.ts > shopify-products.csv   # accessories only
```

- Products → **Import** → upload `shopify-products.csv`.
- Images are fetched by URL from the live site (wawawave.com) — no
  manual upload.
- Replace the **R999 placeholder prices** with real client pricing
  (in `src/data/products.ts` and re-import, or edit in admin).

## 4. Collect the two inputs the code needs

- **Shop domain** — Settings → Domains (custom domain or `*.myshopify.com`).
- **Variant IDs** — after import, Products → Export, or open each product;
  the numeric variant id is what the cart permalink uses.

  | Accessory | handle | variantId |
  |---|---|---|
  | Wood & Cork Beach Bats | `beach-bats` | |
  | Cotton Duck Board Cover | `cotton-duck-cover` | |
  | Geoprene Wetsuit Jacket | `geoprene-jacket` | |
  | Timber Fins | `fins` | |
  | Wooden Wax Comb | `wooden-wax-comb` | |
  | Posters & Prints | `posters-and-prints` | |
  | Make Your Own Surfboard | `make-your-own-surfboard` | |

## 5. Wire the code

- `src/lib/site.ts`: set `shopDomain: '<the domain>'`.
- `src/data/products.ts`: add `variantId: '<id>'` to each accessory
  (alongside `availableForSale`).

A product becomes buyable only when it has `availableForSale: true` **and**
a `variantId` **and** `shopDomain` is set — otherwise it stays Enquire.

## 6. Verify + deploy

```bash
npm run build && npm run preview     # click Add to cart → drawer → Checkout
```

- Confirm the Checkout link points at `https://<shopDomain>/cart/<id>:<qty>,…`
  and lands on Shopify's hosted checkout with Yoco available.
- Deploy (Cloudflare Pages).
- Do one **real** low-value test purchase (or Yoco test mode) end-to-end.

## Later: headless (when boards sell online)

The catalog layer (`src/lib/catalog.ts`) and `Product` type already mirror
the Shopify Storefront API. Swapping the mock data for a live Storefront
fetch + the Storefront cart API is a data-source change, not a template
change. The cart store's shape (add/setQty/remove/subtotal) stays the same.
