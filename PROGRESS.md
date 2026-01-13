# ReliefKey Progress Tracker

## Current Version: v1.0 (Relief Tools)

### Completed Features

| Feature | Status | Tests | Notes |
|---------|--------|-------|-------|
| Guided Breathing | Done | 4 passing | Box breathing (4-7-8), haptic feedback, visual phases |
| Audio Masking | Done | 3 passing | White noise, rain, running water via expo-av |
| Mental Distraction | Done | 7 passing | Math problems, number pad, score tracking |
| Home Screen | Done | 3 passing | Quick-start, technique list, navigation |
| Preferences Hook | Done | 4 passing | AsyncStorage persistence |
| Haptics Utility | Done | 3 passing | Light/medium/heavy patterns |
| Audio Hook | Done | 4 passing | Play/stop/volume control |

**Total: 28 tests passing, 82.65% line coverage**

### Placeholder Features (v1.0)

| Feature | Status | Notes |
|---------|--------|-------|
| Muscle Relaxation | Placeholder | Shows "Coming Soon" - needs audio files |
| Visualization | Placeholder | Shows "Coming Soon" - needs audio files |

---

## Roadmap

### v1.1 - Restroom Finder
- [ ] Google Places API integration
- [ ] Refuge Restrooms API integration
- [ ] Map view with pins
- [ ] Restroom ratings and tips
- [ ] Offline caching (5km radius)

### v1.2 - Exposure Training
- [ ] Daily challenges
- [ ] Progress logging (success/partial/couldn't go)
- [ ] Anxiety level tracking (1-10)
- [ ] Adaptive difficulty
- [ ] Educational content

### Future Enhancements
- [ ] Real audio files for muscle relaxation guide
- [ ] Real audio files for visualization guide
- [ ] App disguise (custom icon/name)
- [ ] Biometric unlock
- [ ] Cloud sync (optional)
- [ ] RevenueCat subscription integration

---

## Technical Debt

| Issue | Priority | Notes |
|-------|----------|-------|
| SafeAreaView deprecation | Medium | Migrate to react-native-safe-area-context |
| @types/jest missing | Low | TypeScript errors in test files (tests still run) |
| Accessibility labels | Medium | Add to all interactive elements |
| Theme extraction | Low | Consolidate colors to shared theme file |

---

## Quick Commands

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Start development
npx expo start

# Check git history
git log --oneline
```

---

## Key Files

| Purpose | Path |
|---------|------|
| Design document | `docs/plans/2026-01-13-reliefkey-design.md` |
| Implementation plan | `docs/plans/2026-01-13-v1-relief-tools.md` |
| Types | `src/types/index.ts` |
| Constants | `src/constants/index.ts` |
| Home screen | `src/screens/HomeScreen.tsx` |

---

*Last updated: 2026-01-13*
