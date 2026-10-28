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

/**
 * Studio shots — the product against the workshop wall, one front/back pair per
 * set. Only shot products carry a set; everything else gets `soon()`, the same
 * room with nothing in it, so an unshot product reads as staged-and-waiting
 * rather than broken. Promoting a product is a one-line swap once its pair lands
 * in /img/product as `<name>-front.webp` / `<name>-back.webp`.
 */
const studioSet = (name: string) => ({
  front: (alt: string) => ({ url: `/img/product/${name}-front.webp`, altText: alt }),
  back: (alt: string) => ({ url: `/img/product/${name}-back.webp`, altText: alt }),
});
const fish = studioSet('fish');
const mid = studioSet('mid');
const alaia = studioSet('alaia');
const bodyboard = studioSet('bodyboard');
const long = studioSet('long');
const gunFish = studioSet('gun-fish');
const woodIsGood = studioSet('wood-is-good-tee');
const tote = studioSet('tote');
const carryall = studioSet('carryall');
const cruiser = studioSet('cruiser');
const foilWave = studioSet('foil-wave');
const foilProne = studioSet('foil-prone');
const kiteTomo = studioSet('kite-tomo');
const prints = studioSet('prints');
const geoprene = studioSet('geoprene');
const wetsuitSling = studioSet('wetsuit-sling');
const togRegular = studioSet('tog-bag-regular');
const crestTee = studioSet('crest-tee');
const swallowTee = studioSet('swallow-tee');
const beachBats = studioSet('beach-bats');
const paipo = studioSet('paipo');
const handslide = studioSet('handslide');
const boardCover = studioSet('board-cover');
const giftCard = studioSet('gift-card');
const waxComb = studioSet('wax-comb');
const speedEgg = studioSet('speed-egg');
const spex = studioSet('spex');

/** Empty-room plate for anything not yet photographed. One image, so no hover swap. */
const soon = (title: string) => [
  { url: '/img/product/background.webp', altText: `${title} — photography coming soon`, placeholder: true },
];

/** Gift card denominations: R100–R10,000 in R100 steps (100 Shopify variants). */
const GIFT_CARD_AMOUNTS = Array.from({ length: 100 }, (_, i) => 100 + i * 100);
/** Shopify variant id per gift-card amount (the "Gift Card" gift-card product). */
const GIFT_CARD_IDS: Record<number, string> = {
  100: '41465438830656', 200: '41465439748160', 300: '41465439780928', 400: '41465439813696',
  500: '41465439846464', 600: '41465439879232', 700: '41465439912000', 800: '41465439944768',
  900: '41465439977536', 1000: '41465440010304', 1100: '41465440043072', 1200: '41465440075840',
  1300: '41465440108608', 1400: '41465440141376', 1500: '41465440174144', 1600: '41465440206912',
  1700: '41465440239680', 1800: '41465440272448', 1900: '41465440305216', 2000: '41465440337984',
  2100: '41465440370752', 2200: '41465440403520', 2300: '41465440436288', 2400: '41465440469056',
  2500: '41465440501824', 2600: '41465440534592', 2700: '41465440567360', 2800: '41465440600128',
  2900: '41465440632896', 3000: '41465440665664', 3100: '41465440698432', 3200: '41465440731200',
  3300: '41465440763968', 3400: '41465440796736', 3500: '41465440829504', 3600: '41465440862272',
  3700: '41465440895040', 3800: '41465440927808', 3900: '41465440960576', 4000: '41465440993344',
  4100: '41465441026112', 4200: '41465441058880', 4300: '41465441091648', 4400: '41465441124416',
  4500: '41465441157184', 4600: '41465441189952', 4700: '41465441222720', 4800: '41465441255488',
  4900: '41465441288256', 5000: '41465441321024', 5100: '41465441353792', 5200: '41465441386560',
  5300: '41465441419328', 5400: '41465441452096', 5500: '41465441484864', 5600: '41465441517632',
  5700: '41465441550400', 5800: '41465441583168', 5900: '41465441615936', 6000: '41465441648704',
  6100: '41465441681472', 6200: '41465441714240', 6300: '41465441747008', 6400: '41465441779776',
  6500: '41465441812544', 6600: '41465441845312', 6700: '41465441878080', 6800: '41465441910848',
  6900: '41465441943616', 7000: '41465441976384', 7100: '41465442009152', 7200: '41465442041920',
  7300: '41465442074688', 7400: '41465442107456', 7500: '41465442140224', 7600: '41465442172992',
  7700: '41465442205760', 7800: '41465442238528', 7900: '41465442271296', 8000: '41465442304064',
  8100: '41465442336832', 8200: '41465442369600', 8300: '41465442402368', 8400: '41465442435136',
  8500: '41465442467904', 8600: '41465442500672', 8700: '41465442533440', 8800: '41465442566208',
  8900: '41465442598976', 9000: '41465442631744', 9100: '41465442664512', 9200: '41465442697280',
  9300: '41465442730048', 9400: '41465442762816', 9500: '41465442795584', 9600: '41465442828352',
  9700: '41465442861120', 9800: '41465442893888', 9900: '41465442926656', 10000: '41465442959424',
};

