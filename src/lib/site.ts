/** Global site constants. WhatsApp is the phase-1 order channel (no cart yet). */
export const site = {
  name: 'Wawa Surfboards',
  url: 'https://wawa.lukeberetta.com',
  location: 'Muizenberg, Cape Town',
  description:
    'Traditional wooden surfboards handcrafted in Muizenberg, Cape Town. Custom builds shaped from paulownia timber by Wawa Surfboards.',
  whatsapp: '27823723142',
  instagram: 'https://www.instagram.com/wawa_surfboards/',
  // Shopify shop domain for cart-permalink checkout (Yoco runs on Shopify's
  // hosted checkout). Use the store's primary/custom domain or *.myshopify.com.
  // Empty = checkout disabled (items fall back to Enquire). Fill after import.
  shopDomain: 'wawawave.myshopify.com',
  // `children` (built from disciplines in Nav.astro) makes this a dropdown.
  nav: [
    { href: '/products', label: 'Products', dropdown: true },
    { href: '/story', label: 'Story' },
    { href: '/cafe', label: 'Cafe' },
    { href: '/press', label: 'Press' },
    { href: '/contact', label: 'Contact' },
  ],
};

export function whatsappLink(message: string): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
