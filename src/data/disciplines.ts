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
      'Shapes built by surfers. Paulownia over recycled foam cores with cork rails, light and lively. From the Classic Fish to the Alaia, every outline carries a piece of surfing’s lineage.',
    hero: '/img/category/surf.webp',
    categories: ['Short', 'Mid', 'Long', 'Finless', 'Custom'],
  },
  {
    handle: 'foil',
    title: 'Foil',
    blurb: 'Prone, wave, wing and custom foil builds.',
    intro:
      'Over time the ocean works the paulownia and cork exterior into a textured “speed skin” that cuts drag and adds lift, in water and in air. Prone, wave, wing and custom builds.',
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
      'One of the best ways to learn the rhythm of the ocean is to strip it all back. No board to paddle and no pop-up. Just you, the wave and the feel. Handslides, bellyboards and paipos.',
    hero: '/img/category/body-belly.webp',
    categories: ['Bodysurf', 'Bellyboard', 'Paipo', 'Skimboard'],
  },
  {
    handle: 'accessories',
    title: 'Accessories',
    blurb: 'Fins, wetsuits, board bags, wax combs, art and gift cards.',
    intro:
      'Everything around the board, made the same way. Yamamoto wetsuit jackets, cotton-duck covers, wood-and-cork beach bats, timber fins and gift cards.',
    hero: '/img/category/accessories.webp',
    categories: ['Fins', 'Wetsuits', 'Boardbag', 'Wax Combs', 'Beach Bats', 'Art', 'Gift Cards'],
  },
];
