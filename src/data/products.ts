import type { Product } from '@/lib/types';

/**
 * Catalog — copy lifted/condensed from the client's NEW/*.docx, structured to
 * the Shopify Storefront shape. Phase 2: replace with a live Storefront fetch,
 * keeping these field names so templates don't change.
 *
 * PRICING: board figures are indicative "From" estimates (custom builds,
 * availableForSale:false → enquire-only). Accessories carry real fixed prices.
 * Replace estimates with client pricing before launch.
 */

const zar = (amount: string) => ({ amount, currencyCode: 'ZAR' });
const img = (name: string, alt: string) => ({ url: `/img/catalog/${name}.jpg`, altText: alt });
// Clean studio board shots live one level up in /img (deck + hull on concrete).
const studio = (name: string, alt: string) => ({ url: `/img/${name}.jpg`, altText: alt });

export const products: Product[] = [
  // ── SURF · Short ─────────────────────────────
  {
    id: 'mock/classic-fish',
    handle: 'classic-fish',
    title: 'Classic Fish',
    description:
      'Fast and loose, the fish was the most progressive board to come out of the 1960s shortboard revolution. A Steve Lis-inspired shape with Larry Gephart keel fins, and one of the most versatile designs you can pack for J-Bay, Buffels or Bali. Domed or bevelled deck.',
    productType: 'Surf',
    tags: ['Short'],
    availableForSale: true,
    priceRange: { minVariantPrice: zar('16500.00') },
    images: [studio('fish-front', 'Wawa Classic Fish, deck'), studio('fish-back', 'Wawa Classic Fish, hull')],
    featured: true,
    // Spec table. Two blocks: performance, then build.
    specs: [
      [
        { label: 'Best For', value: 'Small to large waves' },
        { label: 'Board Feel', value: 'Fast and loose' },
        { label: 'Skill Level', value: "Step up, step down, this one's for everyone" },
      ],
      [
        { label: 'Designer', value: 'Cobus Joubert' },
        { label: 'Material', value: 'Paulownia & cork' },
        { label: 'Finish', value: 'Matte' },
      ],
    ],
  },
  {
    id: 'mock/gun-fish',
    handle: 'gun-fish',
    title: 'Gun Fish',
    description:
      'A higher-performance fish, drawing on Skip Frye, Larry Gephart and Steve Lis. It drives from the centre, and the tapered tail delivers speed and effortless flow in medium to overhead surf. Strong hold, tight pivot and powerful projection. Domed or bevelled deck.',
    productType: 'Surf',
    tags: ['Short'],
    availableForSale: false,
    priceRange: { minVariantPrice: zar('17000.00') },
    images: [img('gun-fish-front', 'Wawa Gun Fish, deck'), img('gun-fish-back', 'Wawa Gun Fish, hull')],
    specs: [
      [
        { label: 'Best For', value: 'Medium to overhead waves' },
        { label: 'Board Feel', value: 'Drive and hold' },
        { label: 'Skill Level', value: 'Intermediate to advanced' },
      ],
      [
        { label: 'Designer', value: 'Cobus Joubert' },
        { label: 'Material', value: 'Paulownia & cork' },
        { label: 'Finish', value: 'Matte' },
      ],
    ],
  },
  {
    id: 'mock/mini-simmons',
    handle: 'mini-simmons',
    title: 'Mini-Simmons',
    description:
      'A tribute to Bob Simmons, one of surfing’s original innovators. Parallel rails, a wide outline and a broad tail give it quick lift and speed. The flat rocker follows planing-hull theory: flat and straight is fast. Playful in weak surf, and a fast, smooth ride when it steps up.',
    productType: 'Surf',
    tags: ['Short'],
    availableForSale: false,
    priceRange: { minVariantPrice: zar('15000.00') },
    images: [img('simmons-front', 'Wawa Mini-Simmons, deck'), img('simmons-back', 'Wawa Mini-Simmons, hull')],
    featured: true,
    specs: [
      [
        { label: 'Best For', value: 'Small to medium waves' },
        { label: 'Board Feel', value: 'Quick and planing' },
        { label: 'Skill Level', value: 'Beginner to advanced' },
      ],
      [
        { label: 'Designer', value: 'Cobus Joubert' },
        { label: 'Material', value: 'Paulownia & cork' },
        { label: 'Finish', value: 'Matte' },
      ],
    ],
  },

  // ── SURF · Mid ───────────────────────────────
  {
    id: 'mock/speed-egg',
    handle: 'speed-egg',
    title: 'Speed Egg',
    description:
      'Born from the late-1960s shortboard revolution and refined by Skip Frye and Steve Lis. A flat rocker and low rails make a fast, smooth single-fin that paddles and duck-dives easily. Built for tight pocket turns, deep bottom turns and long, drawn-out lines.',
    productType: 'Surf',
    tags: ['Mid'],
    availableForSale: true,
    priceRange: { minVariantPrice: zar('16500.00') },
    images: [studio('mid-front', 'Wawa Speed Egg, deck'), studio('mid-back', 'Wawa Speed Egg, hull')],
    featured: true,
    specs: [
      [
        { label: 'Best For', value: 'Small to overhead waves' },
        { label: 'Board Feel', value: 'Smooth and fast' },
        { label: 'Skill Level', value: 'All levels' },
      ],
      [
        { label: 'Designer', value: 'Cobus Joubert' },
        { label: 'Material', value: 'Paulownia & cork' },
        { label: 'Finish', value: 'Matte' },
      ],
    ],
  },
  {
    id: 'mock/long-fish',
    handle: 'long-fish',
    title: 'Long Fish Twin',
    description:
      'Built for flow. Smooth lines through the rocker and outline make it stable and fast. A pulled-in tail adds manoeuvrability in smaller surf and holds when it steps up. Beak nose, soft rails, single-to-double concave and V out the back. Hip-high to overhead.',
    productType: 'Surf',
    tags: ['Mid'],
    availableForSale: false,
    priceRange: { minVariantPrice: zar('18000.00') },
    images: [img('long-fish-front', 'Wawa Long Fish, deck'), img('long-fish-back', 'Wawa Long Fish, hull')],
    featured: true,
    specs: [
      [
        { label: 'Best For', value: 'Hip-high to overhead' },
        { label: 'Board Feel', value: 'Flowing and fast' },
        { label: 'Skill Level', value: 'Intermediate' },
      ],
      [
        { label: 'Designer', value: 'Cobus Joubert' },
        { label: 'Material', value: 'Paulownia & cork' },
        { label: 'Finish', value: 'Matte' },
      ],
    ],
  },

  // ── SURF · Long ──────────────────────────────
  {
    id: 'mock/model-p',
    handle: 'model-p-longboard',
    title: 'Model P Longboard',
    description:
      'Inspired by Dale Velzy’s 1955 Pig. A wide hip set 10″ back from centre trims easily and turns tight, built for riders who’d rather turn than run straight. A single-fin with a wood tail block that comes into its own on glassy small-to-medium days.',
    productType: 'Surf',
    tags: ['Long'],
    availableForSale: true,
    priceRange: { minVariantPrice: zar('28500.00') },
    images: [img('pig-longboard-front', 'Wawa Model P, deck'), img('pig-longboard-back', 'Wawa Model P, hull')],
    featured: true,
    specs: [
      [
        { label: 'Best For', value: 'Small to medium waves' },
        { label: 'Board Feel', value: 'Trim and turn' },
        { label: 'Skill Level', value: 'Intermediate to advanced' },
      ],
      [
        { label: 'Designer', value: 'Cobus Joubert' },
        { label: 'Material', value: 'Paulownia & cork' },
        { label: 'Finish', value: 'Matte' },
      ],
    ],
  },
  {
    id: 'mock/model-t',
    handle: 'model-t-longboard',
    title: 'Model T Longboard',
    description:
      'Inspired by Donald Takayama, the most well-rounded log we make. A broad, easy-to-noseride scoop and a wide, loose tail. Classic 50/50 rails, single fin, square tail, with timber-and-cork over EPS construction. A smooth, controlled glide in surf big and especially small.',
    productType: 'Surf',
    tags: ['Long'],
    availableForSale: true,
    priceRange: { minVariantPrice: zar('28500.00') },
    images: [studio('longboard-front', 'Wawa Model T, deck'), studio('longboard-back', 'Wawa Model T, hull')],
    specs: [
      [
        { label: 'Best For', value: 'Small to medium waves' },
        { label: 'Board Feel', value: 'Smooth and controlled' },
        { label: 'Skill Level', value: 'All levels' },
      ],
      [
        { label: 'Designer', value: 'Cobus Joubert' },
        { label: 'Material', value: 'Timber & cork over EPS' },
        { label: 'Finish', value: 'Matte' },
      ],
    ],
  },

  {
    id: 'mock/model-l',
    handle: 'model-l-longboard',
    title: 'Model L Longboard',
    description:
      'Our ultra high-performance log, built for speed, control and modern manoeuvres in a classic outline. Thinner, with more rocker and less volume than the Model T and Model P, so it handles steeper waves and tighter pockets with ease. A responsive 2+1 fin setup, foiled rails, a refined nose scoop and a fast double concave into a vee tail. The plan shape and foil hold their line on late drops. A true speedster, small surf to serious.',
    productType: 'Surf',
    tags: ['Long'],
    availableForSale: false,
    priceRange: { minVariantPrice: zar('30000.00') },
    images: [img('model-l-front', 'Wawa Model L, deck'), img('model-l-back', 'Wawa Model L, hull')],
    specs: [
      [
        { label: 'Best For', value: 'Small surf to serious' },
        { label: 'Board Feel', value: 'Fast and responsive' },
        { label: 'Skill Level', value: 'Advanced' },
      ],
      [
        { label: 'Designer', value: 'Cobus Joubert' },
        { label: 'Material', value: 'Paulownia & cork' },
        { label: 'Finish', value: 'Matte' },
      ],
    ],
  },

  // ── SURF · Finless ───────────────────────────
  {
    id: 'mock/alaia',
    handle: 'alaia',
    title: 'Alaia',
    description:
      'If our paipos are punk rock, the alaia is Miles Davis. Thin, flat-rockered and sealed with oil, ridden standing and on a rail. It glides in a way foam can’t, a throwback to surfing’s Polynesian roots. Hand-shaped from solid timber since 2010. Four models: Classic, Trigger, Trick and Needle.',
    productType: 'Surf',
    tags: ['Finless'],
    availableForSale: false,
    priceRange: { minVariantPrice: zar('12000.00') },
    images: [studio('alaia-front', 'Wawa Alaia, top'), studio('alaia-back', 'Wawa Alaia, base')],
    featured: true,
    specs: [
      [
        { label: 'Best For', value: 'Clean, open faces' },
        { label: 'Board Feel', value: 'Fast and slippery' },
        { label: 'Skill Level', value: 'Advanced' },
      ],
      [
        { label: 'Designer', value: 'Cobus Joubert' },
        { label: 'Material', value: 'Solid timber' },
        { label: 'Finish', value: 'Oiled' },
      ],
    ],
  },

  // ── FOIL ─────────────────────────────────────
  {
    id: 'mock/foil-prone',
    handle: 'foil-prone',
    title: 'Prone Foilboard',
    description:
      'A compact prone deck for paddling into swell and flying. Over time the ocean works the paulownia-and-cork shell into a textured “speed skin” that cuts drag and adds lift, in water and in air. Stable on the belly, loose once it lifts.',
    productType: 'Foil',
    tags: ['Prone'],
    availableForSale: false,
    priceRange: { minVariantPrice: zar('19000.00') },
    images: [img('foil-prone-front', 'Wawa prone foilboard, deck'), img('foil-prone-back', 'Wawa prone foilboard, hull')],
    specs: [
      [
        { label: 'Best For', value: 'Open-ocean swell' },
        { label: 'Board Feel', value: 'Stable then loose' },
        { label: 'Skill Level', value: 'Intermediate to advanced' },
      ],
      [
        { label: 'Designer', value: 'Cobus Joubert' },
        { label: 'Material', value: 'Paulownia & cork' },
        { label: 'Finish', value: 'Speed skin' },
      ],
    ],
  },
  {
    id: 'mock/foil-wave',
    handle: 'foil-wave',
    title: 'Wave Foilboard',
    description:
      'Built to draw long, quiet lines off open-ocean swell. Timber-and-cork construction tuned for the surf foil, with enough volume to find the wave and a pulled outline to carve once the foil takes over. Light and lively.',
    productType: 'Foil',
    tags: ['Wave'],
    availableForSale: false,
    priceRange: { minVariantPrice: zar('20000.00') },
    images: [img('foil-wave-front', 'Wawa wave foilboard, deck'), img('foil-wave-back', 'Wawa wave foilboard, hull')],
    featured: true,
    specs: [
      [
        { label: 'Best For', value: 'Open-ocean swell' },
        { label: 'Board Feel', value: 'Light and lively' },
        { label: 'Skill Level', value: 'Intermediate to advanced' },
      ],
      [
        { label: 'Designer', value: 'Cobus Joubert' },
        { label: 'Material', value: 'Timber & cork' },
        { label: 'Finish', value: 'Speed skin' },
      ],
    ],
  },
  {
    id: 'mock/foil-wing',
    handle: 'foil-wing',
    title: 'Wing Foilboard',
    description:
      'For wind and wing. A forgiving, stable platform in the same paulownia-and-cork build, sized to get up early and stay locked in. The “speed skin” exterior cuts drag as the board breaks free of the water.',
    productType: 'Foil',
    tags: ['Wing'],
    availableForSale: false,
    priceRange: { minVariantPrice: zar('20000.00') },
    images: [img('foil-wing-front', 'Wawa wing foilboard, deck'), img('foil-wing-back', 'Wawa wing foilboard, hull')],
    specs: [
      [
        { label: 'Best For', value: 'Wind and wing' },
        { label: 'Board Feel', value: 'Stable and forgiving' },
        { label: 'Skill Level', value: 'Beginner to intermediate' },
      ],
      [
        { label: 'Designer', value: 'Cobus Joubert' },
        { label: 'Material', value: 'Paulownia & cork' },
        { label: 'Finish', value: 'Speed skin' },
      ],
    ],
  },
  {
    id: 'mock/foil-custom',
    handle: 'foil-custom',
    title: 'Custom Foilboard',
    description:
      'Your dimensions, your discipline. Prone, wave or wing, shaped to your weight, wind and home break in timber over recycled foam with cork rails. Get in touch to start a build.',
    productType: 'Foil',
    tags: ['Custom'],
    availableForSale: false,
    priceRange: { minVariantPrice: zar('22000.00') },
    images: [img('foil-custom-front', 'Wawa custom foilboard, deck'), img('foil-custom-back', 'Wawa custom foilboard, hull')],
    specs: [
      [
        { label: 'Best For', value: 'Your discipline' },
        { label: 'Board Feel', value: 'Built to spec' },
        { label: 'Skill Level', value: 'All levels' },
      ],
      [
        { label: 'Designer', value: 'Cobus Joubert' },
        { label: 'Material', value: 'Timber over recycled foam, cork rails' },
        { label: 'Finish', value: 'Speed skin' },
      ],
    ],
  },

  // ── KITE ─────────────────────────────────────
  {
    id: 'mock/kite-tomo',
    handle: 'kite-tomo',
    title: 'Tomo Kiteboard',
    description:
      'A Tomo-inspired outline tuned for wind: compact, fast and direct. The same timber-and-cork construction as the boards, with stiff flex and controlled energy return for a clean connection to the water.',
    productType: 'Kite',
    tags: ['Tomo'],
    availableForSale: false,
    priceRange: { minVariantPrice: zar('14000.00') },
    images: [img('kite-tomo-front', 'Wawa Tomo kiteboard, deck'), img('kite-tomo-back', 'Wawa Tomo kiteboard, base')],
    specs: [
      [
        { label: 'Best For', value: 'Strong wind' },
        { label: 'Board Feel', value: 'Fast and direct' },
        { label: 'Skill Level', value: 'Intermediate to advanced' },
      ],
      [
        { label: 'Designer', value: 'Cobus Joubert' },
        { label: 'Material', value: 'Timber & cork' },
        { label: 'Finish', value: 'Matte' },
      ],
    ],
  },
  {
    id: 'mock/kite-trick',
    handle: 'kite-trick',
    title: 'Trick Kiteboard',
    description:
      'Built to pop and play. A lively twin-tip shape in paulownia and cork, tuned for snappy energy return off the water. Loose enough for tricks, stiff enough to hold an edge upwind.',
    productType: 'Kite',
    tags: ['Trick'],
    availableForSale: false,
    priceRange: { minVariantPrice: zar('14000.00') },
    images: [img('kite-trick-front', 'Wawa Trick kiteboard, deck'), img('kite-trick-back', 'Wawa Trick kiteboard, base')],
    specs: [
      [
        { label: 'Best For', value: 'Flat water and chop' },
        { label: 'Board Feel', value: 'Lively and snappy' },
        { label: 'Skill Level', value: 'Intermediate to advanced' },
      ],
      [
        { label: 'Designer', value: 'Cobus Joubert' },
        { label: 'Material', value: 'Paulownia & cork' },
        { label: 'Finish', value: 'Matte' },
      ],
    ],
  },
  {
    id: 'mock/kite-vlieer',
    handle: 'kite-vlieer',
    title: 'Vlieer Kiteboard',
    description:
      'The Vlieer, a directional shape for riders chasing flow over flat water and small wind swell. Timber-and-cork build for a smooth, damp ride and a direct line to the kite.',
    productType: 'Kite',
    tags: ['Vlieer'],
    availableForSale: false,
    priceRange: { minVariantPrice: zar('15000.00') },
    images: [img('kite-vlieer-front', 'Wawa Vlieer kiteboard, deck'), img('kite-vlieer-back', 'Wawa Vlieer kiteboard, base')],
    specs: [
      [
        { label: 'Best For', value: 'Flat water and small swell' },
        { label: 'Board Feel', value: 'Smooth and damp' },
        { label: 'Skill Level', value: 'Intermediate' },
      ],
      [
        { label: 'Designer', value: 'Cobus Joubert' },
        { label: 'Material', value: 'Timber & cork' },
        { label: 'Finish', value: 'Matte' },
      ],
    ],
  },

  // ── SKATE ────────────────────────────────────
  {
    id: 'mock/wooden-cruiser',
    handle: 'wooden-cruiser',
    title: 'Wooden Cruiser',
    description:
      'For the days the sea goes flat. A wooden cruiser built from the same paulownia and cork as the boards, warm underfoot and lively through a turn, finished to age with salt and sun. Keep surfing when there’s no surf.',
    productType: 'Skate',
    tags: [],
    availableForSale: false,
    priceRange: { minVariantPrice: zar('4500.00') },
    images: [img('wooden-cruiser-front', 'Wawa wooden cruiser, top'), img('wooden-cruiser-back', 'Wawa wooden cruiser, base')],
    specs: [
      [
        { label: 'Best For', value: 'Flat days and cruising' },
        { label: 'Board Feel', value: 'Warm and lively' },
        { label: 'Skill Level', value: 'All levels' },
      ],
      [
        { label: 'Designer', value: 'Cobus Joubert' },
        { label: 'Material', value: 'Paulownia & cork' },
        { label: 'Finish', value: 'Matte' },
      ],
    ],
  },

  // ── BODY & BELLY ─────────────────────────────
  {
    id: 'mock/paipo',
    handle: 'paipo',
    title: 'Paipo',
    description:
      'Along with the alaia, the wave-riding craft of pre-contact Hawaii. Short, wide and fast, the punk rock of surfing, ridden finned after the boards of Valentine Chang or finless. Four models: the Bullet, a fast prone bodyboard ridden with swim fins; the Godfather, a wide planing hull built purely for speed; Dr. Strangelove, a tiny solid-wood mini Simmons with twin keels and a kicked nose for steep drops; and Purple Haze, a one-off shaped from Himalayan timber that turns purple once oiled.',
    productType: 'Body & Belly',
    tags: ['Paipo'],
    availableForSale: false,
    priceRange: { minVariantPrice: zar('9000.00') },
    images: [img('paipo-front', 'Wawa Paipo, top'), img('paipo-back', 'Wawa Paipo, base')],
    specs: [
      [
        { label: 'Best For', value: 'Punchy beach breaks' },
        { label: 'Board Feel', value: 'Short and fast' },
        { label: 'Skill Level', value: 'All levels' },
      ],
      [
        { label: 'Designer', value: 'Cobus Joubert' },
        { label: 'Material', value: 'Paulownia & cork' },
        { label: 'Finish', value: 'Finned or finless' },
      ],
    ],
  },
  {
    id: 'mock/handslide',
    handle: 'handslide',
    title: 'Handslide',
    description:
      'Strip it all back and bodysurf. No board to paddle, no pop-up, just you, the wave and the feel. Made locally by bodysurfers, built to last and suited to every level. Every wave feels overhead, barrels everywhere. Get closer to the wave. Kick. Laugh.',
    productType: 'Body & Belly',
    tags: ['Bodysurf'],
    availableForSale: true,
    priceRange: { minVariantPrice: zar('1200.00') },
    images: [studio('handslide-front', 'Wawa Handslide, top'), studio('handslide-back', 'Wawa Handslide, base')],
    featured: true,
    specs: [
      [
        { label: 'Best For', value: 'Any wave' },
        { label: 'Board Feel', value: 'Fast and direct' },
        { label: 'Skill Level', value: 'All levels' },
      ],
      [
        { label: 'Designer', value: 'Cobus Joubert' },
        { label: 'Material', value: 'Paulownia & cork' },
        { label: 'Finish', value: 'Matte' },
      ],
    ],
  },
  {
    id: 'mock/bellyboard',
    handle: 'bellyboard',
    title: 'Bellyboard',
    description:
      'Prone wave-riding craft in the paipo lineage: fast, direct and about as close to the wave as you can get. Paulownia veneer over a recycled foam core, finished with cork rails. Lighter than it looks.',
    productType: 'Body & Belly',
    tags: ['Bellyboard'],
    availableForSale: false,
    priceRange: { minVariantPrice: zar('6000.00') },
    images: [studio('bodyboard-front', 'Wawa Bellyboard, deck'), studio('bodyboard-back', 'Wawa Bellyboard, hull')],
    specs: [
      [
        { label: 'Best For', value: 'Punchy beach breaks' },
        { label: 'Board Feel', value: 'Fast and direct' },
        { label: 'Skill Level', value: 'All levels' },
      ],
      [
        { label: 'Designer', value: 'Cobus Joubert' },
        { label: 'Material', value: 'Paulownia veneer over recycled foam, cork rails' },
        { label: 'Finish', value: 'Matte' },
      ],
    ],
  },

  // ── ACCESSORIES ──────────────────────────────
  {
    id: 'mock/beach-bats',
    handle: 'beach-bats',
    title: 'Wood & Cork Beach Bats',
    description:
      'Made in Cape Town from sustainably sourced birch and natural cork. Light but strong: the layered timber adds stiffness while the cork core gives a lively spring, so you get less power per hit and more control. Sealed with a beeswax-and-oil blend. Set of two bats, ball, gift card and a calico beach bag.',
    productType: 'Accessories',
    tags: ['Beach Bats'],
    availableForSale: true,
    variantId: '41267104809024',
    priceRange: { minVariantPrice: zar('999.00') },
    images: [img('beach-bats-front', 'Wawa wood and cork beach bats'), img('beach-bats-back', 'Wawa beach bats, detail')],
    specs: [
      [
        { label: 'Used For', value: 'Beach games' },
        { label: 'In the Set', value: 'Two bats, ball, gift card & beach bag' },
        { label: 'For', value: 'All ages' },
      ],
      [
        { label: 'Material', value: 'Birch & cork' },
        { label: 'Finish', value: 'Beeswax & oil' },
        { label: 'Made In', value: 'Cape Town' },
      ],
    ],
  },
  {
    id: 'mock/cotton-duck-cover',
    handle: 'cotton-duck-cover',
    title: 'Cotton Duck Board Cover',
    description:
      'Heavy-duty plain-weave cotton-duck canvas. Shields your board from UV, heat and everyday knocks, and keeps wax off your car seats. Built to take years of sessions and travel.',
    productType: 'Accessories',
    tags: ['Boardbag'],
    availableForSale: true,
    variantId: '41267104841792',
    priceRange: { minVariantPrice: zar('999.00') },
    images: [img('boardbag-front', 'Wawa cotton duck board cover'), img('boardbag-back', 'Wawa board cover, detail')],
    specs: [
      [
        { label: 'Used For', value: 'Storage & travel' },
        { label: 'Protects From', value: 'UV, heat & everyday knocks' },
        { label: 'Fits', value: 'Single board' },
      ],
      [
        { label: 'Material', value: 'Cotton-duck canvas' },
        { label: 'Weave', value: 'Heavy-duty plain weave' },
      ],
    ],
  },
  {
    id: 'mock/geoprene-jacket',
    handle: 'geoprene-jacket',
    title: 'Geoprene Wetsuit Jacket',
    description:
      'For summer swells, when you don’t want the full suit. Made in Cape Town from Japanese Yamamoto rubber: a 2mm jacket with super-stretch panels for a full range of movement. The glossy Sealskin finish soaks up sunlight to keep you warmer with less rubber. Front zip, padded chest for paddling.',
    productType: 'Accessories',
    tags: ['Wetsuits'],
    availableForSale: true,
    variantId: '41267104874560',
    priceRange: { minVariantPrice: zar('999.00') },
    images: [img('wetsuit-front', 'Wawa Geoprene wetsuit jacket'), img('wetsuit-back', 'Wawa wetsuit jacket, detail')],
    specs: [
      [
        { label: 'Used For', value: 'Summer swells' },
        { label: 'Thickness', value: '2mm' },
        { label: 'Features', value: 'Front zip, padded chest' },
      ],
      [
        { label: 'Material', value: 'Japanese Yamamoto rubber' },
        { label: 'Finish', value: 'Glossy Sealskin' },
        { label: 'Made In', value: 'Cape Town' },
      ],
    ],
  },
  {
    id: 'mock/fins',
    handle: 'fins',
    title: 'Timber Fins',
    description:
      'Hand-finished timber and cork fins to match your Wawa board: keels, singles and 2+1 sets. Built from the same materials as the boards they drive.',
    productType: 'Accessories',
    tags: ['Fins'],
    availableForSale: true,
    variantId: '41267104907328',
    priceRange: { minVariantPrice: zar('999.00') },
    images: [img('fins-front', 'Wawa timber fins'), img('fins-back', 'Wawa fins, detail')],
    specs: [
      [
        { label: 'Used For', value: 'Driving your Wawa board' },
        { label: 'Configurations', value: 'Keels, singles & 2+1 sets' },
      ],
      [
        { label: 'Material', value: 'Timber & cork' },
        { label: 'Finish', value: 'Hand-finished' },
      ],
    ],
  },
  {
    id: 'mock/wax-comb',
    handle: 'wooden-wax-comb',
    title: 'Wooden Wax Comb',
    description:
      'A wax comb made the same way as the boards, from offcut paulownia and cork, hand-shaped and sealed. Combs your bumps and scrapes old wax, and feels good in the hand. Small thing, same craft.',
    productType: 'Accessories',
    tags: ['Wax Combs'],
    availableForSale: true,
    variantId: '41267104940096',
    priceRange: { minVariantPrice: zar('999.00') },
    images: [img('wax-comb', 'Wawa wooden wax comb')],
    specs: [
      [
        { label: 'Used For', value: 'Combing bumps & scraping old wax' },
      ],
      [
        { label: 'Material', value: 'Offcut paulownia & cork' },
        { label: 'Finish', value: 'Hand-shaped & sealed' },
      ],
    ],
  },
  {
    id: 'mock/art-prints',
    handle: 'posters-and-prints',
    title: 'Posters & Prints',
    description:
      'Original artwork and prints from the Wawa world: timber, ocean and the craft behind the boards. Pieces for the wall, made to hang alongside the boards.',
    productType: 'Accessories',
    tags: ['Art'],
    availableForSale: true,
    variantId: '41267104972864',
    priceRange: { minVariantPrice: zar('999.00') },
    images: [img('art-prints-front', 'Wawa poster print'), img('art-prints-back', 'Wawa art print, detail')],
    specs: [
      [
        { label: 'Used For', value: 'Wall art' },
        { label: 'Subject', value: 'Timber, ocean & the craft' },
      ],
      [
        { label: 'Format', value: 'Original artwork & prints' },
      ],
    ],
  },
  {
    id: 'mock/myo-experience',
    handle: 'make-your-own-surfboard',
    title: 'Make Your Own Surfboard',
    description:
      'Surfing a board you made yourself is addictive, and it ties you to the generations who treated shaping as a rite of passage. Seven 3-hour sessions in our workshop: transfer the shape, plane the blank, profile the rocker, vacuum-bag the timber and cork rails, set fin boxes, then sand, brand and seal. Hard work, real reward. Also available as a gift card.',
    productType: 'Accessories',
    tags: ['Gift Cards'],
    availableForSale: true,
    variantId: '41267105005632',
    priceRange: { minVariantPrice: zar('999.00') },
    images: [img('myo-experience-front', 'Wawa make your own surfboard experience'), img('myo-experience-back', 'Wawa shaping workshop, detail')],
    specs: [
      [
        { label: 'Used For', value: 'Shaping your own surfboard' },
        { label: 'Format', value: 'Seven 3-hour sessions' },
        { label: 'Location', value: 'Our workshop' },
      ],
      [
        { label: 'You Build', value: 'Timber & cork board, blank to seal' },
        { label: 'Also', value: 'Available as a gift card' },
      ],
    ],
  },
];
