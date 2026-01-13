# ReliefKey UI Redesign & Settings Feature

## Overview

Complete visual redesign with nature-inspired theme, enhanced animations, and settings/personalization features.

## Goals

- Transform basic UI into polished, calming experience
- Add settings screen for user personalization
- Implement rich animations throughout
- Support multiple use cases: panic relief, therapy companion, daily wellness

## Visual Design System

### Color Palette (Nature-Inspired)

| Role | Color | Hex |
|------|-------|-----|
| Primary background | Deep forest | `#1a2e1a` |
| Secondary background | Soft moss | `#2d4a3e` |
| Surface cards | Translucent sage | `rgba(62, 92, 78, 0.6)` |
| Accent (action) | Warm amber | `#d4a574` |
| Accent (calm) | Soft sky blue | `#7eb8c9` |
| Text primary | Warm white | `#f5f2eb` |
| Text secondary | Muted stone | `#a8b5a0` |

### Typography

- Headers: Rounded sans-serif (soft, approachable)
- Body: System font for readability

### Organic Shapes

- Rounded corners (16-24px radius)
- Soft blob shapes for backgrounds
- Gentle wave patterns as dividers
- Leaf/pebble-inspired button shapes

### Textures & Depth

- Subtle noise grain overlay
- Layered gradients (sky/forest depth)
- Soft shadows with green/blue tints

## Screen Designs

### Home Screen

**Layout:**
- Full-screen gradient background (forest-to-sky)
- Floating organic shapes animating in background
- Content on translucent cards

**Components:**
- Header with time-based greeting and animated leaf icon
- Large pill-shaped Quick Start button with amber glow and pulse animation
- 2-column technique card grid (replacing list)
- Bottom navigation: Home, Progress, Settings

**Technique Cards:**
- Custom illustrated icons (not emoji)
- Name and tagline
- Unique background pattern per technique
- Gentle float animation on press
- Coming-soon techniques dimmed with badge

### Breathing Technique Screen

- Full-screen immersive gradient
- Central organic blob that morphs (inhale/exhale)
- Phase text with fade transitions
- Timer ring around blob
- Pattern selector pills at top
- Floating particle effects (fireflies)
- Haptic sync with phases

### Audio Masking Screen

- Animated visualizer (waves/raindrops)
- Horizontal scrollable sound cards with imagery
- Curved volume slider
- Mix mode: layer multiple sounds
- Auto-stop timer option

### Mental Distraction Screen

- Card-based problem layout
- Difficulty toggle (Easy/Medium/Hard)
- Animated success feedback (falling leaves)
- Streak counter with celebrations
- Problem type switcher

### Settings Screen

**Sections:**

1. **Breathing Preferences**
   - Default pattern selector with visual preview
   - Custom pattern builder (drag sliders)
   - Save custom patterns

2. **Sound Preferences**
   - Default sound picker with preview
   - Offline download option
   - Custom mix saves

3. **Appearance**
   - Theme toggle: Forest (dark), Meadow (light), Dusk (warm)
   - Animation intensity: Full, Reduced, Minimal
   - Haptic feedback toggle

4. **Quick Start Customization**
   - Default technique picker
   - Favorites selection

5. **Accessibility**
   - Larger text
   - High contrast mode
   - Screen reader optimizations

6. **About & Support**

## Animations

### Global

- Screen transitions: crossfade with scale (0.95 to 1.0)
- Cards: spring physics press states
- Staggered element entry (50ms delays)

### Background

- Floating blobs: sine wave drift, 20-30s loops
- Gradient color pulses
- Sparse particle systems

### Breathing

- Blob morph with elastic easing
- Phase text fade with Y movement
- Haptic sync
- Completion: ring expansion, leaf confetti

### Interactive Feedback

- Button glow and ripple
- Toggle slide with bounce
- Card lift with shadow
- Success shimmer effects

### Accessibility

- Respect system "Reduced motion" setting
- In-app animation intensity control

## Technical Approach

### Dependencies to Add

- `react-native-reanimated` - performant animations
- `expo-linear-gradient` - gradient backgrounds
- `expo-blur` - frosted glass effects
- `@react-navigation/bottom-tabs` - navigation
- `@react-navigation/native` - navigation core

### File Structure

```
src/
  theme/
    colors.ts
    typography.ts
    spacing.ts
    index.ts
  components/
    ui/
      Button.tsx
      Card.tsx
      GradientBackground.tsx
      FloatingBlobs.tsx
  screens/
    HomeScreen.tsx (redesign)
    SettingsScreen.tsx (new)
    ProgressScreen.tsx (placeholder)
  navigation/
    BottomTabNavigator.tsx
    index.tsx
```

## Out of Scope

- Progress tracking functionality (placeholder screen only)
- Muscle relaxation technique implementation
- Visualization technique implementation
- Backend/cloud sync
- User accounts

## Success Criteria

- App feels calming and polished
- Animations run at 60fps on modern devices
- Settings persist across sessions
- Accessibility options functional
- All existing techniques enhanced with new design
