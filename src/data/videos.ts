export interface Video {
  id: string; // YouTube id
  title: string;
  author: string; // channel / publication
}

/** Films featuring Wawa — external coverage and brand documentaries. */
export const videos: Video[] = [
  { id: 'Uxv4cDwGrd8', title: 'The Shape of Things — Ep3', author: 'Ricky Basnett' },
  { id: 'Ku86sEgcF2Y', title: 'The Road to Highline — Entry 6: Wawa', author: 'ZagTV' },
  {
    id: 'cZ1-OFbiGoo',
    title: 'From Farm Boytjie to Craftsman — Cobus Joubert',
    author: 'Two Oceans Aquarium',
  },
  {
    id: 'YtX5rjTRU70',
    title: 'Mushroom, Wooden, Upcycled Surfboards',
    author: 'Nikki Cole',
  },
  {
    id: 'hKEp6STr768',
    title: 'Edible Surfboards — Eat Your Surfboard',
    author: 'Down Deep',
  },
];
