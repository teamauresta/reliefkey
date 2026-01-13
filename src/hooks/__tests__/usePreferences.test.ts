import { renderHook, act, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePreferences } from '../usePreferences';
import { DEFAULT_PREFERENCES } from '../../constants';

describe('usePreferences', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns default preferences initially', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const { result } = renderHook(() => usePreferences());

    await waitFor(() => {
      expect(result.current.preferences).toEqual(DEFAULT_PREFERENCES);
    });
  });

  it('loads saved preferences from storage', async () => {
    const saved = { ...DEFAULT_PREFERENCES, hapticEnabled: false };
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(saved));

    const { result } = renderHook(() => usePreferences());

    await waitFor(() => {
      expect(result.current.preferences.hapticEnabled).toBe(false);
    });
  });

  it('saves preferences when updated', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const { result } = renderHook(() => usePreferences());

    await waitFor(() => {
      expect(result.current.preferences).toBeDefined();
    });

    await act(async () => {
      await result.current.updatePreferences({ hapticEnabled: false });
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@reliefkey/preferences',
      expect.stringContaining('"hapticEnabled":false')
    );
  });
});
