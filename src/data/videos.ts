export interface Video {
  id: string; // YouTube or Vimeo id
  provider?: 'youtube' | 'vimeo'; // defaults to youtube
  thumb?: string; // required for Vimeo; YouTube thumbs derive from the id
  title: string;
  author: string; // channel / publication
  year?: number;
  minutes?: number;
  /** one or two sentences — shown on the featured billboard */
  blurb?: string;
}

/** Films featuring Wawa — external coverage and brand documentaries. The first
 *  entry is the featured billboard; the rest run in the rail beneath it. */
export const videos: Video[] = [
  {
    id: '103113055',
    provider: 'vimeo',
    thumb:
      'https://i.vimeocdn.com/video/485256798-ff003f5ff6c0d6b7ffb9dd3342f0574ad98e001dfc8860337c8e4eac20d0aa5a-d_1920',
    title: 'Ode to Simplicity',
    author: 'Enjoy the Soup',
    year: 2014,
    minutes: 5,
    blurb:
      'Carpenter, artist and Wawa shaper Andrew Strode on wood as a raw material, bodysurfing, a blind dog addicted to the ocean, and the part simplicity plays in a life by the sea.',
  },
  {
    id: '216377245',
    provider: 'vimeo',
    thumb:
      'https://i.vimeocdn.com/video/633346373-85fd2724c744c7834767fba9f819078503744b820b30d9169c1072484676d6ef-d_1280',
    title: 'Purple Haze',
    author: 'Enjoy the Soup',
    year: 2017,
    minutes: 3,
  },
  { id: 'Uxv4cDwGrd8', title: 'The Shape of Things — Ep3', author: 'Ricky Basnett' },
  { id: 'Ku86sEgcF2Y', title: 'The Road to Highline — Entry 6: Wawa', author: 'ZagTV' },
  {
    id: 'hKEp6STr768',
    title: 'Edible Surfboards — Eat Your Surfboard',
    author: 'Down Deep',
  },
];

export const thumbOf = (v: Video) =>
  v.thumb ?? `https://i.ytimg.com/vi/${v.id}/sddefault.jpg`;

export const embedOf = (v: Pick<Video, 'id' | 'provider'>) =>
  v.provider === 'vimeo'
    ? `https://player.vimeo.com/video/${v.id}?autoplay=1&dnt=1`
    : `https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0`;
