# Commerce go-live runbook (accessories → Shopify + Yoco)

Launch scope: the 7 **accessories** sell online. Boards stay on-site as
"Enquire" (WhatsApp). The site stays static — checkout hands off to Shopify
via a cart permalink, where **Yoco** is the payment provider.

The Shopify domain is configured as `wawawave.myshopify.com` in
`src/lib/site.ts`. Sales remain disabled with `site.salesOpen: false` until
payments, product prices, and shipping are verified. Products also need
their Shopify variant IDs before they can be added to the cart.

---

## 1. Access (blocked on client)

- Get **Shopify** access: Partner collaborator request (preferred, no staff
  seat) or staff invite. Minimum permission: **Products**.
- **Client** installs the **Yoco** app and connects their Yoco merchant
  account (their bank/money — not us), then activates Yoco under
  Settings → Payments.

### Yoco activation (account access required)

Follow the [official Yoco Shopify setup guide](https://support.yoco.help/en/articles/164960-yoco-for-shopify).
This is configured in the merchant accounts; no Yoco API keys or payment
code are needed in this static site.

1. Complete the client's Yoco business profile and verify that you are
   signed into the correct business in the Yoco Web App.
2. Open **Sales → e-Commerce integrations → Shopify → How to Connect**.
3. Install the **Yoco Payments App** in the `wawawave.myshopify.com` Shopify
   store and review its permissions.
4. Return to Shopify's payments screen and select **Activate Yoco**.
   Save any app setting changes.
5. Confirm the correct business name appears on the Yoco payment page.
6. Once prices and shipping are confirmed, arrange an authorized purchase
   of at least **R2.00**, as recommended by Yoco. Verify the paid order in
   Shopify and the transaction in Yoco, including confirmation emails.

Activation and a successful payment have not been verified from this repo.

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
a `variantId` **and** `shopDomain` is set. Keep `salesOpen: false` until the
launch checks pass; the sales switch controls the Coming soon treatment.

## 6. Verify + deploy

```bash
npm run build && npm run preview     # click Add to cart → drawer → Checkout
```

- Confirm the Checkout link points at `https://<shopDomain>/cart/<id>:<qty>,…`
  and lands on Shopify's hosted checkout with Yoco available.
- Deploy (Cloudflare Pages).
- Do one **real** low-value test purchase (or Yoco test mode) end-to-end.
- After Yoco activation, confirmed prices, shipping, and the payment check,
  set `salesOpen: true` in `src/lib/site.ts`, build, and deploy to open sales.

## Later: headless (when boards sell online)

The catalog layer (`src/lib/catalog.ts`) and `Product` type already mirror
the Shopify Storefront API. Swapping the mock data for a live Storefront
fetch + the Storefront cart API is a data-source change, not a template
change. The cart store's shape (add/setQty/remove/subtotal) stays the same.
