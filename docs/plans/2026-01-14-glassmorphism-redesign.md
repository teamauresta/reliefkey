# ReliefKey Glassmorphism Redesign

## Visual Design System

### Color Palette (Ocean Depths)
| Role | Value |
|------|-------|
| Background gradient start | `#0a1628` (deep navy) |
| Background gradient mid | `#134e5e` (ocean teal) |
| Background gradient end | `#1a3a4a` (deep sea) |
| Glass surface | `rgba(255, 255, 255, 0.08)` |
| Glass border | `rgba(255, 255, 255, 0.15)` |
| Accent primary (seafoam) | `#64ffda` |
| Accent secondary (coral) | `#ff8a80` |
| Text primary | `#ffffff` |
| Text secondary | `#94a3b8` |

### Glass Effect
```css
background: rgba(255, 255, 255, 0.08);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 24px;
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
```

### Floating Orbs
- 3-4 large blurred gradient circles
- Colors: teal, purple, soft pink
- Opacity: 0.3-0.5
- Slow drift animation (30-60s loops)

## Icons (Lucide)
- Breathing: `Wind`
- Audio Masking: `Volume2`
- Mental Distraction: `Brain`
- Muscle Relaxation: `Sparkles`
- Visualization: `Eye`
- Nav: `Home`, `BarChart3`, `Settings`

## Typography
- Hero: 40px, light (300)
- H1: 32px, light
- H2: 24px, medium (500)
- Body: 16px, regular
- Caption: 14px, muted

## Components

### GlassCard
- Semi-transparent background
- Blur backdrop
- Subtle white border
- Large border radius (24px)
- Soft shadow

### QuickStartButton
- Glass card with seafoam gradient border
- Inner glow effect
- Pulsing breathe animation
- Hero focal point

### TechniqueCard
- Glass card
- Lucide icon at top
- Name + description
- Press state: brighter, lifted

### FloatingOrbs
- Absolute positioned
- Radial gradients
- Animated drift
- z-index behind content

### BottomTabBar
- Glass strip
- Stronger blur
- Seafoam active indicator

## Home Screen Layout
1. Background gradient (full screen)
2. Floating orbs layer
3. Header (floating text, no bg)
4. Quick Start button (hero)
5. Technique grid (2 columns)
6. Bottom tabs (glass bar)
