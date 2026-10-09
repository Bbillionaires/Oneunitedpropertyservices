import type { ImageMetadata } from 'astro';
import lawn from '@/assets/projects/duval-landing/lawn-tree-line.jpg';
import pressure from '@/assets/projects/fence-washing/fence-line-clean.jpg';
import paint from '@/assets/placeholders/paint-roller.jpg';
import turnover from '@/assets/placeholders/turnover-interior.jpg';
import maintenance from '@/assets/placeholders/maintenance-tech.jpg';
import type { IconName } from '@/components/icons';

/**
 * Services offered. Add a new object to this array to add a service —
 * the homepage grid, services index, detail page (/services/<slug>/),
 * quote form options, and footer all read from here.
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
  image: ImageMetadata;
  imageAlt: string;
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
    image: pressure,
    imageAlt: 'Freshly washed white vinyl fence along a mowed lawn and walkway beside a commercial building',
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
    image: paint,
    imageAlt: 'Paint roller applying a fresh coat of paint to a wall',
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
    image: turnover,
    imageAlt: 'Bright, clean apartment living room ready for a new resident',
    seoTitle: 'Apartment Turnover & Make-Ready Services',
    seoDescription:
      'Apartment turnover and make-ready services for property managers and owners — painting, repairs, and cleanup to prepare units for new residents.',
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
    image: maintenance,
    imageAlt: 'Maintenance technician in a hard hat and gloves servicing building equipment',
    seoTitle: 'General Property Maintenance',
    seoDescription:
      'General property maintenance support for multifamily and commercial properties in Jacksonville and Northeast Florida.',
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
