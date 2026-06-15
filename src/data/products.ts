import type { Product } from '@/lib/types';

/**
 * Catalog — copy lifted/condensed from the client's NEW/*.docx, structured to
 * the Shopify Storefront shape. Phase 2: replace with a live Storefront fetch,
 * keeping these field names so templates don't change.
 *
 * PRICING: only the figures carried from the POC are real. Everything else is
 * POA (amount '0' + availableForSale:false) → renders "Enquire". Replace with
 * client pricing before launch.
 */

const zar = (amount: string) => ({ amount, currencyCode: 'ZAR' });
const poa = zar('0.00');
const img = (name: string, alt: string) => ({ url: `/img/catalog/${name}.jpg`, altText: alt });

export const products: Product[] = [
  // ── SURF · Short ─────────────────────────────
  {
    id: 'mock/classic-fish',
    handle: 'classic-fish',
    title: 'Classic Fish',
    description:
      'With its unprecedented speed and traction, the fish was the most progressive board to emerge from the 1960s shortboard revolution. A Steve Lis–inspired shape with Larry Gephart keel fins — one of the most versatile, enduring designs you can pack for J-Bay, Buffels or Bali. Domed or bevelled deck.',
    productType: 'Surf',
    tags: ['Short'],
    availableForSale: true,
    priceRange: { minVariantPrice: zar('16500.00') },
    images: [img('classic-fish-front', 'Wawa Classic Fish, deck'), img('classic-fish-back', 'Wawa Classic Fish, hull')],
    featured: true,
  },
  {
    id: 'mock/gun-fish',
    handle: 'gun-fish',
    title: 'Gun Fish',
    description:
      'A more performance-oriented twin. Inspired by 1970s Steve Lis designs, the Gun Fish drives from the centre — a tapered tail delivers speed and effortless flow in medium to overhead surf, with strong hold, tight pivot and powerful projection. Domed or bevelled deck.',
    productType: 'Surf',
    tags: ['Short'],
    availableForSale: false,
    priceRange: { minVariantPrice: poa },
    images: [img('gun-fish-front', 'Wawa Gun Fish, deck'), img('gun-fish-back', 'Wawa Gun Fish, hull')],
  },
  {
    id: 'mock/mini-simmons',
    handle: 'mini-simmons',
    title: 'Mini-Simmons',
    description:
      'A tribute to Bob Simmons, one of surfing’s original innovators. Parallel rails, a generous outline and a wide, powerful tail create immediate lift and effortless speed. Flat rocker honours planing-hull theory — flat and straight equals fast. Playful in weak surf, a flowing dream ride when it steps up.',
    productType: 'Surf',
    tags: ['Short'],
    availableForSale: false,
    priceRange: { minVariantPrice: poa },
    images: [img('simmons-front', 'Wawa Mini-Simmons, deck'), img('simmons-back', 'Wawa Mini-Simmons, hull')],
    featured: true,
  },
  {
    id: 'mock/paipo',
    handle: 'paipo',
    title: 'Paipo',
    description:
      'Along with Alaias, the wave-riding craft of pre-European-contact Hawaii. Short, wide and fast — the punk rock of surfing. Available finned (after boards ridden by Valentine Chang) or finless, across four models: the Bullet, the Godfather, Dr. Strangelove and Purple Haze.',
    productType: 'Surf',
    tags: ['Short', 'Finless'],
    availableForSale: false,
    priceRange: { minVariantPrice: poa },
    images: [img('paipo-front', 'Wawa Paipo, top'), img('paipo-back', 'Wawa Paipo, base')],
  },

  // ── SURF · Mid ───────────────────────────────
  {
    id: 'mock/speed-egg',
    handle: 'speed-egg',
    title: 'Speed Egg',
    description:
      'Born from the late-1960s shortboard revolution and refined by Skip Frye and Steve Lis. A flat rocker and low rails make for a fast, smooth, responsive single-fin that paddles easily and duck-dives effortlessly. Built for tight pocket turns, deep bottom turns and long drawn-out lines.',
    productType: 'Surf',
    tags: ['Mid'],
    availableForSale: true,
    priceRange: { minVariantPrice: zar('16500.00') },
    images: [img('speed-egg-front', 'Wawa Speed Egg, deck'), img('speed-egg-back', 'Wawa Speed Egg, hull')],
    featured: true,
  },
  {
    id: 'mock/long-fish',
    handle: 'long-fish',
    title: 'Long Fish Twin',
    description:
      'Built for flow — smooth lines in rocker and outline create a board that feels stable, fast and effortlessly stylish. A pulled-in tail adds manoeuvrability in smaller surf and dependable hold when it steps up. Beak nose, soft rails, single-to-double concave and V out the back. Hip-high to overhead.',
    productType: 'Surf',
    tags: ['Mid'],
    availableForSale: false,
    priceRange: { minVariantPrice: poa },
    images: [img('long-fish-front', 'Wawa Long Fish, deck'), img('long-fish-back', 'Wawa Long Fish, hull')],
    featured: true,
  },

  // ── SURF · Long ──────────────────────────────
  {
    id: 'mock/model-p',
    handle: 'model-p-longboard',
    title: 'Model P Longboard',
    description:
      'Inspired by Dale Velzy’s iconic 1955 Pig. A wide hip set 10″ back from centre delivers effortless trim and natural flow — built for riders who value turns over straight lines. A classic single-fin with a timeless wood tail block that comes alive on dreamy, glassy small-to-medium days.',
    productType: 'Surf',
    tags: ['Long'],
    availableForSale: true,
    priceRange: { minVariantPrice: zar('28500.00') },
    images: [img('pig-longboard-front', 'Wawa Model P, deck'), img('pig-longboard-back', 'Wawa Model P, hull')],
    featured: true,
  },
  {
    id: 'mock/model-t',
    handle: 'model-t-longboard',
    title: 'Model T Longboard',
    description:
      'Inspired by Donald Takayama — the most well-rounded, versatile log we offer. A broad, easy-to-noseride scoop and a wide yet loose tail. Classic 50/50 rails, single fin, square tail; the timber-and-cork over EPS construction is what brings it alive. Smooth, controlled glide in surf big and especially small.',
    productType: 'Surf',
    tags: ['Long'],
    availableForSale: true,
    priceRange: { minVariantPrice: zar('28500.00') },
    images: [img('takayama-front', 'Wawa Model T, deck'), img('takayama-back', 'Wawa Model T, hull')],
  },

  // ── SURF · Finless ───────────────────────────
  {
    id: 'mock/alaia',
    handle: 'alaia',
    title: 'Alaia',
    description:
      'If our Paipos are punk rock, the Alaia is Miles Davis. Thin, flat-rockered and sealed with oil, ridden standup and on a rail. It glides with an ease modern foam can’t replicate — a return to surfing’s Polynesian origins. Hand-shaped from solid timber since 2010. Four models: Classic, Trigger, Trick and Needle.',
    productType: 'Surf',
    tags: ['Finless'],
    availableForSale: false,
    priceRange: { minVariantPrice: poa },
    images: [img('alaia-front-new', 'Wawa Alaia, top'), img('alaia-back-new', 'Wawa Alaia, base')],
    featured: true,
  },

  // ── BODY & BELLY ─────────────────────────────
  {
    id: 'mock/handslide',
    handle: 'handslide',
    title: 'Handslide',
    description:
      'Strip it all back and bodysurf. No board to paddle, no pop-up — just you, the wave and pure feel. Locally made by bodysurfers, handmade to last and suited to all levels. Every wave feels overhead, barrels everywhere. The best workout for body and mind. Get closer to the wave. Kick. Laugh.',
    productType: 'Body & Belly',
    tags: ['Bodysurf'],
    availableForSale: true,
    priceRange: { minVariantPrice: zar('1200.00') },
    images: [img('handslide-bs-front', 'Wawa Handslide bodysurfing'), img('handslide-bs-back', 'Wawa Handslide, detail')],
  },
  {
    id: 'mock/bellyboard',
    handle: 'bellyboard',
    title: 'Bellyboard',
    description:
      'Prone wave-riding craft in the paipo lineage — fast, direct and closer to the wave than almost anything. Wrapped in paulownia veneer over a recycled foam core, finished with cork rails. Lighter than it looks, more alive than you’d expect.',
    productType: 'Body & Belly',
    tags: ['Bellyboard'],
    availableForSale: false,
    priceRange: { minVariantPrice: poa },
    images: [img('bellyboard-front', 'Wawa Bellyboard, deck'), img('bellyboard-back', 'Wawa Bellyboard, hull')],
  },

  // ── ACCESSORIES ──────────────────────────────
  {
    id: 'mock/beach-bats',
    handle: 'beach-bats',
    title: 'Wood & Cork Beach Bats',
    description:
      'Handcrafted in Cape Town from sustainably sourced birch and natural cork. Super-light yet strong, the layered timber gives stiffness while the cork core springs lively — less power per hit, effortless control. Sealed with a beeswax-and-oil blend. Set of two bats, ball, gift card and a calico beach bag.',
    productType: 'Accessories',
    tags: ['Beach Bats'],
    availableForSale: false,
    priceRange: { minVariantPrice: poa },
    images: [img('beach-bats-front', 'Wawa wood and cork beach bats'), img('beach-bats-back', 'Wawa beach bats, detail')],
  },
  {
    id: 'mock/cotton-duck-cover',
    handle: 'cotton-duck-cover',
    title: 'Cotton Duck Board Cover',
    description:
      'Premium cotton-duck canvas — heavy-duty, plain-weave, trusted for generations. Protects your board from UV, heat and everyday bumps while keeping wax off your car seats. Engineered for extreme durability; made to last a lifetime of sessions and travel. Quality protection for beautiful wood goods.',
    productType: 'Accessories',
    tags: ['Boardbag'],
    availableForSale: false,
    priceRange: { minVariantPrice: poa },
    images: [img('boardbag-front', 'Wawa cotton duck board cover'), img('boardbag-back', 'Wawa board cover, detail')],
  },
  {
    id: 'mock/geoprene-jacket',
    handle: 'geoprene-jacket',
    title: 'Geoprene Wetsuit Jacket',
    description:
      'For surfers chasing summer swells without the full-suit ritual. Handmade in Cape Town from premium Japanese Yamamoto rubber — a 2mm jacket with super-stretch panels for full range of movement. Glossy Sealskin finish absorbs sunlight to keep you warmer with less rubber. Front zip, cushioned paddling padding.',
    productType: 'Accessories',
    tags: ['Wetsuits'],
    availableForSale: false,
    priceRange: { minVariantPrice: poa },
    images: [img('wetsuit-front', 'Wawa Geoprene wetsuit jacket'), img('wetsuit-back', 'Wawa wetsuit jacket, detail')],
  },
  {
    id: 'mock/fins',
    handle: 'fins',
    title: 'Timber Fins',
    description:
      'Hand-finished timber and cork fins to match your Wawa board — keels, singles and 2+1 sets. Built from the same materials as the boards they drive.',
    productType: 'Accessories',
    tags: ['Fins'],
    availableForSale: false,
    priceRange: { minVariantPrice: poa },
    images: [img('fins-front', 'Wawa timber fins'), img('fins-back', 'Wawa fins, detail')],
  },
];
