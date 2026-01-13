import { useMemo } from 'react';

interface Greeting {
  text: string;
  emoji: string;
}

export function useGreeting(): Greeting {
  return useMemo(() => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return { text: 'Good morning', emoji: '🌅' };
    } else if (hour >= 12 && hour < 17) {
      return { text: 'Good afternoon', emoji: '☀️' };
    } else if (hour >= 17 && hour < 21) {
      return { text: 'Good evening', emoji: '🌆' };
    } else {
      return { text: 'Wind down', emoji: '🌙' };
    }
  }, []);
}
