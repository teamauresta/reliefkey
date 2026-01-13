# ReliefKey - Mobile App Design Document

**Date:** 2026-01-13
**Status:** Validated
**Author:** Collaborative design session

## Overview

A mobile app helping men with paruresis (shy bladder) through in-the-moment relief techniques, a restroom finder, and a gradual exposure training program.

### Target Platform
- iOS and Android via React Native (Expo)

### Business Model
- Free 7-day trial with full relief tools
- Subscription: $6.99/month or $49.99/year

### Release Phases
1. **v1.0** - Relief tools (launch, trial-enabled)
2. **v1.1** - Restroom finder (existing APIs + user tips)
3. **v1.2** - Exposure training program

---

## Technical Stack

- **Frontend:** React Native with TypeScript, Expo
- **Backend:** Node.js serverless functions (AWS Lambda or Vercel)
- **Database:** PostgreSQL via Supabase or Railway
- **File Storage:** AWS S3 or Cloudflare R2 for audio files, served via CDN
- **Caching:** Redis for frequently-accessed data
- **Auth:** Expo AuthSession + custom backend
- **Payments:** RevenueCat for cross-platform subscription handling

---

## Feature 1: Relief Tools (v1.0 - Core)

Help users relax and urinate when anxiety strikes. Tools must work quickly, discreetly, and with minimal interaction.

### Techniques

1. **Guided Breathing** - Diaphragmatic breathing patterns (4-7-8, box breathing). Audio cues through headphones with optional haptic vibration for eyes-free use.

2. **Audio Masking** - White noise, rain, or running water sounds. Masks restroom sounds and provides psychological comfort.

3. **Mental Distraction** - Simple math problems or word tasks delivered via audio. Occupies the anxious mind so the body can relax.

4. **Progressive Muscle Relaxation** - Short audio guiding tension/release, focusing on pelvic floor relaxation. Abbreviated 60-90 second version for in-moment use.

5. **Visualization** - Guided imagery of comfortable urination scenarios. Longer form, useful before entering restroom.

### UX Requirements

- **One-tap start** - No fumbling through menus while anxious
- **Headphones assumed** - Audio-first design, discreet in public
- **Customizable quick-launch** - User sets preferred technique as default
- **Offline mode** - All audio/exercises cached locally

---

## Feature 2: Restroom Finder (v1.1)

Help users locate restrooms where they'll feel more comfortable.

### Data Sources

- **Google Places API** - Baseline restroom locations
- **Refuge Restrooms API** - Existing safe/accessible restroom database
- **User contributions** - Ratings, tips, and new locations

### Restroom Attributes (filterable)

- Single-occupancy (yes/no/unknown)
- Typical traffic level (low/medium/high)
- Cleanliness rating
- Lock quality ("solid lock," "flimsy," "no lock")
- Noise level (quiet, background music, loud)
- "Paruresis-friendly" overall score (computed)

### User Contributions

- Rate restrooms after visiting (quick 1-5 stars + optional tags)
- Add tips: "Use the one upstairs, much quieter"
- Submit new locations not in existing APIs
- Flag outdated info

### UX Flow

1. Map view centered on current location
2. Restrooms shown as pins, color-coded by paruresis-friendly score
3. Tap pin for details, directions, and user tips
4. "Navigate" opens preferred maps app
5. After visit, prompt for quick rating (non-intrusive)

---

## Feature 3: Exposure Training Program (v1.2)

Gradual desensitization based on CBT techniques used by paruresis specialists.

### Program Structure

- **Week 1-2:** Home baseline - Practice techniques, build confidence
- **Week 3-4:** Low-pressure public - Single-occupancy, quiet locations, off-peak hours
- **Week 5-6:** Moderate exposure - Multi-stall when empty, increasing proximity
- **Week 7-8:** Higher challenge - Busier restrooms, urinals, varied locations
- **Ongoing:** Maintenance - Regular practice, tackle specific scenarios

### Features

- **Daily challenges** - App suggests practice based on current level
- **Progress tracking** - Log attempts (success/partial/couldn't go), anxiety level (1-10)
- **Adaptive difficulty** - Moves slower if struggling, faster if succeeding
- **Encouragement without pressure** - Celebrate wins, normalize setbacks
- **Educational content** - Articles explaining why exposure works

---

## Backend Architecture

### API Endpoints

```
Auth:
  POST /auth/register
  POST /auth/login
  POST /auth/refresh-token

User:
  GET  /user/profile
  PUT  /user/preferences

Subscription:
  POST /subscription/verify
  GET  /subscription/status

Restrooms:
  GET  /restrooms/nearby?lat=&lng=&radius=
  GET  /restrooms/:id
  POST /restrooms
  POST /restrooms/:id/rating
  POST /restrooms/:id/tip

Progress (v1.2):
  GET  /progress
  POST /progress/log-attempt
  GET  /progress/challenges
```

### Data Model

- **Users** - id, email, created_at, subscription_status, preferences_json
- **Restrooms** - id, lat, lng, source (google/refuge/user), attributes_json
- **Ratings** - id, restroom_id, user_id, score, tags, created_at
- **Tips** - id, restroom_id, user_id, text, helpful_count
- **Progress Logs** - id, user_id, challenge_id, outcome, anxiety_level, location, logged_at

---

## Security & Privacy

### Data Minimization

- No real names required - email + password sufficient
- Progress logs store city-level location only
- Audio preferences stay on-device unless user opts into cloud sync
- Anonymous usage analytics only

### Encryption

- **In transit:** HTTPS everywhere, TLS 1.3 minimum
- **At rest:** Database encryption enabled
- **Sensitive fields:** Progress logs encrypted at application level (AES-256)

### Authentication

- Password hashing with bcrypt or Argon2
- JWT tokens: 15 min access, 7-day refresh
- Optional biometric unlock (FaceID/TouchID)
- No OAuth social logins (privacy concern)

### Privacy Features

- **App disguise** - Configurable app icon and name on home screen
- **Panic close** - Shake or double-tap to instantly close
- **No push notification content** - Generic messages only
- **Data export/delete** - GDPR-compliant

### Compliance

- Clear privacy policy
- No selling data to third parties
- GDPR and CCPA compliant from day one

---

## Offline Support & Reliability

### Offline-First Relief Tools

- All audio files downloaded on first launch
- Mental distraction exercises generated locally
- Zero network dependency for core functionality

### Restroom Data

- Cache nearby restrooms (5km radius)
- Favorited restrooms always available offline
- Sync when connection returns
- Clear UI indicator for cached data

### Progress Tracking

- Log attempts locally, sync when online
- Device data wins in conflicts
- Works fully offline for weeks

### Error Handling

- Network failures silent for non-critical actions
- Subscription validation cached for 7 days
- No error screens during relief tool use
- Retry queues for failed submissions

### Reliability

- Crash reporting via Sentry (privacy-conscious)
- App loads in under 2 seconds
- Background audio continues when app backgrounded

---

## Next Steps

1. Research paruresis relief techniques (IPA resources, academic papers)
2. Set up React Native/Expo project
3. Create git worktree for isolated development
4. Write detailed implementation plan
5. Begin v1.0 development (relief tools)
