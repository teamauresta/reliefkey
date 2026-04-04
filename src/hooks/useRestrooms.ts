import { useState, useEffect, useCallback, useRef } from 'react';
import * as Location from 'expo-location';
import { Restroom, RestroomFilter } from '../types/restroom';
import { fetchRefugeRestrooms } from '../services/refugeRestrooms';
import { fetchGoogleRestrooms } from '../services/googlePlaces';

const GOOGLE_PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY ?? '';
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

interface CacheEntry {
  restrooms: Restroom[];
  timestamp: number;
  latitude: number;
  longitude: number;
}

function getDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371e3;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function deduplicateRestrooms(restrooms: Restroom[]): Restroom[] {
  const seen = new Map<string, Restroom>();
  for (const r of restrooms) {
    const key = `${r.location.latitude.toFixed(4)},${r.location.longitude.toFixed(4)}`;
    const existing = seen.get(key);
    if (!existing) {
      seen.set(key, r);
    } else if (r.source === 'refuge' && existing.source === 'google') {
      // Merge: prefer refuge metadata with google rating
      seen.set(key, {
        ...r,
        rating: existing.rating,
        openNow: existing.openNow,
      });
    }
  }
  return Array.from(seen.values());
}

export function useRestrooms() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [restrooms, setRestrooms] = useState<Restroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<RestroomFilter>({
    accessible: false,
    unisex: false,
  });
  const cacheRef = useRef<CacheEntry | null>(null);

  // Request location permission and get current position
  useEffect(() => {
    let mounted = true;

    async function getLocation() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          if (mounted) setError('Location permission denied');
          if (mounted) setLoading(false);
          return;
        }

        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        if (mounted) setLocation(loc);
      } catch (e) {
        if (mounted) setError('Unable to get location');
        if (mounted) setLoading(false);
      }
    }

    getLocation();
    return () => { mounted = false; };
  }, []);

  // Fetch restrooms when location is available
  const fetchRestrooms = useCallback(async (lat: number, lng: number) => {
    // Check cache
    const cache = cacheRef.current;
    if (
      cache &&
      Date.now() - cache.timestamp < CACHE_DURATION_MS &&
      getDistance(cache.latitude, cache.longitude, lat, lng) < 200
    ) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const results = await Promise.allSettled([
        fetchRefugeRestrooms(lat, lng),
        GOOGLE_PLACES_API_KEY
          ? fetchGoogleRestrooms(lat, lng, GOOGLE_PLACES_API_KEY)
          : Promise.resolve([]),
      ]);

      const allRestrooms: Restroom[] = [];
      for (const result of results) {
        if (result.status === 'fulfilled') {
          allRestrooms.push(...result.value);
        }
      }

      // Add distance and deduplicate
      const withDistance = allRestrooms.map((r) => ({
        ...r,
        distance: getDistance(lat, lng, r.location.latitude, r.location.longitude),
      }));

      const deduplicated = deduplicateRestrooms(withDistance);
      deduplicated.sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));

      cacheRef.current = {
        restrooms: deduplicated,
        timestamp: Date.now(),
        latitude: lat,
        longitude: lng,
      };

      setRestrooms(deduplicated);
    } catch (e) {
      setError('Failed to fetch restrooms');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (location) {
      fetchRestrooms(location.coords.latitude, location.coords.longitude);
    }
  }, [location, fetchRestrooms]);

  const refresh = useCallback(() => {
    if (location) {
      cacheRef.current = null;
      fetchRestrooms(location.coords.latitude, location.coords.longitude);
    }
  }, [location, fetchRestrooms]);

  const filteredRestrooms = restrooms.filter((r) => {
    if (filters.accessible && !r.isAccessible) return false;
    if (filters.unisex && !r.isUnisex) return false;
    return true;
  });

  return {
    location,
    restrooms: filteredRestrooms,
    allRestrooms: restrooms,
    loading,
    error,
    filters,
    setFilters,
    refresh,
  };
}
