import { renderHook, act } from '@testing-library/react-native';
import { Audio } from 'expo-av';
import { useAudio } from '../useAudio';

describe('useAudio', () => {
  const mockSound = {
    playAsync: jest.fn(),
    stopAsync: jest.fn(),
    unloadAsync: jest.fn(),
    setIsLoopingAsync: jest.fn(),
    setVolumeAsync: jest.fn(),
    getStatusAsync: jest.fn().mockResolvedValue({ isLoaded: true }),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (Audio.Sound.createAsync as jest.Mock).mockResolvedValue({ sound: mockSound });
  });

  it('starts in stopped state', () => {
    const { result } = renderHook(() => useAudio());
    expect(result.current.isPlaying).toBe(false);
  });

  it('plays audio when play is called', async () => {
    const { result } = renderHook(() => useAudio());

    await act(async () => {
      await result.current.play('white-noise');
    });

    expect(result.current.isPlaying).toBe(true);
    expect(mockSound.playAsync).toHaveBeenCalled();
  });

  it('stops audio when stop is called', async () => {
    const { result } = renderHook(() => useAudio());

    await act(async () => {
      await result.current.play('white-noise');
    });

    await act(async () => {
      await result.current.stop();
    });

    expect(result.current.isPlaying).toBe(false);
    expect(mockSound.stopAsync).toHaveBeenCalled();
  });
});
