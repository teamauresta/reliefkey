import { useCallback, useRef } from 'react';
import { Audio } from 'expo-av';
import { VOICE_AUDIO } from '../../assets/audio/voice';

type VoiceCategory = 'breathing' | 'muscle' | 'beach' | 'forest' | 'mountains' | 'night-sky' | 'visualization';

export function useVoiceAudio() {
  const soundRef = useRef<Audio.Sound | null>(null);

  const play = useCallback(async (category: VoiceCategory, id: string) => {
    try {
      // Stop any currently playing audio
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      // Get the audio source
      const categoryAudio = VOICE_AUDIO[category];
      if (!categoryAudio) {
        console.warn(`Voice category not found: ${category}`);
        return;
      }

      const audioSource = categoryAudio[id];
      if (!audioSource) {
        console.warn(`Voice audio not found: ${category}/${id}`);
        return;
      }

      // Create and play the sound
      const { sound } = await Audio.Sound.createAsync(audioSource);
      soundRef.current = sound;
      await sound.playAsync();

      // Clean up when finished
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
          if (soundRef.current === sound) {
            soundRef.current = null;
          }
        }
      });
    } catch (error) {
      console.error('Error playing voice audio:', error);
    }
  }, []);

  const stop = useCallback(async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
      } catch (error) {
        console.error('Error stopping voice audio:', error);
      }
      soundRef.current = null;
    }
  }, []);

  return { play, stop };
}
