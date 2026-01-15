# Restroom Finder (v1.1) Design Document

**Date:** 2026-01-15
**Status:** Approved
**Author:** Collaborative design session

## Overview

A map-based restroom finder that helps users locate paruresis-friendly restrooms. Combines data from Google Places and Refuge Restrooms APIs, enriched with community ratings and tips stored in Supabase.

## Key Decisions

| Decision | Choice |
|----------|--------|
| Backend | Supabase (PostgreSQL + PostGIS + Auth) |
| Map Provider | Google Maps SDK |
| Data Sources | Google Places API + Refuge Restrooms API |
| Authentication | Social login (Google/Apple via Supabase Auth) |
| Rating Attributes | Single-occupancy, traffic level, cleanliness, lock quality, noise level, overall stars |
| Navigation | New tab in bottom nav |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Mobile App                           │
├─────────────────────────────────────────────────────────────┤
│  Google Maps SDK  ←→  Restroom Finder Screen  ←→  Supabase │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                        Supabase                             │
├─────────────────────────────────────────────────────────────┤
│  Auth (Google/Apple)  │  PostgreSQL + PostGIS  │  Storage  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    External APIs                            │
├─────────────────────────────────────────────────────────────┤
│         Google Places API    │    Refuge Restrooms API      │
└─────────────────────────────────────────────────────────────┘
```

**Data Flow:**
1. App requests user location, fetches nearby restrooms from Google Places + Refuge Restrooms
2. Results are merged and enriched with user ratings from Supabase
3. Map displays pins color-coded by paruresis-friendly score
4. Users can tap pins for details, navigate, and submit ratings
5. Ratings sync to Supabase, available to all users

---

## Database Schema (Supabase/PostgreSQL)

```sql
-- Users (managed by Supabase Auth, extended with profile)
profiles
  id              UUID PRIMARY KEY (refs auth.users)
  created_at      TIMESTAMP
  display_name    TEXT (optional, for anonymity)

-- Restrooms (cached from APIs + user-submitted)
restrooms
  id              UUID PRIMARY KEY
  source          TEXT ('google' | 'refuge' | 'user')
  external_id     TEXT (Google Place ID or Refuge ID)
  name            TEXT
  address         TEXT
  location        GEOGRAPHY(POINT) -- PostGIS for geo queries
  is_single_occ   BOOLEAN (null = unknown)
  created_at      TIMESTAMP
  updated_at      TIMESTAMP

-- User ratings
ratings
  id              UUID PRIMARY KEY
  restroom_id     UUID REFERENCES restrooms
  user_id         UUID REFERENCES profiles
  overall_score   INT (1-5)
  is_single_occ   BOOLEAN
  traffic_level   TEXT ('low' | 'medium' | 'high')
  cleanliness     INT (1-5)
  lock_quality    INT (1-5)
  noise_level     TEXT ('quiet' | 'moderate' | 'loud')
  created_at      TIMESTAMP

-- User tips (text comments)
tips
  id              UUID PRIMARY KEY
  restroom_id     UUID REFERENCES restrooms
  user_id         UUID REFERENCES profiles
  text            TEXT (max 280 chars)
  helpful_count   INT DEFAULT 0
  created_at      TIMESTAMP

-- User favorites
favorites
  user_id         UUID REFERENCES profiles
  restroom_id     UUID REFERENCES restrooms
  PRIMARY KEY (user_id, restroom_id)
