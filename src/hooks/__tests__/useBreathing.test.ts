import { renderHook, act } from '@testing-library/react-native';
import { useBreathing } from '../useBreathing';
import { BREATHING_PATTERNS } from '../../constants';

describe('useBreathing', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('starts in idle state', () => {
    const { result } = renderHook(() => useBreathing());
    expect(result.current.isActive).toBe(false);
    expect(result.current.phase).toBe('inhale');
  });

  it('cycles through breathing phases when active', () => {
    const { result } = renderHook(() =>
      useBreathing({ pattern: BREATHING_PATTERNS['simple'], hapticEnabled: true })
    );

    act(() => {
      result.current.start();
    });

    expect(result.current.isActive).toBe(true);
    expect(result.current.phase).toBe('inhale');

    // Advance through inhale (4 seconds)
    act(() => {
      jest.advanceTimersByTime(4000);
    });
    expect(result.current.phase).toBe('exhale');

    // Advance through exhale (6 seconds)
    act(() => {
      jest.advanceTimersByTime(6000);
    });
    expect(result.current.phase).toBe('rest');
  });

  it('stops when stop is called', () => {
    const { result } = renderHook(() => useBreathing());

    act(() => {
      result.current.start();
    });
    expect(result.current.isActive).toBe(true);

    act(() => {
      result.current.stop();
    });
    expect(result.current.isActive).toBe(false);
  });
});
