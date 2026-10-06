export interface NavItem {
  label: string;
  href: string;
}

export const mainNav: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services/' },
  { label: 'Property Types', href: '/property-types/' },
  { label: 'Before & After', href: '/before-after/' },
  { label: 'About', href: '/about/' },
  { label: 'Service Area', href: '/service-area/' },
  { label: 'Contact', href: '/contact/' },
];

export const quoteHref = '/quote/';

export const footerNav: NavItem[] = [
  { label: 'Services', href: '/services/' },
  { label: 'Property Types', href: '/property-types/' },
  { label: 'Service Area', href: '/service-area/' },
  { label: 'Request a Quote', href: '/quote/' },
  { label: 'Contact', href: '/contact/' },
];

export const legalNav: NavItem[] = [
  { label: 'Privacy Policy', href: '/privacy/' },
  { label: 'Terms', href: '/terms/' },
];