```

**Computed paruresis-friendly score:**
- Weighted average: 40% single-occupancy, 30% low traffic, 20% cleanliness, 10% lock quality
- Display colors: Green (4-5), Yellow (3-4), Red (1-3), Gray (no ratings)

---

## UI Components & Screens

### RestroomFinderScreen (main tab)
- Full-screen Google Map centered on user location
- Floating search bar at top (search by name/address)
- Filter chips below search (Single-stall, Low traffic, Nearby)
- Restroom pins color-coded by score
- "Re-center" FAB button
- Bottom sheet appears when pin tapped

### RestroomDetailSheet (bottom sheet)
- Restroom name, address, distance
- Paruresis-friendly score badge
- Quick stats: Single-stall (Y/N/Unknown), Traffic, Cleanliness
- "Navigate" button (opens Apple/Google Maps)
- "Rate this restroom" button
- User tips section (expandable)
- "Add to favorites" heart icon

### RatingModal
- Quick rating flow (~15 seconds)
- Single-occupancy toggle (Yes/No/Not sure)
- Traffic level selector (Low/Medium/High)
- Star ratings for cleanliness and lock quality
- Noise level selector
- Optional tip text field
- Submit button

### AuthModal
- "Continue with Google" button
- "Continue with Apple" button
- Privacy note: "Your ratings are anonymous to other users"

---

## API Integration

### Google Places API
- Endpoint: `nearbysearch` with `type=bathroom` or keyword "restroom"
- Radius: 1km from map center (expand to 5km if few results)
- Returns: name, address, place_id, location, rating
- Cache results for 5 minutes per area

### Refuge Restrooms API
- Endpoint: `GET /api/v1/restrooms/by_location?lat=X&lng=Y`
- Returns: name, address, accessible, unisex (single-stall), directions
- Free, no API key required
- Merge by matching address/coordinates (within 50m = same restroom)

### Supabase Enrichment
- Query ratings using PostGIS: `ST_DWithin(location, point, 1000)`
- Attach aggregated scores and user tips to each result

### Caching Strategy
- Cache API results in Supabase restrooms table
- On first fetch, save restroom with source
- Refresh external data if cached entry > 30 days old

---

## Authentication Flow

**Auth required for:**
- Submitting a rating
- Adding a tip
- Favoriting a restroom
- Browsing map is anonymous

**Implementation:**
```
expo-auth-session     → OAuth flow handling
expo-secure-store     → Token storage
@supabase/supabase-js → Auth client
```

**Session management:**
- Access token: 1 hour expiry, auto-refresh
- Refresh token: 30 days, stored in secure storage

**Privacy:**
- Display name optional (defaults to "Anonymous User")
- Ratings anonymous to other users
- Full data deletion available (GDPR compliant)

---

## Project Structure

```
src/
├── screens/
│   └── RestroomFinderScreen.tsx
├── components/
│   ├── restroom/
│   │   ├── RestroomMap.tsx
│   │   ├── RestroomDetailSheet.tsx
│   │   ├── RestroomPin.tsx
│   │   ├── RatingModal.tsx
│   │   └── FilterChips.tsx
│   └── auth/
│       └── AuthModal.tsx
├── hooks/
│   ├── useRestrooms.ts
│   ├── useRestroomRatings.ts
│   └── useAuth.ts
├── services/
│   ├── supabase.ts
│   ├── googlePlaces.ts
│   └── refugeRestrooms.ts
├── types/
│   └── restroom.ts
└── constants/
    └── restroomFilters.ts
```

---

## Implementation Phases

1. **Phase 1:** Supabase setup, auth flow, database schema
2. **Phase 2:** Google Maps integration, basic map display
3. **Phase 3:** Google Places + Refuge API integration, pin display
4. **Phase 4:** Restroom detail sheet, navigation
5. **Phase 5:** Rating modal, submit to Supabase
6. **Phase 6:** Filters, favorites, tips
7. **Phase 7:** Polish, testing, error handling

---

## Dependencies to Add

```bash
npx expo install react-native-maps
npx expo install expo-location
npx expo install expo-auth-session expo-crypto expo-web-browser
npx expo install @supabase/supabase-js
npx expo install expo-secure-store
npx expo install @gorhom/bottom-sheet react-native-gesture-handler
```

---

## Environment Variables

```
EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=xxx
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=xxx
EXPO_PUBLIC_GOOGLE_PLACES_API_KEY=xxx
```
