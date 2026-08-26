import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { lightColors, darkColors } from '../theme/colors';
import { BreathPhase } from '../hooks/useBreathing';
import { fontSize, fontWeight, letterSpacing } from '../theme/typography';
import { spacing } from '../theme/spacing';

const CIRCLE_BASE = 180;
const CIRCLE_EXPANDED = 260;

type Props = {
  phase: BreathPhase;
  /** The animated 0→1 value from useBreathing */
  animatedValue: Animated.Value;
  reduceMotion?: boolean;
};

/**
 * The breathing circle — expands on inhale, contracts on exhale.
 * When reduceMotion is true, uses opacity instead of scale.
 */
export function BreathingCircle({ phase, animatedValue, reduceMotion = false }: Props) {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;

  const phaseLabel = phase === 'inhale' ? 'Breathe in' : phase === 'exhale' ? 'Breathe out' : '';

  const labelOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (phase === 'idle') {
      Animated.timing(labelOpacity, { toValue: 0, duration: 300, useNativeDriver: true }).start();
      return;
    }
    Animated.sequence([
      Animated.timing(labelOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(labelOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  }, [phase, labelOpacity]);

  // In reduce-motion mode: animate opacity only
  if (reduceMotion) {
    const opacity = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 1],
    });

    return (
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.circle,
            styles.circleFixed,
            {
              backgroundColor: colors.breathCircle,
              borderColor: colors.breathCircleBorder,
              opacity,
            },
          ]}
          accessibilityLabel={phaseLabel}
        />
        <Animated.Text
          style={[styles.label, { color: colors.accent, opacity: labelOpacity }]}
          accessibilityLiveRegion="polite"
        >
          {phaseLabel}
        </Animated.Text>
      </View>
    );
  }

  // Normal mode: scale animation
  const scale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [CIRCLE_BASE / CIRCLE_EXPANDED, 1],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.circle,
          {
            width: CIRCLE_EXPANDED,
            height: CIRCLE_EXPANDED,
            borderRadius: CIRCLE_EXPANDED / 2,
            backgroundColor: colors.breathCircle,
            borderColor: colors.breathCircleBorder,
            transform: [{ scale }],
          },
        ]}
        accessibilityLabel={phaseLabel}
      />
      <Animated.Text
        style={[styles.label, { color: colors.accent, opacity: labelOpacity }]}
        accessibilityLiveRegion="polite"
      >
        {phaseLabel}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: CIRCLE_EXPANDED + 80,
  },
  circle: {
    borderWidth: 1.5,
    position: 'absolute',
  },
  circleFixed: {
    width: CIRCLE_EXPANDED,
    height: CIRCLE_EXPANDED,
    borderRadius: CIRCLE_EXPANDED / 2,
  },
  label: {
    position: 'absolute',
    bottom: 0,
    fontSize: fontSize.bodySmall,
    fontWeight: fontWeight.medium,
    letterSpacing: letterSpacing.wider,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
