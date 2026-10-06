import type { IconName } from '@/components/icons';

/** Service programs. `quoteValue` pre-selects frequency/program in the quote form. */
export interface Program {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  quoteFrequency: string;
}

export const programs: Program[] = [
  {
    id: 'one-time',
    title: 'One-Time Service',
    description: 'A single project — a pressure wash, a repaint, a cleanup, or a unit turn — scoped and completed.',
    icon: 'bolt',
    quoteFrequency: 'one-time',
  },
  {
    id: 'recurring',
    title: 'Recurring Maintenance',
    description: 'Scheduled service on a weekly, biweekly, or monthly rhythm built around how your property operates.',
    icon: 'repeat',
    quoteFrequency: 'recurring',
  },
  {
    id: 'portfolio',
    title: 'Multi-Property / Portfolio',
    description: 'Coordinated service across several properties, with one relationship and consistent standards.',
    icon: 'grid',
    quoteFrequency: 'recurring',
  },
  {
    id: 'custom',
    title: 'Custom Maintenance Plan',
    description: 'Combine services and frequencies into a plan tailored to the property’s requirements and budget.',
    icon: 'sliders',
    quoteFrequency: 'not-sure',
  },
];

export const whyPoints: { title: string; description: string; icon: IconName }[] = [
  {
    title: 'One Vendor',
    description: 'Simplify property maintenance by consolidating multiple services.',
    icon: 'handshake',
  },
  {
    title: 'Recurring Service',
    description: 'Build scheduled maintenance around the property’s needs.',
    icon: 'calendar',
  },
  {
    title: 'Multi-Service Capability',
    description: 'Lawn care, pressure washing, painting, turnovers and maintenance.',
    icon: 'layers',
  },
  {
    title: 'Commercial Focus',
    description: 'Services designed around multifamily and commercial properties.',
    icon: 'building',
  },
];
