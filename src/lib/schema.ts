/**
 * JSON-LD builders. One `@graph` per page, emitted by Layout.astro.
 *
 * Everything is cross-referenced by `@id` rather than repeated, so the
 * Organization node is described once and pointed at from WebSite, Article
 * and Product nodes. Google reads the graph as a whole.
 *
 * Node ids (stable — external tools and Search Console key off these):
 *   #organization  the business itself, and the source of the SERP logo
 *   #website       enables the site-name treatment on the brand result
 */
import { site } from '@/lib/site';

/**
 * Site-relative path → absolute URL. Structured data must never be relative.
 *
 * The build emits directory-style pages, so `<link rel="canonical">` always
 * carries a trailing slash. Schema URLs have to match it exactly or Google
 * reads `/press/x` and `/press/x/` as two documents — so page paths get the
 * slash added here. Files (anything with an extension) and query strings are
 * left alone.
 */
export function abs(path: string): string {
  const [pathname, query] = path.split('?');
  const isFile = /\.[a-z0-9]+$/i.test(pathname);
  const normalized = isFile || pathname.endsWith('/') ? pathname : `${pathname}/`;
  return new URL(query ? `${normalized}?${query}` : normalized, site.url).href;
}

export const ORG_ID = `${site.url}/#organization`;
export const SITE_ID = `${site.url}/#website`;

/** `@id` reference to a node defined elsewhere in the graph. */
const ref = (id: string) => ({ '@id': id });

/**
 * The business. Typed `SportingGoodsStore` (a LocalBusiness subtype) rather
 * than plain Organization: it's a workshop you can walk into, and the specific
 * type is what makes the hours/address eligible for a business panel.
 *
 * Address and geo are only emitted once real values land in `site.ts` — a
 * PostalAddress with an empty streetAddress is worse than none, and a 0,0
 * geo point puts the workshop in the Atlantic.
 */
export function organization() {
  const { address, geo } = site;
  const hasStreet = address.street.length > 0;
  const hasGeo = geo.lat.length > 0 && geo.lng.length > 0;

  return {
    '@type': ['Organization', 'SportingGoodsStore'],
    '@id': ORG_ID,
    name: site.name,
    alternateName: site.shortName,
    url: site.url,
    description: site.description,
    email: site.email,
    telephone: site.phone,
    priceRange: site.priceRange,
    currenciesAccepted: 'ZAR',
    // The SERP logo. Google wants a square, crawlable raster it can crop to a
    // circle — the 512px PWA icon, not the SVG wordmark.
    logo: {
      '@type': 'ImageObject',
      '@id': `${site.url}/#logo`,
      url: abs('/android-chrome-512x512.png'),
      width: 512,
      height: 512,
      caption: site.name,
    },
    image: abs('/og-image.jpg'),
    sameAs: [site.instagram],
    address: {
      '@type': 'PostalAddress',
      ...(hasStreet && { streetAddress: address.street }),
      addressLocality: address.locality,
      addressRegion: address.region,
      ...(address.postalCode && { postalCode: address.postalCode }),
      addressCountry: address.country,
    },
    ...(hasGeo && {
      geo: { '@type': 'GeoCoordinates', latitude: geo.lat, longitude: geo.lng },
    }),
    openingHoursSpecification: site.hours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.spec.dayOfWeek,
      opens: h.spec.opens,
      closes: h.spec.closes,
    })),
    areaServed: { '@type': 'Country', name: 'South Africa' },
  };
}

/** WebSite node. Presence on the home page is what lets Google show a site name. */
export function website() {
  return {
    '@type': 'WebSite',
    '@id': SITE_ID,
    url: site.url,
    name: site.name,
    alternateName: site.shortName,
    description: site.description,
    inLanguage: 'en-ZA',
    publisher: ref(ORG_ID),
  };
}

/**
 * Breadcrumb trail. Feeds the path line that replaces the bare URL under a
 * result. Pass the ancestors only — the current page is appended by the caller
 * as the last item, and Google expects it to have no `item` URL of its own.
 */
export function breadcrumbs(trail: { name: string; path?: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      ...(crumb.path && { item: abs(crumb.path) }),
    })),
  };
}

/** Editorial piece — press clipping or journal entry. */
export function article(input: {
  headline: string;
  description: string;
  path: string;
  datePublished: Date;
  author: string;
  /** The outlet that ran it, when it's a reprint rather than a Wawa original. */
  publication?: string;
  image?: string;
}) {
  return {
    '@type': 'Article',
    '@id': `${abs(input.path)}#article`,
    headline: input.headline,
    description: input.description,
    url: abs(input.path),
    mainEntityOfPage: abs(input.path),
    datePublished: input.datePublished.toISOString().slice(0, 10),
    author: { '@type': 'Person', name: input.author },
    publisher: ref(ORG_ID),
    ...(input.publication && {
      // The original outlet, distinct from the publisher of this page.
      provider: { '@type': 'Organization', name: input.publication },
    }),
    image: abs(input.image ?? '/og-image.jpg'),
    inLanguage: 'en-ZA',
  };
}
