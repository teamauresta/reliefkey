# Muscle Relaxation Feature Design

## Overview
Progressive Muscle Relaxation (PMR) technique with animated visual guidance, haptic feedback, and multiple session lengths.

## Session Types
- **Quick** (5 muscle groups, ~2 min): Hands → Shoulders → Face → Stomach → Legs
- **Standard** (7 muscle groups, ~5 min): Hands → Forearms → Upper arms → Shoulders → Face → Stomach → Legs

## Flow
1. User selects session length (Quick/Standard)
2. For each muscle group:
   - Tense phase (5s): Icon contracts, haptic pulse, "Tense your [muscle]"
   - Release phase (10s): Icon expands, soft haptic, "Release and relax..."
   - Transition (2s) to next group
3. Session complete screen with option to repeat

## UI Components
- Full-screen with gradient + floating orbs
- Central animated indicator (~200px) that tenses/releases
- Muscle group name + instruction text
- Progress dots showing all groups
- Close button (X) top-right

## Technical
- `MuscleRelaxationTechnique.tsx` - Main component
- `MuscleRelaxationSelector.tsx` - Session picker
- `src/constants/muscleGroups.ts` - Data definitions

## Haptics
- Medium impact: start of tense
- Light impact: release transition
- Success: session complete
