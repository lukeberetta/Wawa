/** Global site constants. WhatsApp is the phase-1 order channel (no cart yet). */
export const site = {
  name: 'Wawa Surfboards',
  url: 'https://wawawave.com',
  location: 'Muizenberg, Cape Town',
  description:
    'Traditional wooden surfboards handcrafted in Muizenberg, Cape Town. Custom builds shaped from paulownia timber by Wawa Surfboards.',
  /** Shown to search engines as the brand's short name (Google site-name pick). */
  shortName: 'Wawa',
  whatsapp: '27823723142',
  /** E.164, for tel: links and LocalBusiness `telephone`. */
  phone: '+27823723142',
  email: 'surfboards@wawawave.com',
  // PLACEHOLDER HOURS — confirm with the shop before these go live.
  // `days`/`time` are the display strings; `spec` is the machine-readable pair
  // that feeds LocalBusiness `openingHoursSpecification` (schema.org day URLs,
  // 24h times). Keep the two in sync — they render from the same array.
  hours: [
    {
      days: 'Monday – Friday',
      time: '7:00 – 16:00',
      spec: {
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '07:00',
        closes: '16:00',
      },
    },
    {
      days: 'Saturday',
      time: '7:00 – 14:00',
      spec: { dayOfWeek: ['Saturday'], opens: '07:00', closes: '14:00' },
    },
    {
      days: 'Sunday',
      time: '8:00 – 13:00',
      spec: { dayOfWeek: ['Sunday'], opens: '08:00', closes: '13:00' },
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
