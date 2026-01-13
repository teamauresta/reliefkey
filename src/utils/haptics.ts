import * as Haptics from 'expo-haptics';

export type HapticPattern = 'light' | 'medium' | 'heavy';

const HAPTIC_MAP: Record<HapticPattern, Haptics.ImpactFeedbackStyle> = {
  light: Haptics.ImpactFeedbackStyle.Light,
  medium: Haptics.ImpactFeedbackStyle.Medium,
  heavy: Haptics.ImpactFeedbackStyle.Heavy,
};

export async function triggerHaptic(
  pattern: HapticPattern,
  enabled: boolean = true
): Promise<void> {
  if (!enabled) return;
  await Haptics.impactAsync(HAPTIC_MAP[pattern]);
}
