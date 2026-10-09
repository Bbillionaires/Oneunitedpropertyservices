import type { ImageMetadata } from 'astro';
import lawn from '@/assets/projects/duval-landing/lawn-tree-line.jpg';
import type { IconName } from '@/components/icons';

/**
 * Services offered. Add a new object to this array to add a service —
 * the homepage grid, services index, detail page (/services/<slug>/),
 * quote form options, and footer all read from here.
 *
 * Only use real One United photos. A service without an `image` is shown as a
 * text listing — never fill the gap with stock photography.
 */
export interface Service {
  slug: string;
  /** Short value used by the quote form. */
  quoteValue: string;
  /** Label shown in the quote form. */
  quoteLabel: string;
  title: string;
  shortTitle: string;
  icon: IconName;
  summary: string;
  /** Intro paragraph for the detail page. */
  intro: string;
  /** What the service can cover. Keep to things the business actually does. */
  scope: string[];
  /** Typical settings on a property where the service applies. */
  idealFor: string[];
  /** Real project photo only. Omit when none is available. */
  image?: ImageMetadata;
  imageAlt?: string;
  seoTitle: string;
  seoDescription: string;
}

export const services: Service[] = [
  {
    slug: 'lawn-grounds-care',
    quoteValue: 'lawn-care',
    quoteLabel: 'Lawn Care',
    title: 'Lawn & Grounds Care',
    shortTitle: 'Lawn Care',
    icon: 'lawn',
    summary:
      'Recurring grounds maintenance designed to keep commercial and multifamily properties clean, professional, and consistently maintained.',
    intro:
      'First impressions start at the curb. We maintain the grounds of apartment communities and commercial properties on a recurring schedule so entrances, common areas, and landscaped spaces stay sharp week after week.',
    scope: [
      'Mowing, edging, and trimming',
      'Shrub and hedge maintenance',
      'Bed cleanup and weed control',
      'Leaf and debris removal',
      'Common area and entrance upkeep',
      'Seasonal cleanups',
    ],
    idealFor: ['Apartment communities', 'Office parks', 'Retail centers', 'HOA common areas'],
    image: lawn,
    imageAlt: 'Mowed roadside lawn with fresh mulch rings around a row of trees along a community fence',
    seoTitle: 'Commercial Lawn Maintenance & Grounds Care',
    seoDescription:
      'Recurring commercial lawn maintenance and grounds care for apartment communities, multifamily, and commercial properties in Jacksonville and Northeast Florida.',
  },
  {
    slug: 'weed-pesticide-spraying',
    quoteValue: 'weed-pesticide',
    quoteLabel: 'Weed Killer & Pesticide Spraying',
    title: 'Weed Killer & Pesticide Spraying',
    shortTitle: 'Weed & Pest Spraying',
    icon: 'sprayer',
    summary:
      'Weed control and pesticide spraying for lawns, beds, and hardscapes — scheduled and managed by One United, applied by our licensed pest control partners.',
    intro:
      'Weeds in the cracks and pests in the turf undo good grounds work fast. We schedule and coordinate spraying alongside your grounds maintenance, and the applications are performed by our licensed pest control partners — so you still have one point of contact.',
    scope: [
      'Weed control in lawns and beds',
      'Sidewalk, curb, and hardscape weed spraying',
      'Fence line and common area treatment',
      'Lawn pest treatment',
      'Recurring spray schedules',
      'Coordinated with mowing and bed maintenance',
    ],
    idealFor: ['Apartment communities', 'HOA common areas', 'Retail centers', 'Office parks'],
    seoTitle: 'Commercial Weed Control & Pesticide Spraying',
    seoDescription:
      'Weed killer and pesticide spraying for apartment communities, HOAs, and commercial properties in Jacksonville and Northeast Florida.',
  },
  {
    slug: 'pressure-washing',
    quoteValue: 'pressure-washing',
    quoteLabel: 'Pressure Washing',
    title: 'Pressure Washing',
    shortTitle: 'Pressure Washing',
    icon: 'spray',
    summary:
      'Exterior cleaning for buildings, sidewalks, breezeways, common areas, parking areas, entrances, and other property surfaces.',
    intro:
      'Dirt, mildew, and stains make a well-run property look neglected. Our pressure washing restores the surfaces residents, tenants, and visitors see every day.',
    scope: [
      'Building exteriors',
      'Sidewalks and walkways',
      'Breezeways and stairwells',
      'Parking areas',
      'Entrances and storefronts',
      'Pool decks, amenity areas, and dumpster pads',
    ],
    idealFor: ['Multifamily buildings', 'Retail storefronts', 'Office entrances', 'Community amenities'],
    seoTitle: 'Commercial Pressure Washing',
    seoDescription:
      'Commercial pressure washing for building exteriors, sidewalks, breezeways, parking areas, and common areas at multifamily and commercial properties in Northeast Florida.',
  },
  {
    slug: 'painting',
    quoteValue: 'painting',
    quoteLabel: 'Painting',
    title: 'Painting',
    shortTitle: 'Painting',
    icon: 'paint',
    summary:
      'Interior and exterior painting for apartments, commercial buildings, common areas, turnovers, and property improvements.',
    intro:
      'Fresh, consistent paint protects surfaces and makes a property feel cared for. We handle interior and exterior painting from single units to common areas and building exteriors.',
    scope: [
      'Interior unit painting',
      'Exterior building painting',
      'Common areas, hallways, and stairwells',
      'Turnover and make-ready repaints',
      'Doors, trim, and railings',
      'Touch-ups and property improvements',
    ],
    idealFor: ['Apartment turnovers', 'Commercial buildings', 'Office suites', 'Clubhouses and amenities'],
    seoTitle: 'Commercial & Apartment Painting',
    seoDescription:
      'Interior and exterior commercial painting for apartments, multifamily communities, and commercial buildings in Jacksonville and Northeast Florida.',
  },
  {
    slug: 'property-turnovers',
    quoteValue: 'turnover',
    quoteLabel: 'Property Turnover',
    title: 'Property Turnovers',
    shortTitle: 'Turnovers',
    icon: 'key',
    summary:
      'Make-ready services designed to help owners and property managers prepare units and spaces for their next occupants.',
    intro:
      'Every vacant day costs money. Our make-ready service brings painting, repairs, and cleanup together so units and spaces are ready for the next resident or tenant.',
    scope: [
      'Make-ready painting',
      'Minor repairs and punch lists',
      'Fixture and hardware replacement',
      'Post-move-out cleanup',
      'Unit walk-through coordination',
      'Commercial space refreshes',
    ],
    idealFor: ['Apartment units', 'Multifamily rentals', 'Office suites', 'Retail spaces'],
    seoTitle: 'Apartment Turnover & Make-Ready Services',
    seoDescription:
      'Apartment turnover and make-ready services for property managers and owners — painting, repairs, and cleanup to prepare units for new residents.',
  },
  {
    slug: 'home-cleaning-steaming',
    quoteValue: 'cleaning-steaming',
    quoteLabel: 'Home Cleaning & Steaming',
    title: 'Home Cleaning & Steaming',
    shortTitle: 'Cleaning & Steaming',
    icon: 'sparkle',
    summary:
      'Interior cleaning and steam cleaning for homes and units — ready for move-in, after move-out, or on a regular schedule.',
    intro:
      'A clean unit shows better and leases faster. We handle interior cleaning and steam cleaning so homes and units are fresh for residents, owners, and showings.',
    scope: [
      'Move-in and move-out cleaning',
      'Deep cleaning of kitchens and bathrooms',
      'Steam cleaning',
      'Post-turnover and post-construction cleanup',
      'Recurring cleaning schedules',
      'Common area and clubhouse cleaning',
    ],
    idealFor: ['Apartment units', 'Single-family rentals', 'Townhomes', 'Model units'],
    seoTitle: 'Home Cleaning & Steam Cleaning',
    seoDescription:
      'Home cleaning and steam cleaning for apartments, rental homes, and units in Jacksonville and Northeast Florida.',
  },
  {
    slug: 'general-maintenance',
    quoteValue: 'general-maintenance',
    quoteLabel: 'General Maintenance',
    title: 'General Property Maintenance',
    shortTitle: 'Maintenance',
    icon: 'wrench',
    summary: 'Ongoing maintenance support for the everyday needs of multifamily and commercial properties.',
    intro:
      'Small issues become big ones when they wait. We support property teams with the routine maintenance that keeps buildings safe, functional, and presentable.',
    scope: [
      'Routine repairs',
      'Common area upkeep',
      'Fixture and hardware work',
      'Exterior touch-ups',
      'Preventive maintenance tasks',
      'Support for on-site maintenance teams',
    ],
    idealFor: ['Apartment communities', 'Commercial buildings', 'Retail centers', 'Portfolio properties'],
    seoTitle: 'General Property Maintenance',
    seoDescription:
      'General property maintenance support for multifamily and commercial properties in Jacksonville and Northeast Florida.',
  },
  {
    slug: 'ev-charging-installation',
    quoteValue: 'ev-charging',
    quoteLabel: 'EV Charging Stations',
    title: 'EV Charging Station Installation',
    shortTitle: 'EV Charging',
    icon: 'ev',
    summary:
      'Electric vehicle charging stations for apartment communities and commercial properties — installed by our licensed electrician partners, with profit-sharing options that let the property earn from every charge.',
    intro:
      'Residents and tenants increasingly expect a place to charge. We help properties add EV charging stations, from planning the location to installation. One United manages the project, the installation is performed by our licensed electrician partners, and profit-sharing options turn charging into a source of revenue rather than only an amenity cost.',
    scope: [
      'Site assessment and charger placement planning',
      'Installation by licensed electrician partners',
      'Parking space layout and signage',
      'Profit-sharing options on charging revenue',
      'Owner-purchased station options',
      'Ongoing upkeep alongside your other property services',
    ],
    idealFor: ['Apartment communities', 'Office properties', 'Retail centers', 'HOA common parking'],
    seoTitle: 'EV Charging Station Installation with Profit Sharing',
    seoDescription:
      'EV charging station installation for apartment communities and commercial properties in Jacksonville and Northeast Florida, with profit-sharing options.',
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
