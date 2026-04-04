export interface RestroomLocation {
  latitude: number;
  longitude: number;
}

export type RestroomSource = 'google' | 'refuge';

export interface Restroom {
  id: string;
  source: RestroomSource;
  name: string;
  address: string;
  location: RestroomLocation;
  distance?: number; // meters from user
  // Refuge-specific fields
  isAccessible?: boolean;
  isUnisex?: boolean;
  directions?: string;
  // Google-specific fields
  rating?: number;
  openNow?: boolean;
}

export interface RestroomFilter {
  accessible: boolean;
  unisex: boolean;
}
