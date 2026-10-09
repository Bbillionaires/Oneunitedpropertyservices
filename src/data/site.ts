/**
 * Core business information.
 *
 * Anything marked `placeholder: true` has NOT been provided by the business yet.
 * Placeholders render with a visible "placeholder" treatment and are excluded
 * from structured data (schema.org) so search engines never see invented facts.
 * Replace the value and flip `placeholder` to false when real details are ready.
 */

export interface ContactField {
  label: string;
  value: string;
  href?: string;
  placeholder: boolean;
}

export const site = {
  name: 'One United Property Services',
  shortName: 'One United',
  parent: 'One United Enterprise',
  parentLine: 'A One United Enterprise Company',
  tagline: 'One Property. One Team. One United.',
  domain: 'OneUnitedPropertyServices.com',
  url: 'https://oneunitedpropertyservices.com',
  description:
    'Complete property maintenance for apartment communities, multifamily, residential, and commercial properties, including gas stations — lawn and grounds care, weed and pesticide spraying, pressure washing, painting, turnovers, home cleaning and steaming, general maintenance, and EV charging station installation in Jacksonville and Northeast Florida.',
  primaryMarket: 'Jacksonville & Northeast Florida',

  contact: {
    phone: { label: 'Phone', value: 'Phone number coming soon', placeholder: true },
    email: { label: 'Email', value: 'Email address coming soon', placeholder: true },
    address: { label: 'Business address', value: 'Business address coming soon', placeholder: true },
    hours: { label: 'Office hours', value: 'Office hours coming soon', placeholder: true },
  } satisfies Record<string, ContactField>,

  /** Add real profile URLs and set placeholder: false to show them as links. */
  social: [
    { label: 'Facebook', href: '#', placeholder: true },
    { label: 'Instagram', href: '#', placeholder: true },
    { label: 'LinkedIn', href: '#', placeholder: true },
  ],
} as const;

export type Site = typeof site;
