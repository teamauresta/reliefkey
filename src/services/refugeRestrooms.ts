import { Restroom } from '../types/restroom';

const BASE_URL = 'https://www.refugerestrooms.org/api/v1';

interface RefugeRestroomResponse {
  id: number;
  name: string;
  street: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  accessible: boolean;
  unisex: boolean;
  directions: string | null;
  distance?: number;
}

export async function fetchRefugeRestrooms(
  latitude: number,
  longitude: number,
): Promise<Restroom[]> {
  const url = `${BASE_URL}/restrooms/by_location?lat=${latitude}&lng=${longitude}&per_page=20`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Refuge API error: ${response.status}`);
  }

  const data: RefugeRestroomResponse[] = await response.json();

  return data.map((r) => ({
    id: `refuge-${r.id}`,
    source: 'refuge' as const,
    name: r.name,
    address: [r.street, r.city, r.state].filter(Boolean).join(', '),
    location: {
      latitude: r.latitude,
      longitude: r.longitude,
    },
    isAccessible: r.accessible,
    isUnisex: r.unisex,
    directions: r.directions ?? undefined,
  }));
}
