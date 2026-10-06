/**
 * Service areas.
 *
 * Only list markets the business actually serves. `status: 'primary'` markets
 * are presented as served; anything else should only be added once confirmed.
 * Coordinates (lon/lat) position the marker on the Florida map.
 */
export interface ServiceArea {
  id: string;
  name: string;
  region: string;
  status: 'primary' | 'active';
  description: string;
  /** [longitude, latitude] */
  coords: [number, number];
  /** Approximate radius drawn on the map, in miles. Purely visual. */
  radiusMiles: number;
}

export const serviceAreas: ServiceArea[] = [
  {
    id: 'jacksonville',
    name: 'Jacksonville',
    region: 'Northeast Florida',
    status: 'primary',
    description:
      'Our home market. We serve apartment communities, multifamily, and commercial properties across Jacksonville and Northeast Florida.',
    coords: [-81.6557, 30.3322],
    radiusMiles: 45,
  },
  // Example — add more Florida markets once they are confirmed:
  // {
  //   id: 'orlando', name: 'Orlando', region: 'Central Florida', status: 'active',
  //   description: '…', coords: [-81.3792, 28.5383], radiusMiles: 35,
  // },
];

export const primaryArea = serviceAreas.find((a) => a.status === 'primary') ?? serviceAreas[0];
