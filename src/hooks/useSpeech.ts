import { useCallback, useRef, useEffect } from 'react';
import * as Speech from 'expo-speech';

interface UseSpeechOptions {
  rate?: number;
  pitch?: number;
  language?: string;
}

export function useSpeech(options: UseSpeechOptions = {}) {
  const { rate = 0.85, pitch = 1.0, language = 'en-US' } = options;
  const isSpeakingRef = useRef(false);

  const speak = useCallback(
    async (text: string) => {
      try {
        // Stop any existing speech
        if (isSpeakingRef.current) {
          await Speech.stop();
        }

        isSpeakingRef.current = true;

        return new Promise<void>((resolve) => {
          Speech.speak(text, {
            rate,
            pitch,
            language,
            onDone: () => {
              isSpeakingRef.current = false;
              resolve();
            },
            onError: () => {
              isSpeakingRef.current = false;
              resolve();
            },
            onStopped: () => {
              isSpeakingRef.current = false;
              resolve();
            },
          });
        });
      } catch (error) {
        console.error('Speech error:', error);
        isSpeakingRef.current = false;
      }
    },
    [rate, pitch, language]
  );

  const stop = useCallback(async () => {
    try {
      await Speech.stop();
      isSpeakingRef.current = false;
    } catch (error) {
      console.error('Failed to stop speech:', error);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  return { speak, stop };
}
