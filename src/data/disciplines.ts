import type { Discipline } from '@/lib/types';

/**
 * Craft disciplines — derived from the NEW/ content tree.
 * Each maps to a Shopify collection in phase 2; `categories` become tag filters.
 */
export const disciplines: Discipline[] = [
  {
    handle: 'surf',
    title: 'Surf',
    blurb: 'Shaped from timber — fish, mid-lengths, logs and finless craft.',
    intro:
      'Trusted shapes, shaped by surfers. Paulownia over recycled foam cores with cork rails — light, lively, and built to last. From the Classic Fish to the Alaia, every outline carries a piece of surfing’s lineage.',
    categories: ['Short', 'Mid', 'Long', 'Finless', 'Custom & Make Your Own'],
  },
  {
    handle: 'foil',
    title: 'Foil',
    blurb: 'Prone, wave, wing and custom foil builds.',
    intro:
      'Over time the paulownia and cork exterior is shaped by the ocean into a textured “speed skin” — micro-bubbles reduce drag and optimise lift, in water and in air. Prone, wave, wing and custom builds.',
    hero: 'foil-hero',
    categories: ['Prone', 'Wave', 'Wing', 'Custom'],
  },
  {
    handle: 'kite',
    title: 'Kite',
    blurb: 'Tomo, trick and vlieer kite boards.',
    intro:
      'The same timber-and-cork construction, tuned for wind. Stiff flex, controlled energy return and a direct connection to the water. Tomo, trick and vlieer shapes.',
    hero: 'kite-hero',
    categories: ['Tomo', 'Trick', 'Vlieer'],
  },
  {
    handle: 'skate',
    title: 'Skate',
    blurb: 'Wooden cruisers and shapes for flat days.',
    intro: 'For the days the sea goes flat. Wooden cruisers built from the same materials as the boards.',
    hero: 'skate-hero',
    categories: [],
  },
  {
    handle: 'body-belly',
    title: 'Body & Belly',
    blurb: 'Bodysurf handplanes, bellyboards, paipos and boogies.',
    intro:
      'One of the best ways to learn the rhythm of the ocean is to strip it all back. No board to paddle, no pop-up — just you, the wave and pure feel. Handslides, bellyboards and paipos.',
    categories: ['Bodysurf', 'Bellyboard', 'Paipo', 'Skimboard'],
  },
  {
    handle: 'accessories',
    title: 'Accessories',
    blurb: 'Fins, wetsuits, board bags, wax combs, art and gift cards.',
    intro:
      'Everything around the board, made the same way. Yamamoto wetsuit jackets, cotton-duck covers, wood-and-cork beach bats, timber fins and gift cards.',
    categories: ['Fins', 'Wetsuits', 'Boardbag', 'Wax Combs', 'Beach Bats', 'Art', 'Gift Cards'],
  },
];
