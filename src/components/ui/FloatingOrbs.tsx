import React, { useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors } from '../../theme';

const { width, height } = Dimensions.get('window');

interface OrbConfig {
  size: number;
  color: string;
  initialX: number;
  initialY: number;
  duration: number;
}

const orbs: OrbConfig[] = [
  {
    size: 300,
    color: colors.orbs.teal,
    initialX: -50,
    initialY: 100,
    duration: 40000,
  },
  {
    size: 250,
    color: colors.orbs.purple,
    initialX: width - 100,
    initialY: 300,
    duration: 50000,
  },
  {
    size: 200,
    color: colors.orbs.pink,
    initialX: width / 2 - 100,
    initialY: height - 200,
    duration: 35000,
  },
  {
    size: 180,
    color: colors.orbs.teal,
    initialX: width - 150,
    initialY: 600,
    duration: 45000,
  },
];

function Orb({ size, color, initialX, initialY, duration }: OrbConfig) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateX.value = withRepeat(
      withSequence(
        withTiming(30, { duration: duration / 4, easing: Easing.inOut(Easing.ease) }),
        withTiming(-30, { duration: duration / 2, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: duration / 4, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    translateY.value = withRepeat(
      withSequence(
        withTiming(-25, { duration: duration / 3, easing: Easing.inOut(Easing.ease) }),
        withTiming(25, { duration: duration / 3, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: duration / 3, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <Animated.View
      style={[
        styles.orb,
        animatedStyle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          left: initialX,
          top: initialY,
        },
      ]}
    />
  );
}

export function FloatingOrbs() {
  return (
    <View style={styles.container} pointerEvents="none">
      {orbs.map((orb, index) => (
        <Orb key={index} {...orb} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  orb: {
    position: 'absolute',
    opacity: 0.5,
  },
});
