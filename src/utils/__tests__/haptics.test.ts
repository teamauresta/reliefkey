import * as Haptics from 'expo-haptics';
import { triggerHaptic, HapticPattern } from '../haptics';

describe('haptics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('triggers light haptic feedback', async () => {
    await triggerHaptic('light');
    expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
  });

  it('triggers medium haptic feedback', async () => {
    await triggerHaptic('medium');
    expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Medium);
  });

  it('does nothing when disabled', async () => {
    await triggerHaptic('light', false);
    expect(Haptics.impactAsync).not.toHaveBeenCalled();
  });
});
