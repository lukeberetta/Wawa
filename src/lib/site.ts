/** Global site constants. WhatsApp is the phase-1 order channel (no cart yet). */
export interface SiteEvent {
  label: string;
  title: string;
  artist: string;
  dates: string;
  opening: string;
  blurb: string;
  start: string;
  end: string;
  venue: string;
  street: string;
  locality: string;
  mapHref: string;
  cta: string;
  href: string;
  artCredit: string;
  image: string;
}

export const site = {
  name: 'Wawa Surfboards',
  url: 'https://wawawave.com',
  location: 'Muizenberg, Cape Town',
  description:
    'Wooden surfboards and custom surf craft from Muizenberg, Cape Town. Explore Wawa’s paulownia and cork boards, solid-timber shapes and accessories.',
  /** Shown to search engines as the brand's short name (Google site-name pick). */
  shortName: 'Wawa',
  whatsapp: '27823723142',
  /** E.164, for tel: links and LocalBusiness `telephone`. */
  phone: '+27823723142',
  email: 'surfboards@wawawave.com',
  // Matches the Google Business Profile (checked 2026-11-10). Keep the two in
  // step — Google cross-checks the page against the LocalBusiness markup.
  hoursConfirmed: true,
  // `days`/`time` are the display strings; `spec` is the machine-readable pair
  // that feeds LocalBusiness `openingHoursSpecification` (schema.org day URLs,
  // 24h times). Keep the two in sync — they render from the same array.
  hours: [
    {
      days: 'Monday – Friday',
      time: '7:00 – 17:00',
      spec: {
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '07:00',
        closes: '17:00',
      },
    },
    {
      days: 'Saturday',
      time: '7:00 – 15:00',
      spec: { dayOfWeek: ['Saturday'], opens: '07:00', closes: '15:00' },
    },
    {
      days: 'Sunday',
      time: '7:00 – 13:00',
      spec: { dayOfWeek: ['Sunday'], opens: '07:00', closes: '13:00' },
    },
  ],
  address: {
    street: '166-168 Main Rd',
    locality: 'Muizenberg',
    region: 'Western Cape',
    postalCode: '7950',
    country: 'ZA',
  },
  /** Workshop coordinates. Empty until confirmed against the Business Profile
   *  pin — a guessed lat/lng is worse than none, so schema omits geo if unset. */
  geo: { lat: '', lng: '' },
  /** Rough ZAR band for LocalBusiness `priceRange` — boards are custom-priced. */
  priceRange: 'RRR',
  instagram: 'https://www.instagram.com/wawa_surfboards/',
  // Shopify shop domain for cart-permalink checkout (Yoco runs on Shopify's
  // hosted checkout). Use the store's primary/custom domain or *.myshopify.com.
  // Empty = checkout disabled (items fall back to Enquire). Fill after import.
  shopDomain: 'wawawave.myshopify.com',
  // Master switch for add-to-cart. Off = every buyable item shows "Coming soon"
  // (boards keep Enquire). Flip on once Yoco + real prices are live.
  salesOpen: true,
  // Strip above the nav on every page. Dismissal is remembered per `id`, so
  // bump the id when the message changes and everyone sees the new one.
  // Set to null to remove the strip.
  announce: {
    id: 'shop-open-2026-11',
    text: 'Our online shop is open',
    cta: 'Shop now',
    href: '/products',
  } as { id: string; text: string; cta: string; href: string } | null,
  // Featured event on the home page, directly under the hero (and its
  // VisualArtsEvent node in the page schema). Set to null once it's over.
  event: {
    label: 'Wawa News',
    title: 'First Monoprint Exhibition',
    artist: 'Cobus Joubert',
    dates: '27–29 November',
    opening: 'Opening night Friday 27, 6–9pm',
    // Schema description only — the band itself stays to two lines of facts.
    blurb:
      'Twelve monoprints by Wawa founder Cobus Joubert, each also an A3 poster, on paper or framed in timber.',
    // ISO dates, for the schema node.
    start: '2026-11-27',
    end: '2026-11-29',
    venue: 'Studio Muse',
    street: '136 Main Rd',
    locality: 'Kalk Bay',
    mapHref: 'https://www.google.com/maps/search/?api=1&query=Studio+Muse+136+Main+Rd+Kalk+Bay',
    cta: 'Buy a print',
    href: '/products/art-prints/monoprint-exhibition-posters',
    // The scattered prints around the band are laid out in index.astro.
    // Schema image stays the full poster.
    artCredit: 'Monoprints by Cobus Joubert',
    image: '/img/product/monoprint-01.webp',
  } as SiteEvent | null,
  // Methods the Yoco gateway offers on Shopify's checkout. Icons in
  // /public/payment are Shopify's open payment_icons set (activemerchant).
  payments: [
    { file: 'visa', name: 'Visa' },
    { file: 'mastercard', name: 'Mastercard' },
    { file: 'amex', name: 'American Express' },
    { file: 'apple_pay', name: 'Apple Pay' },
    { file: 'google_pay', name: 'Google Pay' },
  ],
  // `dropdown` (disciplines drilled in Nav.astro) makes Shop a two-level row.
  nav: [
    { href: '/products', label: 'Shop', dropdown: true },
    { href: '/cafe', label: 'Cafe' },
    { href: '/story', label: 'Story' },
    { href: '/press', label: 'Press' },
    { href: '/contact', label: 'Contact' },
  ],
};

export function whatsappLink(message: string): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
