/** Global site constants. WhatsApp is the phase-1 order channel (no cart yet). */
export const site = {
  name: 'Wawa Surfboards',
  url: 'https://wawawave.com',
  location: 'Muizenberg, Cape Town',
  description:
    'Traditional wooden surfboards handcrafted in Muizenberg, Cape Town. Custom builds shaped from paulownia timber by Wawa Surfboards.',
  whatsapp: '27823723142',
  email: 'surfboards@wawawave.com',
  // PLACEHOLDER HOURS — confirm with the shop before these go live.
  hours: [
    { days: 'Monday – Friday', time: '7:00 – 16:00' },
    { days: 'Saturday', time: '7:00 – 14:00' },
    { days: 'Sunday', time: '8:00 – 13:00' },
  ],
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
