import type { ImageMetadata } from 'astro';
import afterWashedDriveway from '@/assets/projects/gallery/after-washed-driveway.jpg';
import afterTownhomeDriveway from '@/assets/projects/gallery/after-townhome-driveway.jpg';
import afterFenceLawnWalk from '@/assets/projects/gallery/after-fence-lawn-walk.jpg';
import afterFenceRun from '@/assets/projects/gallery/after-fence-run.jpg';
import afterFencePanels from '@/assets/projects/gallery/after-fence-panels.jpg';
import beforeTownhomeFront from '@/assets/projects/gallery/before-townhome-front.jpg';
import beforeDrivewayIsland from '@/assets/projects/gallery/before-driveway-island.jpg';
import beforeSignCorner from '@/assets/projects/gallery/before-sign-corner.jpg';
import beforeFenceCorner from '@/assets/projects/gallery/before-fence-corner.jpg';
import beforeFenceMildew from '@/assets/projects/gallery/before-fence-mildew.jpg';
import beforeFenceRun from '@/assets/projects/gallery/before-fence-run.jpg';

/**
 * Before & after gallery — real One United job photos.
 *
 * Rules for this gallery:
 * - An AFTER photo only goes here once the work is finished: grass cut AND
 *   pavement or fence pressure washed.
 * - After photos are shown first and larger; before photos follow, smaller.
 * - No per-photo titles needed. `services` (service slugs) lets a service page
 *   show relevant after photos.
 * - Blur house numbers and license plates before adding photos.
 */
export interface GalleryPhoto {
  image: ImageMetadata;
  alt: string;
  services: string[];
}

export const afterPhotos: GalleryPhoto[] = [
  {
    image: afterWashedDriveway,
    alt: 'Pressure-washed driveway and walkway with a freshly cut lawn at a Jacksonville townhome',
    services: ['pressure-washing', 'lawn-grounds-care'],
  },
  {
    image: afterTownhomeDriveway,
    alt: 'Clean, pressure-washed driveway and freshly cut lawn in front of a townhome',
    services: ['pressure-washing', 'lawn-grounds-care'],
  },
  {
    image: afterFenceLawnWalk,
    alt: 'Freshly washed white vinyl fence along a cut lawn and walkway',
    services: ['pressure-washing', 'lawn-grounds-care'],
  },
  {
    image: afterFenceRun,
    alt: 'Long run of pressure-washed white vinyl fencing beside cut grass',
    services: ['pressure-washing'],
  },
  {
    image: afterFencePanels,
    alt: 'Close view of bright, clean vinyl fence panels after pressure washing',
    services: ['pressure-washing'],
  },
];

export const beforePhotos: GalleryPhoto[] = [
  { image: beforeTownhomeFront, alt: 'Overgrown grass and weeds across a townhome front lawn and driveway island', services: ['lawn-grounds-care'] },
  { image: beforeDrivewayIsland, alt: 'Overgrown driveway islands and stained concrete in front of townhomes', services: ['lawn-grounds-care', 'pressure-washing'] },
  { image: beforeSignCorner, alt: 'Knee-high grass and weeds on a corner lot around a street sign', services: ['lawn-grounds-care'] },
  { image: beforeFenceCorner, alt: 'Overgrown common area with litter along a privacy fence', services: ['lawn-grounds-care'] },
  { image: beforeFenceMildew, alt: 'Vinyl fence panels streaked with mildew and green staining', services: ['pressure-washing'] },
  { image: beforeFenceRun, alt: 'Run of vinyl fencing with dark mildew along the rails and posts', services: ['pressure-washing'] },
];

/** Shown under the gallery. Name the property only with the client's permission. */
export const galleryCaption = 'Real One United jobs · Townhome community · Jacksonville, FL · 2026';
