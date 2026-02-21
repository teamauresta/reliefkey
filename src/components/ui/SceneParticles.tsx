import React, { useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
  interpolate,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Particle {
  id: number;
  startX: number;
  startY: number;
  size: number;
  duration: number;
  delay: number;
  driftX: number;
}

interface SceneParticlesProps {
  particleColor: string;
  particleCount?: number;
}

function AnimatedParticle({
  particle,
  color,
}: {
  particle: Particle;
  color: string;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      particle.delay,
      withRepeat(
        withTiming(1, {
          duration: particle.duration,
          easing: Easing.linear,
        }),
        -1,
        false
      )
    );
  }, [particle.delay, particle.duration, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(progress.value, [0, 1], [0, -SCREEN_HEIGHT * 0.6]);
    const translateX = interpolate(
      progress.value,
      [0, 0.5, 1],
      [0, particle.driftX, particle.driftX * 0.5]
    );
    const opacity = interpolate(
      progress.value,
      [0, 0.1, 0.7, 1],
      [0, 0.8, 0.6, 0]
    );
    const scale = interpolate(progress.value, [0, 0.5, 1], [0.5, 1, 0.3]);

    return {
      transform: [{ translateX }, { translateY }, { scale }],
      opacity,
    };
  });

  return (
    <Animated.View
      style={[
        styles.particle,
        animatedStyle,
        {
          left: particle.startX,
          top: particle.startY,
          width: particle.size,
          height: particle.size,
          borderRadius: particle.size / 2,
          backgroundColor: color,
        },
      ]}
    />
  );
}

export function SceneParticles({
  particleColor,
  particleCount = 20,
}: SceneParticlesProps) {
  const particles: Particle[] = React.useMemo(() => {
    return Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      startX: Math.random() * SCREEN_WIDTH,
      startY: SCREEN_HEIGHT * 0.5 + Math.random() * SCREEN_HEIGHT * 0.5,
      size: 4 + Math.random() * 8,
      duration: 8000 + Math.random() * 6000,
      delay: Math.random() * 4000,
      driftX: -30 + Math.random() * 60,
    }));
  }, [particleCount]);

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.map((particle) => (
        <AnimatedParticle
          key={particle.id}
          particle={particle}
          color={particleColor}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  particle: {
    position: 'absolute',
  },
});
