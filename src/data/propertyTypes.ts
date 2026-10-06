import type { ImageMetadata } from 'astro';
import apartments from '@/assets/placeholders/apartment-palms.jpg';
import multifamily from '@/assets/placeholders/multifamily-waterfront.jpg';
import commercial from '@/assets/placeholders/commercial-building.jpg';
import retail from '@/assets/placeholders/retail-store.jpg';
import office from '@/assets/placeholders/office-palms.jpg';
import hoa from '@/assets/placeholders/hoa-aerial.jpg';
import portfolio from '@/assets/placeholders/portfolio-towers.jpg';

export interface PropertyType {
  id: string;
  /** Value used by the quote form. */
  quoteValue: string;
  title: string;
  blurb: string;
  needs: string[];
  image: ImageMetadata;
  imageAlt: string;
}

export const propertyTypes: PropertyType[] = [
  {
    id: 'apartment-communities',
    quoteValue: 'apartment',
    title: 'Apartment Communities',
    blurb:
      'Curb appeal, clean breezeways, and fast unit turns help communities lease, retain residents, and present well on every tour.',
    needs: ['Grounds care', 'Breezeway washing', 'Unit turnovers', 'Common area painting'],
    image: apartments,
    imageAlt: 'White mid-rise apartment community with balconies and palm trees',
  },
  {
    id: 'multifamily',
    quoteValue: 'multifamily',
    title: 'Multifamily Properties',
    blurb:
      'From townhome rows to garden-style buildings, consistent exterior care keeps every building looking like part of one well-run property.',
    needs: ['Exterior painting', 'Pressure washing', 'Make-ready', 'Routine maintenance'],
    image: multifamily,
    imageAlt: 'Multifamily residences with palm trees along a calm waterway',
  },
  {
    id: 'commercial-buildings',
    quoteValue: 'commercial',
    title: 'Commercial Buildings',
    blurb:
      'A building that looks maintained tells tenants and visitors the business inside is, too.',
    needs: ['Building washing', 'Exterior painting', 'Grounds care', 'General maintenance'],
    image: commercial,
    imageAlt: 'Modern commercial building with landscaped frontage',
  },
  {
    id: 'retail',
    quoteValue: 'retail',
    title: 'Retail Properties',
    blurb:
      'Storefronts, walkways, and parking areas shape the customer experience before anyone walks through the door.',
    needs: ['Storefront washing', 'Parking area cleaning', 'Landscape upkeep', 'Space refreshes'],
    image: retail,
    imageAlt: 'Well-presented retail store interior with organized displays',
  },
  {
    id: 'office',
    quoteValue: 'office',
    title: 'Office Properties',
    blurb:
      'Professional tenants expect professional grounds, entrances, and common areas, maintained on a predictable schedule.',
    needs: ['Entrance cleaning', 'Grounds care', 'Suite painting', 'Common area upkeep'],
    image: office,
    imageAlt: 'Glass office building framed by palm trees',
  },
  {
    id: 'hoa',
    quoteValue: 'hoa',
    title: 'HOAs & Communities',
    blurb:
      'Shared spaces set the standard for the whole neighborhood. We help boards and managers keep common areas consistent.',
    needs: ['Common area grounds', 'Amenity washing', 'Entry features', 'Seasonal cleanups'],
    image: hoa,
    imageAlt: 'Aerial view of a planned residential community with landscaped common areas',
  },
  {
    id: 'portfolios',
    quoteValue: 'portfolio',
    title: 'Real Estate Portfolios',
    blurb:
      'Multiple properties, one service relationship. Coordinate recurring work across your portfolio through a single team.',
    needs: ['Multi-site scheduling', 'Consistent standards', 'Bundled services', 'One point of contact'],
    image: portfolio,
    imageAlt: 'Looking up at a group of modern high-rise buildings',
  },
];
