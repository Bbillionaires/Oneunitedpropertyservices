import type { ImageMetadata } from 'astro';
import pwBefore from '@/assets/placeholders/before-after/pressure-washing-before.jpg';
import pwAfter from '@/assets/placeholders/before-after/pressure-washing-after.jpg';
import paintBefore from '@/assets/placeholders/before-after/painting-before.jpg';
import paintAfter from '@/assets/placeholders/before-after/painting-after.jpg';
import lawnBefore from '@/assets/placeholders/before-after/landscaping-before.jpg';
import lawnAfter from '@/assets/placeholders/before-after/landscaping-after.jpg';
import cleanupBefore from '@/assets/placeholders/before-after/property-cleanup-before.jpg';
import cleanupAfter from '@/assets/placeholders/before-after/property-cleanup-after.jpg';
import turnBefore from '@/assets/placeholders/before-after/turnovers-before.jpg';
import turnAfter from '@/assets/placeholders/before-after/turnovers-after.jpg';

/**
 * Before & after comparisons.
 *
 * The current entries are SIMULATED placeholders (a stock "after" photo with a
 * digitally aged "before"). `placeholder: true` shows a visible disclosure label.
 * To add a real project: drop the two photos in src/assets/projects/, import them
 * here, and add an entry with `placeholder: false`.
 */
export interface Comparison {
  id: string;
  category: string;
  title: string;
  caption: string;
  before: ImageMetadata;
  after: ImageMetadata;
  beforeAlt: string;
  afterAlt: string;
  placeholder: boolean;
}

export const comparisons: Comparison[] = [
  {
    id: 'pressure-washing',
    category: 'Pressure Washing',
    title: 'Walkways & hardscape',
    caption: 'Built-up grime and mildew removed from sidewalks and walkways.',
    before: pwBefore,
    after: pwAfter,
    beforeAlt: 'Sidewalk and grounds darkened with grime and mildew',
    afterAlt: 'Same sidewalk and grounds after cleaning',
    placeholder: true,
  },
  {
    id: 'painting',
    category: 'Painting',
    title: 'Exterior repaint',
    caption: 'Weathered, stained facade brought back to a clean, uniform finish.',
    before: paintBefore,
    after: paintAfter,
    beforeAlt: 'Building facade with stained, weathered paint',
    afterAlt: 'Same building facade freshly painted white',
    placeholder: true,
  },
  {
    id: 'landscaping',
    category: 'Landscaping',
    title: 'Turf recovery',
    caption: 'Stressed turf returned to a healthy, evenly cut lawn.',
    before: lawnBefore,
    after: lawnAfter,
    beforeAlt: 'Dry, brown, patchy lawn in front of a commercial building',
    afterAlt: 'Same lawn green and evenly cut',
    placeholder: true,
  },
  {
    id: 'property-cleanup',
    category: 'Property Cleanup',
    title: 'Community curb appeal',
    caption: 'Driveways, walks, and frontage cleaned up across a residential community.',
    before: cleanupBefore,
    after: cleanupAfter,
    beforeAlt: 'Residential street with dirty driveways and dull frontage',
    afterAlt: 'Same residential street with clean driveways and bright frontage',
    placeholder: true,
  },
  {
    id: 'turnovers',
    category: 'Turnovers',
    title: 'Unit make-ready',
    caption: 'A tired, dingy unit prepared and refreshed for its next resident.',
    before: turnBefore,
    after: turnAfter,
    beforeAlt: 'Dim apartment interior with dingy walls and floors',
    afterAlt: 'Same apartment interior bright, clean, and move-in ready',
    placeholder: true,
  },
];
