import type { IconName } from '@/components/icons';

export interface PropertyType {
  id: string;
  /** Value used by the quote form. */
  quoteValue: string;
  title: string;
  blurb: string;
  needs: string[];
  icon: IconName;
}

export const propertyTypes: PropertyType[] = [
  {
    id: 'apartment-communities',
    icon: 'building',
    quoteValue: 'apartment',
    title: 'Apartment Communities',
    blurb:
      'Curb appeal, clean breezeways, and fast unit turns help communities lease, retain residents, and present well on every tour.',
    needs: ['Grounds care', 'Breezeway washing', 'Unit turnovers', 'Common area painting'],
  },
  {
    id: 'multifamily',
    icon: 'townhome',
    quoteValue: 'multifamily',
    title: 'Multifamily Properties',
    blurb:
      'From townhome rows to garden-style buildings, consistent exterior care keeps every building looking like part of one well-run property.',
    needs: ['Exterior painting', 'Pressure washing', 'Make-ready', 'Routine maintenance'],
  },
  {
    id: 'commercial-buildings',
    icon: 'office',
    quoteValue: 'commercial',
    title: 'Commercial Buildings',
    blurb:
      'A building that looks maintained tells tenants and visitors the business inside is, too.',
    needs: ['Building washing', 'Exterior painting', 'Grounds care', 'General maintenance'],
  },
  {
    id: 'retail',
    icon: 'store',
    quoteValue: 'retail',
    title: 'Retail Properties',
    blurb:
      'Storefronts, walkways, and parking areas shape the customer experience before anyone walks through the door.',
    needs: ['Storefront washing', 'Parking area cleaning', 'Landscape upkeep', 'Space refreshes'],
  },
  {
    id: 'office',
    icon: 'briefcase',
    quoteValue: 'office',
    title: 'Office Properties',
    blurb:
      'Professional tenants expect professional grounds, entrances, and common areas, maintained on a predictable schedule.',
    needs: ['Entrance cleaning', 'Grounds care', 'Suite painting', 'Common area upkeep'],
  },
  {
    id: 'hoa',
    icon: 'community',
    quoteValue: 'hoa',
    title: 'HOAs & Communities',
    blurb:
      'Shared spaces set the standard for the whole neighborhood. We help boards and managers keep common areas consistent.',
    needs: ['Common area grounds', 'Amenity washing', 'Entry features', 'Seasonal cleanups'],
  },
  {
    id: 'portfolios',
    icon: 'grid',
    quoteValue: 'portfolio',
    title: 'Real Estate Portfolios',
    blurb:
      'Multiple properties, one service relationship. Coordinate recurring work across your portfolio through a single team.',
    needs: ['Multi-site scheduling', 'Consistent standards', 'Bundled services', 'One point of contact'],
  },
];
