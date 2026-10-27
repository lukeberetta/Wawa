import type { Discipline } from '@/lib/types';

/**
 * Craft disciplines — derived from the NEW/ content tree.
 * Each maps to a Shopify collection in phase 2; `categories` become tag filters.
 */
export const disciplines: Discipline[] = [
  {
    handle: 'surf',
    title: 'Surf',
    blurb: 'Shaped from timber: fish, mid-lengths, logs and finless craft.',
    intro:
      'Shapes built by surfers, from timber over foam cores with cork rails to solid-wood alaias. From the Classic Fish to the Alaia, every outline carries a piece of surfing’s lineage.',
    hero: '/img/category/surf.webp',
    categories: ['Short', 'Mid', 'Long', 'Finless', 'Custom'],
  },
  {
    handle: 'foil',
    title: 'Foil',
    blurb: 'Prone, wave, wing and custom foil builds.',
    intro:
      'Paulownia and cork foilboards for prone, wave and wing riding. Choose a shape or talk to us about a custom build for your weight, conditions and foil setup.',
    hero: '/img/category/foil.webp',
    categories: ['Prone', 'Wave', 'Wing', 'Custom'],
  },
  {
    handle: 'kite',
    title: 'Kite',
    blurb: 'Tomo, trick and vlieer kite boards.',
    intro:
      'The same timber-and-cork construction, tuned for wind. Stiff flex, controlled energy return and a direct connection to the water. Tomo, trick and vlieer shapes.',
    hero: '/img/category/kite.webp',
    categories: ['Tomo', 'Trick', 'Vlieer'],
  },
  {
    handle: 'skate',
    title: 'Skate',
    blurb: 'Wooden cruisers and shapes for flat days.',
    intro: 'For the days the sea goes flat. Wooden cruisers built from the same materials as the boards.',
    hero: '/img/category/skate.webp',
    categories: [],
  },
  {
    handle: 'body-belly',
    title: 'Body & Belly',
    blurb: 'Bodysurf handplanes, bellyboards, paipos and boogies.',
    intro:
      'Get closer to the wave with handplanes, bellyboards and paipos. From bodysurfing to prone riding, small craft bring a different feel to a familiar break.',
    hero: '/img/category/body-belly.webp',
    categories: ['Bodysurf', 'Bellyboard', 'Paipo', 'Skimboard'],
  },
  {
    handle: 'accessories',
    title: 'Accessories',
    blurb: 'Wetsuit jackets, board covers, wax combs, clothing, bags, art and gift cards.',
    intro:
      'Board covers, wetsuit jackets and everyday essentials for time in and around the water. Explore Yamamoto Geoprene jackets, cotton-duck covers, wood-and-cork beach bats and more.',
    hero: '/img/category/accessories.webp',
    categories: ['Boardbag', 'Bags', 'Wax Combs', 'Beach Bats', 'Wetsuits', 'Clothing', 'Art', 'Gift Cards'],
  },
];