export const products: Product[] = [
  // ── SURF · Short ─────────────────────────────
  {
    id: 'mock/classic-fish',
    handle: 'classic-fish',
    title: 'Classic Fish',
    description:
      'Fast and loose, with roots in the 1960s shortboard revolution. A Steve Lis-inspired shape with Larry Gephart keel fins, and one of the most versatile designs you can pack for J-Bay, Buffels or Bali. Domed or bevelled deck.',
    productType: 'Surf',
    tags: ['Short'],
    availableForSale: true,
    priceRange: { minVariantPrice: zar('17500.00') },
    images: [fish.front('Wawa Classic Fish, deck'), fish.back('Wawa Classic Fish, hull')],
    featured: 2,
    // Spec table. Two blocks: performance, then build.
    specs: [
      [
        { label: 'Best For', value: 'Small to large waves' },
        { label: 'Board Feel', value: 'Fast and loose' },
        { label: 'Skill Level', value: 'Ask us about sizing for your experience' },
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
    priceRange: { minVariantPrice: zar('17500.00') },
    images: [gunFish.front('Wawa Gun Fish, deck'), gunFish.back('Wawa Gun Fish, hull')],
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
    priceRange: { minVariantPrice: zar('17500.00') },
    images: soon('Wawa Mini-Simmons'),
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
      'Born from the late-1960s shortboard revolution and refined by Skip Frye and Steve Lis. A flat rocker and low rails make a fast, smooth single-fin. Talk to us about dimensions to suit your paddling and the waves you ride. Built for tight pocket turns, deep bottom turns and long, drawn-out lines.',
    productType: 'Surf',
    tags: ['Mid'],
    availableForSale: true,
    priceRange: { minVariantPrice: zar('19500.00') },
    images: [
      speedEgg.front('Wawa Speed Egg deck in paulownia with cork rails'),
      speedEgg.back('Wawa Speed Egg bottom with single fin box'),
    ],
    featured: 4,
    specs: [
      [
        { label: 'Best For', value: 'Small to overhead waves' },
        { label: 'Board Feel', value: 'Smooth and fast' },
        { label: 'Skill Level', value: 'Ask us about sizing for your experience' },
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
    priceRange: { minVariantPrice: zar('19500.00') },
    images: [mid.front('Wawa Long Fish, deck'), mid.back('Wawa Long Fish, hull')],
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
    priceRange: { minVariantPrice: zar('22500.00') },
    images: soon('Wawa Model P'),
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
    priceRange: { minVariantPrice: zar('22500.00') },
    images: [long.front('Wawa Model T Longboard, deck'), long.back('Wawa Model T Longboard, hull')],
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
    priceRange: { minVariantPrice: zar('22500.00') },
    images: soon('Wawa Model L'),
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
    availableForSale: true,
    variantId: '41465932841024',
    priceRange: { minVariantPrice: zar('12000.00') },
    images: [alaia.front('Wawa Alaia, top'), alaia.back('Wawa Alaia, base')],
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
      'A compact prone deck with a paulownia-and-cork shell, built for paddling into swell and getting onto the foil. Talk to us about dimensions and compatibility with your foil setup.',
    productType: 'Foil',
    tags: ['Prone'],
    availableForSale: false,
    priceRange: { minVariantPrice: zar('30000.00') },
    images: [foilProne.front('Wawa Prone Foilboard, deck'), foilProne.back('Wawa Prone Foilboard, hull with foil tracks')],
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
    priceRange: { minVariantPrice: zar('30000.00') },
    images: [foilWave.front('Wawa Wave Foilboard, deck'), foilWave.back('Wawa Wave Foilboard, hull with foil tracks')],
    featured: 6,
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
      'For wind and wing. A stable platform in paulownia and cork, sized for your weight, wind conditions and foil setup. Get in touch to discuss the right volume for your riding.',
    productType: 'Foil',
    tags: ['Wing'],
    availableForSale: false,
    priceRange: { minVariantPrice: zar('35000.00') },
    images: soon('Wawa wing foilboard'),
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
    priceRange: { minVariantPrice: zar('25000.00') },
    images: [kiteTomo.front('Wawa Tomo Kiteboard, deck'), kiteTomo.back('Wawa Tomo Kiteboard, hull with fins')],
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
    priceRange: { minVariantPrice: zar('25000.00') },
    images: soon('Wawa Trick kiteboard'),
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
    priceRange: { minVariantPrice: zar('25000.00') },
    images: soon('Wawa Vlieer kiteboard'),
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
      'For the days the sea goes flat. A wooden cruiser built from the same paulownia and cork as the boards, warm underfoot and lively through a turn, finished to age with salt and sun. Keep surfing when there’s no surf. 30–40" long, as a deck on its own or complete with trucks, wheels and bearings.',
    productType: 'Skate',
    tags: [],
    availableForSale: true,
    optionName: 'Setup',
    variants: [
      { title: 'Deck', id: '41465932873792', price: '2750.00' },
      { title: 'Complete', id: '41465932906560', price: '6000.00' },
    ],
    priceRange: { minVariantPrice: zar('2750.00') },
    // one shot so far — no back, so no hover swap
    images: [cruiser.front('Wawa Wooden Cruiser, deck')],
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
  {
    id: 'mock/wooden-surfskate',
    handle: 'wooden-surfskate',
    title: 'Wooden Surfskate',
    description:
      'The cruiser’s shorter, surfier sibling. A 28–30" paulownia and cork deck for tight, flowing carves on flat days, with a rounded or swallow tail. Buy the deck on its own, or complete with trucks, wheels and bearings.',
    productType: 'Skate',
    tags: [],
    availableForSale: true,
    optionName: 'Tail & setup',
    variants: [
      { title: 'Rounded tail, deck', id: '41465932939328', price: '2750.00' },
      { title: 'Rounded tail, complete', id: '41465932972096', price: '6000.00' },
      { title: 'Swallow tail, deck', id: '41465933004864', price: '2750.00' },
      { title: 'Swallow tail, complete', id: '41465933037632', price: '6000.00' },
    ],
    priceRange: { minVariantPrice: zar('2750.00') },
    images: soon('Wawa Wooden Surfskate'),
    specs: [
      [
        { label: 'Best For', value: 'Flat days and carving' },
        { label: 'Board Feel', value: 'Tight and surfy' },
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
      'Short, wide and fast: the punk rock of surfing, with roots in Hawaiian wave riding. Choose finned or finless. The Bullet is a prone bodyboard ridden with swim fins. The Godfather is a wide planing hull built for speed. Dr. Strangelove is a small solid-wood Mini-Simmons with twin keels and a kicked nose. Purple Haze is a one-off timber shape. Ask us about each model’s construction and availability.',
    productType: 'Body & Belly',
    tags: ['Paipo'],
    availableForSale: true,
    optionName: 'Size',
    variants: [
      { title: '3ft', id: '41465789841472', price: '3000.00' },
      { title: '4ft', id: '41465789874240', price: '4000.00' },
      { title: '3ft, custom colour', id: '41465789907008', price: '3750.00' },
      { title: '4ft, custom colour', id: '41465789939776', price: '4750.00' },
    ],
    priceRange: { minVariantPrice: zar('3000.00') },
    images: [
      paipo.front('Four Wawa paipos leaning on a sunlit wall, painted PAIPO and octopus graphics'),
      paipo.back('Four Wawa paipos showing their branded sides, solid timber grain'),
    ],
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
      'Strip it all back and bodysurf. A small handplane made locally by bodysurfers, with no pop-up between you and the wave. Ask us about choosing a shape for your experience and conditions. Get closer to the wave. Kick. Laugh. Comes with a Wawa-branded calico bag.',
    productType: 'Body & Belly',
    tags: ['Bodysurf'],
    availableForSale: true,
    optionName: 'Hand strap',
    variants: [
      { title: 'Red webbing', id: '41465789972544', price: '950.00' },
      { title: 'Adjustable neoprene', id: '41465790005312', price: '1950.00' },
    ],
    priceRange: { minVariantPrice: zar('950.00') },
    images: [
      handslide.front('Wawa handslide with red hand strap and burnt-in logo, held against a sunlit wall'),
      handslide.back('Wawa handslide underside with floral inlay under resin, swallow tail'),
    ],
    featured: 1,
    specs: [
      [
        { label: 'Best For', value: 'Bodysurfing' },
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
    id: 'mock/bodyboard',
    handle: 'bodyboard',
    title: 'Bodyboard',
    description:
      'Prone wave-riding craft in the paipo lineage: fast, direct and about as close to the wave as you can get. A full cork deck for grip and warmth underneath you, a recycled foam core, and a paulownia wood bottom. Lighter than it looks.',
    productType: 'Body & Belly',
    tags: ['Bodyboard'],
    availableForSale: true,
    variantId: '41465933070400',
    priceRange: { minVariantPrice: zar('6500.00') },
    images: [bodyboard.front('Wawa Bodyboard, deck'), bodyboard.back('Wawa Bodyboard, hull')],
    featured: 7,
    specs: [
      [
        { label: 'Best For', value: 'Punchy beach breaks' },
        { label: 'Board Feel', value: 'Fast and direct' },
        { label: 'Skill Level', value: 'All levels' },
      ],
      [
        { label: 'Designer', value: 'Cobus Joubert' },
        { label: 'Material', value: 'Cork deck, recycled foam core, paulownia bottom' },
        { label: 'Finish', value: 'Matte' },
      ],
    ],
  },

  // ── ACCESSORIES ──────────────────────────────
  {
    id: 'mock/cotton-duck-cover',
    handle: 'cotton-duck-cover',
    title: 'Cotton Duck Board Cover',
    description:
      'Heavy-duty plain-weave cotton-duck canvas. Shields your board from UV, heat and everyday knocks, and keeps wax off your car seats. Built to take years of sessions and travel.',
    productType: 'Accessories',
    tags: ['Boardbag'],
    availableForSale: true,
    // One Shopify variant per length.
    variants: [
      { title: `5'0"`, id: '41464872206400', price: '2250.00' },
      { title: `7'0"`, id: '41464872239168', price: '2950.00' },
      { title: `9'6"`, id: '41464872271936', price: '3500.00' },
    ],
    priceRange: { minVariantPrice: zar('2250.00') },
    images: [boardCover.front('Wawa cotton duck board cover with yellow and orange stripes, leaning on a sunlit wall')],
    specs: [
      [
        { label: 'Used For', value: 'Storage & travel' },
        { label: 'Protects From', value: 'UV, heat & everyday knocks' },
        { label: 'Fits', value: 'Single board' },
        { label: 'Sizes', value: `5'0", 7'0", 9'6"` },
      ],
      [
        { label: 'Material', value: 'Cotton-duck canvas' },
        { label: 'Weave', value: 'Heavy-duty plain weave' },
      ],
    ],
  },
  {
    id: 'mock/canvas-tote',
    handle: 'canvas-tote',
    title: 'Canvas Tote',
    description:
      'A natural canvas tote with long shoulder straps, printed in ocean blue with the Wawa crest: a board through the waves, palms either side, Cape Town underneath.',
    productType: 'Accessories',
    tags: ['Bags'],
    availableForSale: true,
    variantId: '41464879448128',
    priceRange: { minVariantPrice: zar('250.00') },
    // one shot so far — no back, so no hover swap
    images: [tote.front('Wawa canvas tote with the blue Cape Town crest')],
    specs: [
      [
        { label: 'Colour', value: 'Natural with blue print' },
        { label: 'Print', value: 'Wawa Cape Town crest' },
        { label: 'Straps', value: 'Long, over the shoulder' },
      ],
    ],
  },
  {
    id: 'mock/canvas-carryall',
    handle: 'canvas-carryall',
    title: 'Canvas Carryall',
    description:
      'The bigger bag. Natural canvas with olive and rust webbing running from the shoulder straps down the body, a rope-and-timber toggle to close the top, and the Wawa patch on the front. Big enough for a towel, a wetsuit and the day.',
    productType: 'Accessories',
    tags: ['Bags'],
    availableForSale: true,
    variantId: '41464872304704',
    priceRange: { minVariantPrice: zar('2500.00') },
    images: [
      carryall.front('Wawa canvas carryall with olive and rust straps, patch side'),
      carryall.back('Wawa canvas carryall, plain side'),
    ],
    featured: 3,
    specs: [
      [
        { label: 'Colour', value: 'Natural canvas, olive & rust straps' },
        { label: 'Closure', value: 'Rope loop & timber toggle' },
        { label: 'Detail', value: 'Wawa patch' },
      ],
    ],
  },
  {
    id: 'mock/tog-bag-large',
    handle: 'canvas-tog-bag-large',
    title: 'Canvas Tog Bag (Large)',
    description:
      'A waxed army-canvas tog bag for a wet wetsuit and everything else from the session. Rope drawstring closed with a timber toggle, a stitched Wawa patch, and rope straps to carry it home over the shoulder. In green or dusty pink.',
    productType: 'Accessories',
    tags: ['Bags'],
    availableForSale: true,
    // One Shopify variant per colour.
    optionName: 'Colour',
    variants: [
      { title: 'Green', id: '41464872337472' },
      { title: 'Dusty Pink', id: '41464872370240' },
    ],
    priceRange: { minVariantPrice: zar('2500.00') },
    // one shot so far (both colours together) — no back, so no hover swap
    images: [wetsuitSling.front('Wawa large canvas tog bags in green and dusty pink')],
    specs: [
      [
        { label: 'Used For', value: 'Carrying a wet wetsuit' },
        { label: 'Closure', value: 'Rope drawstring & timber toggle' },
        { label: 'Colours', value: 'Green, dusty pink' },
      ],
      [
        { label: 'Material', value: 'Waxed army canvas' },
      ],
    ],
  },
  {
    id: 'mock/tog-bag-regular',
    handle: 'canvas-tog-bag-regular',
    title: 'Canvas Tog Bag (Regular)',
    description:
      'The smaller tog bag, in cotton canvas. Rope drawstring closed with a timber toggle, a stitched Wawa patch, and rope straps to carry it over the shoulder. In blue, green or orange.',
    productType: 'Accessories',
    tags: ['Bags'],
    availableForSale: true,
    // One Shopify variant per colour.
    optionName: 'Colour',
    variants: [
      { title: 'Blue', id: '41464872403008' },
      { title: 'Green', id: '41464872435776' },
      { title: 'Orange', id: '41464872468544' },
    ],
    priceRange: { minVariantPrice: zar('1500.00') },
    // one shot of the colours together — no back, so no hover swap
    images: [togRegular.front('Wawa regular canvas tog bags in natural canvas with coloured bases')],
    specs: [
      [
        { label: 'Used For', value: 'Everyday carry' },
        { label: 'Closure', value: 'Rope drawstring & timber toggle' },
        { label: 'Colours', value: 'Blue, green, orange' },
      ],
      [
        { label: 'Material', value: 'Cotton canvas' },
      ],
    ],
  },
  {
    id: 'mock/wax-comb',
    handle: 'wooden-wax-comb',
    title: 'Wooden Wax Comb',
    description:
      'A wax comb carved from a solid-wood offcut in the shape of a fish, hand-finished and sealed. Combs your bumps and scrapes old wax, and feels good in the hand. Small thing, same craft.',
    productType: 'Accessories',
    tags: ['Wax Combs'],
    availableForSale: true,
    variantId: '41267104940096',
    priceRange: { minVariantPrice: zar('120.00') },
    // one shot so far — no back, so no hover swap
    images: [waxComb.front('Wawa wooden wax comb carved as a fish, held against a sunlit wall')],
    specs: [
      [
        { label: 'Used For', value: 'Combing bumps & scraping old wax' },
      ],
      [
        { label: 'Material', value: 'Solid-wood offcut' },
        { label: 'Finish', value: 'Hand-carved & sealed' },
      ],
    ],
  },
  {
    id: 'mock/beach-bats',
    handle: 'beach-bats',
    title: 'Wood & Cork Beach Bats',
    description:
      'Made in Cape Town from sustainably sourced birch and natural cork. Light but strong: the layered timber adds stiffness while the cork core gives a lively spring, so you get less power per hit and more control. Sealed with a beeswax-and-oil blend. Set of two bats, a ball and a calico beach bag.',
    productType: 'Accessories',
    tags: ['Beach Bats'],
    availableForSale: true,
    variantId: '41267104809024',
    priceRange: { minVariantPrice: zar('2750.00') },
    images: [
      beachBats.front('Wawa beach bat with red sun and blue waves, held up in one hand'),
      beachBats.back('Wawa beach bat at an angle, showing the layered birch edge and cork grip'),
    ],
    specs: [
      [
        { label: 'Used For', value: 'Beach games' },
        { label: 'In the Set', value: 'Two bats, ball & calico beach bag' },
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
    id: 'mock/geoprene-jacket',
    handle: 'geoprene-jacket',
    title: 'Geoprene Wetsuit Jacket',
    description:
      'For summer swells, when you don’t want the full suit. Made in Cape Town from Japanese Yamamoto rubber: a 2mm jacket with super-stretch panels for a full range of movement. The glossy Sealskin finish soaks up sunlight to keep you warmer with less rubber. Front zip, padded chest for paddling.',
    productType: 'Accessories',
    tags: ['Wetsuits'],
    availableForSale: true,
    // One Shopify variant per size.
    variants: [
      { title: 'S', id: '41464872501312' },
      { title: 'M', id: '41464872534080' },
      { title: 'L', id: '41464872566848' },
    ],
    priceRange: { minVariantPrice: zar('3500.00') },
    // one shot so far — no back, so no hover swap
    images: [geoprene.front('Wawa Geoprene wetsuit jacket, front zip')],
    specs: [
      [
        { label: 'Used For', value: 'Summer swells' },
        { label: 'Thickness', value: '2mm' },
        { label: 'Features', value: 'Front zip, padded chest' },
        { label: 'Sizes', value: 'S, M, L' },
      ],
      [
        { label: 'Material', value: 'Japanese Yamamoto rubber' },
        { label: 'Finish', value: 'Glossy Sealskin' },
        { label: 'Made In', value: 'Cape Town' },
      ],
    ],
  },
  {
    id: 'mock/crest-tee',
    handle: 'cape-town-crest-tee',
    title: 'Cape Town Crest Tee',
    description:
      'A navy crew-neck tee carrying the Wawa crest: a board through the waves, palms either side, Cape Town underneath. Small on the chest, large across the back, in aqua.',
    productType: 'Accessories',
    tags: ['Clothing'],
    availableForSale: true,
    variants: [
      { title: 'XS', id: '41464872599616' },
      { title: 'S', id: '41464872632384' },
      { title: 'M', id: '41464872665152' },
      { title: 'L', id: '41464872697920' },
      { title: 'XL', id: '41464872730688' },
    ],
    priceRange: { minVariantPrice: zar('550.00') },
    images: [
      crestTee.front('Wawa Cape Town Crest tee in navy, chest print'),
      crestTee.back('Wawa Cape Town Crest tee in navy, back print'),
    ],
    featured: 5,
    specs: [
      [
        { label: 'Colour', value: 'Navy' },
        { label: 'Print', value: 'Left chest & full back' },
        { label: 'Sizes', value: 'XS, S, M, L, XL' },
      ],
    ],
  },
  {
    id: 'mock/swallow-tee',
    handle: 'swallow-tee',
    title: 'Swallow Tee',
    description:
      'A navy crew-neck tee with a single aqua badge on the chest: a swallow in a hand-drawn circle, lettered Lis Vos, Wawa and Cape Town. Plain back.',
    productType: 'Accessories',
    tags: ['Clothing'],
    availableForSale: true,
    variants: [
      { title: 'XS', id: '41464872763456' },
      { title: 'S', id: '41464872796224' },
      { title: 'M', id: '41464872828992' },
      { title: 'L', id: '41464872861760' },
      { title: 'XL', id: '41464872894528' },
    ],
    priceRange: { minVariantPrice: zar('550.00') },
    images: [
      swallowTee.front('Wawa Swallow tee in navy, chest badge'),
      swallowTee.back('Wawa Swallow tee in navy, plain back'),
    ],
    specs: [
      [
        { label: 'Colour', value: 'Navy' },
        { label: 'Print', value: 'Left chest' },
        { label: 'Sizes', value: 'XS, S, M, L, XL' },
      ],
    ],
  },
  {
    id: 'mock/wood-is-good-tee',
    handle: 'wood-is-good-tee',
    title: 'Wood Is Good Tee',
    description:
      'A navy crew-neck tee carrying the Wood Is Good surfer: small on the chest, drawn large across the back in white and ocean blue. From the Wawa workshop in Cape Town.',
    productType: 'Accessories',
    tags: ['Clothing'],
    availableForSale: true,
    variants: [
      { title: 'XS', id: '41464872927296' },
      { title: 'S', id: '41464872960064' },
      { title: 'M', id: '41464872992832' },
      { title: 'L', id: '41464873025600' },
      { title: 'XL', id: '41464873058368' },
    ],
    priceRange: { minVariantPrice: zar('550.00') },
    images: [
      woodIsGood.front('Wawa Wood Is Good tee in navy, chest print'),
      woodIsGood.back('Wawa Wood Is Good tee in navy, back print'),
    ],
    specs: [
      [
        { label: 'Colour', value: 'Navy' },
        { label: 'Print', value: 'Left chest & full back' },
        { label: 'Sizes', value: 'XS, S, M, L, XL' },
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
    // Paper prints and timber-framed, three sizes each.
    optionName: 'Format',
    variants: [
      { title: 'A5 print', id: '41464873091136', price: '450.00' },
      { title: 'A4 print', id: '41464873123904', price: '750.00' },
      { title: 'A3 print', id: '41464873156672', price: '950.00' },
      { title: 'A5 framed', id: '41464873189440', price: '1750.00' },
      { title: 'A4 framed', id: '41464873222208', price: '1950.00' },
      { title: 'A3 framed', id: '41464873254976', price: '2250.00' },
    ],
    priceRange: { minVariantPrice: zar('450.00') },
    images: [
      prints.front('Framed engraving of surfers riding a breaking wave'),
      prints.back('Framed woodcut of a surfer on a longboard'),
    ],
    specs: [
      [
        { label: 'Used For', value: 'Wall art' },
        { label: 'Subject', value: 'Timber, ocean & the craft' },
      ],
      [
        { label: 'Format', value: 'Paper print or timber frame' },
        { label: 'Sizes', value: 'A5, A4, A3' },
      ],
    ],
  },
  {
    id: 'mock/spex-prints',
    handle: 'spex-wave-photography',
    title: 'Spex Wave Photography',
    description:
      'Wave photography by Sacha Specker, “Spex”. A4 prints, each signed by the artist, on paper or framed in timber.',
    productType: 'Accessories',
    tags: ['Art'],
    availableForSale: true,
    optionName: 'Format',
    variants: [
      { title: 'A4 print', id: '41464873287744', price: '950.00' },
      { title: 'A4 framed', id: '41464873320512', price: '3500.00' },
    ],
    priceRange: { minVariantPrice: zar('950.00') },
    images: [spex.front('Spex wave print in a timber frame')],
    specs: [
      [
        { label: 'Used For', value: 'Wall art' },
        { label: 'Artist', value: 'Sacha Specker (Spex)' },
        { label: 'Signed', value: 'By the artist' },
      ],
      [
        { label: 'Format', value: 'Paper print or timber frame' },
        { label: 'Size', value: 'A4' },
      ],
    ],
  },
  {
    id: 'mock/gift-card',
    handle: 'gift-card',
    title: 'Gift Card',
    description:
      'A Wawa gift card for any amount you choose, redeemable at checkout on anything in our shop: covers, bags, clothing and art. Sent by email with a code to pass on, and valid for three years.',
    productType: 'Accessories',
    tags: ['Gift Cards'],
    availableForSale: true,
    // Shopify can't take a free-typed amount via the cart permalink, so each
    // amount is its own gift-card denomination; the PDP's amount field picks one.
    customAmount: true,
    optionName: 'Amount',
    variants: GIFT_CARD_AMOUNTS.map((a) => ({
      title: `R${a.toLocaleString('en-US')}`,
      id: GIFT_CARD_IDS[a] ?? '',
      price: `${a}.00`,
    })),
    priceRange: { minVariantPrice: zar(`${GIFT_CARD_AMOUNTS[0]}.00`) },
    images: [giftCard.front('Wawa gift card in engraved oak, held in hand')],
    specs: [
      [
        { label: 'Used For', value: 'Anything in the shop' },
        { label: 'Amount', value: 'R100 to R10,000' },
        { label: 'Delivery', value: 'By email, with a redeemable code' },
      ],
      [
        { label: 'Valid For', value: 'Three years' },
        { label: 'Refunds', value: 'Non-refundable, but transferable' },
      ],
    ],
  },
];
