/** Global site constants. WhatsApp is the phase-1 order channel (no cart yet). */
export const site = {
  name: 'Wawa Surfboards',
  url: 'https://wawa.lukeberetta.com',
  location: 'Muizenberg, Cape Town',
  description:
    'Traditional wooden surfboards handcrafted in Muizenberg, Cape Town. Custom builds shaped from paulownia timber by Wawa Surfboards.',
  // TODO: replace with real number before launch
  whatsapp: '27000000000',
  instagram: 'https://www.instagram.com/wawa_surfboards/',
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
