import type { ImageMetadata } from 'astro';
import signBefore from '@/assets/projects/duval-landing/sign-corner-before.jpg';
import signAfter from '@/assets/projects/duval-landing/sign-corner-after.jpg';
import curbBefore from '@/assets/projects/duval-landing/curb-corner-before.jpg';
import curbAfter from '@/assets/projects/duval-landing/curb-corner-after.jpg';
import utilityBefore from '@/assets/projects/duval-landing/utility-frontage-before.jpg';
import utilityAfter from '@/assets/projects/duval-landing/utility-frontage-after.jpg';
import islandBefore from '@/assets/projects/duval-landing/driveway-island-before.jpg';
import islandAfter from '@/assets/projects/duval-landing/driveway-island-after.jpg';
import frontBefore from '@/assets/projects/duval-landing/townhome-front-before.jpg';
import frontAfter from '@/assets/projects/duval-landing/townhome-front-after.jpg';
import fenceBefore from '@/assets/projects/duval-landing/fence-line-before.jpg';
import fenceAfter from '@/assets/projects/duval-landing/fence-line-after.jpg';

/**
 * Before & after comparisons — real One United project photos.
 *
 * To add a project: put both photos in src/assets/projects/<project>/, import
 * them here, and add an entry. Set `placeholder: true` only for illustrative
 * (non-project) images; it shows a visible disclosure label.
 */
export interface Comparison {
  id: string;
  /** Service category, used to match comparisons to service pages. */
  category: string;
  title: string;
  caption: string;
  /** Where/when the work was done. Shown under the slider. */
  project: string;
  before: ImageMetadata;
  after: ImageMetadata;
  beforeAlt: string;
  afterAlt: string;
  placeholder: boolean;
  /**
   * true (default): both photos frame the exact same view → drag slider.
   * false: photos show comparable but different spots → side-by-side pair,
   * so the page never implies a match that isn't there.
   */
  sameView?: boolean;
}

/** Shown publicly. Change to the property name only with the client's permission. */
const PROJECT = 'Townhome community · Jacksonville, FL · Initial grounds cleanup, July 2026';

export const comparisons: Comparison[] = [
  {
    id: 'driveway-island',
    category: 'Lawn & Grounds',
    title: 'Driveway islands',
    caption: 'Overgrown turf islands between driveways cut back, edged, and brought down to a uniform height.',
    project: PROJECT,
    before: islandBefore,
    after: islandAfter,
    beforeAlt: 'Overgrown grass island between two townhome driveways with weeds along the concrete',
    afterAlt: 'Same driveway island mowed short and cleanly edged',
    placeholder: false,
  },
  {
    id: 'sign-corner',
    category: 'Lawn & Grounds',
    title: 'Entry corner',
    caption: 'Tall grass and weeds around a street sign cleared to an even, maintained lawn.',
    project: PROJECT,
    before: signBefore,
    after: signAfter,
    beforeAlt: 'Corner lot with knee-high grass and weeds around a street sign',
    afterAlt: 'Same corner mowed and cleared around the sign',
    placeholder: false,
  },
  {
    id: 'curb-corner',
    category: 'Lawn & Grounds',
    title: 'Curb corner',
    caption: 'Overgrowth along the curb line mowed and edged so the corner reads clean from the street.',
    project: PROJECT,
    before: curbBefore,
    after: curbAfter,
    beforeAlt: 'Overgrown grass spilling over a curved curb beside a privacy fence',
    afterAlt: 'Same curb corner mowed with a clean edge along the curb',
    placeholder: false,
  },
  {
    id: 'utility-frontage',
    category: 'Lawn & Grounds',
    title: 'Utility frontage',
    caption: 'Weedy frontage around a utility box and walkway cut back and tidied.',
    project: PROJECT,
    before: utilityBefore,
    after: utilityAfter,
    beforeAlt: 'Weedy, overgrown lawn around a green utility box near a sidewalk',
    afterAlt: 'Same frontage mowed with the walkway and utility box cleared',
    placeholder: false,
  },
  {
    id: 'townhome-front',
    category: 'Lawn & Grounds',
    title: 'Townhome frontage',
    caption: 'Front lawns and driveway islands restored to a consistent, cared-for look.',
    project: PROJECT,
    before: frontBefore,
    after: frontAfter,
    beforeAlt: 'Townhome front with an overgrown grass island and weeds along the driveway',
    afterAlt: 'Same townhome front with mowed, edged lawn areas',
    placeholder: false,
  },
  {
    id: 'fence-line',
    category: 'Lawn & Grounds',
    title: 'Fence line',
    caption: 'An overgrown common area along the privacy fence cleaned up and mowed.',
    project: PROJECT,
    before: fenceBefore,
    after: fenceAfter,
    beforeAlt: 'Overgrown common area along a white privacy fence with litter and a trash bin',
    afterAlt: 'Same fence-line common area mowed and cleaned up',
    placeholder: false,
  },
];
