import { Restroom } from '../types/restroom';

const BASE_URL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';

interface GooglePlaceResult {
  place_id: string;
  name: string;
  vicinity: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  rating?: number;
  opening_hours?: {
    open_now?: boolean;
  };
}

interface GooglePlacesResponse {
  results: GooglePlaceResult[];
  status: string;
}

export async function fetchGoogleRestrooms(
  latitude: number,
  longitude: number,
  apiKey: string,
  radius: number = 1500,
): Promise<Restroom[]> {
  const url =
    `${BASE_URL}?location=${latitude},${longitude}` +
    `&radius=${radius}&keyword=restroom+bathroom+toilet&key=${apiKey}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Google Places API error: ${response.status}`);
  }

  const data: GooglePlacesResponse = await response.json();

  if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
    throw new Error(`Google Places API status: ${data.status}`);
  }

  return (data.results || []).map((place) => ({
    id: `google-${place.place_id}`,
    source: 'google' as const,
    name: place.name,
    address: place.vicinity,
    location: {
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng,
    },
    rating: place.rating,
    openNow: place.opening_hours?.open_now,
  }));
}
