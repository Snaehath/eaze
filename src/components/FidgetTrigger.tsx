import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { lightColors, darkColors } from '../theme/colors';
import { fontSize, fontWeight, letterSpacing } from '../theme/typography';
import { useHaptics } from '../hooks/useHaptics';

type Props = {
  reduceMotion?: boolean;
};

const GEAR_SIZE = 190;
const CORE_SIZE = 104;
const TICK_COUNT = 24;

/**
 * Premium Kinetic Chrono-Gear Fidget
 *
 * A luxurious mechanical sensory instrument:
 * - 24 precision micro-indices with major cardinal markers
 * - Counter-rotating planetary orbital ring
 * - Dynamic kinetic acceleration loop with realistic inertia damping
 * - Velocity-synchronized tactile micro-haptics
 * - Ambient radial glow that expands as energy is discharged
 */
export function FidgetTrigger({ reduceMotion = false }: Props) {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;
  const haptics = useHaptics();

  const [isHolding, setIsHolding] = useState(false);

  // Animation values
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const innerRotationAnim = useRef(new Animated.Value(0)).current;
  const coreScale = useRef(new Animated.Value(1)).current;
  const glowScale = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;

  // Physics state refs for smooth requestAnimationFrame loop
  const angleRef = useRef(0);
  const velocityRef = useRef(0);
  const isHoldingRef = useRef(false);
  const animFrameIdRef = useRef<number | null>(null);
  const lastHapticTimeRef = useRef(0);

  // Main physics & animation loop
  useEffect(() => {
    let lastTime = Date.now();

    const loop = () => {
      const now = Date.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      if (isHoldingRef.current) {
        // Smooth progressive acceleration
        velocityRef.current = Math.min(velocityRef.current + dt * 18, 30);
      } else {
        // Natural inertial coasting down
        velocityRef.current = Math.max(velocityRef.current - dt * 12, 0);
      }

      if (velocityRef.current > 0.05) {
        angleRef.current = (angleRef.current + velocityRef.current * dt * 130) % 360;
        rotationAnim.setValue(angleRef.current);
        innerRotationAnim.setValue(-angleRef.current * 1.6);

        // Velocity-synced haptics
        const hapticInterval = Math.max(50, 420 - velocityRef.current * 13);
        if (now - lastHapticTimeRef.current >= hapticInterval) {
          lastHapticTimeRef.current = now;
          if (velocityRef.current > 16) {
            haptics.medium();
          } else {
            haptics.light();
          }
        }
      }

      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    animFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [rotationAnim, innerRotationAnim, haptics]);

  const handlePressIn = useCallback(() => {
    isHoldingRef.current = true;
    setIsHolding(true);
    haptics.medium();

    if (velocityRef.current < 3) {
      velocityRef.current = 5; // Instant initial tactile impulse
    }

    if (!reduceMotion) {
      Animated.parallel([
        Animated.spring(coreScale, {
          toValue: 0.93,
          speed: 60,
          bounciness: 4,
          useNativeDriver: true,
        }),
        Animated.timing(glowOpacity, {
          toValue: 0.6,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(glowScale, {
          toValue: 1.15,
          speed: 20,
          bounciness: 8,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [coreScale, glowScale, glowOpacity, haptics, reduceMotion]);

  const handlePressOut = useCallback(() => {
    isHoldingRef.current = false;
    setIsHolding(false);

    if (!reduceMotion) {
      Animated.parallel([
        Animated.spring(coreScale, {
          toValue: 1,
          speed: 25,
          bounciness: 8,
          useNativeDriver: true,
        }),
        Animated.timing(glowOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(glowScale, {
          toValue: 1,
          speed: 15,
          bounciness: 4,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [coreScale, glowScale, glowOpacity, reduceMotion]);

  const gearSpin = rotationAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  const innerSpin = innerRotationAnim.interpolate({
    inputRange: [-360, 0, 360],
    outputRange: ['-360deg', '0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* Ambient Charging Aura Glow */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.ambientGlow,
          {
            backgroundColor: colors.accentFaint,
            borderColor: colors.breathCircleBorder,
            opacity: glowOpacity,
            transform: [{ scale: glowScale }],
          },
        ]}
      />

      {/* Outer Precision Chrono-Track */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.gearContainer,
          {
            transform: [{ rotate: gearSpin }],
          },
        ]}
      >
        {/* Subtle Outer Track Rim */}
        <View
          style={[
            styles.trackRim,
            {
              borderColor: isHolding ? colors.accent : colors.border,
            },
          ]}
        />

        {/* 24 Precision Micro-Indices with Major Cardinal Markers */}
        {Array.from({ length: TICK_COUNT }).map((_, index) => {
          const angle = (index * 360) / TICK_COUNT;
          const isMajor = index % 6 === 0;
          return (
            <View
              key={index}
              style={[
                styles.tickWrapper,
                {
                  transform: [{ rotate: `${angle}deg` }],
                },
              ]}
            >
              <View
                style={[
                  isMajor ? styles.majorTick : styles.minorTick,
                  {
                    backgroundColor: isHolding
                      ? colors.accent
                      : isMajor
                      ? colors.textSecondary
                      : colors.border,
                  },
                ]}
              />
            </View>
          );
        })}
      </Animated.View>

      {/* Counter-Rotating Planetary Orbital Constellation */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.innerRingContainer,
          {
            transform: [{ rotate: innerSpin }],
          },
        ]}
      >
        {Array.from({ length: 6 }).map((_, index) => {
          const angle = (index * 360) / 6;
          return (
            <View
              key={index}
              style={[
                styles.orbitalDotWrapper,
                {
                  transform: [{ rotate: `${angle}deg` }],
                },
              ]}
            >
              <View
                style={[
                  styles.orbitalDot,
                  {
                    backgroundColor: isHolding ? colors.accentLight : colors.border,
                  },
                ]}
              />
            </View>
          );
        })}
      </Animated.View>

      {/* Core Tactile Instrument Monolith */}
      <Animated.View style={{ transform: [{ scale: coreScale }] }}>
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          accessibilityLabel="Kinetic fidget gear. Hold down to spin faster and ground energy."
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.core,
            {
              backgroundColor: pressed || isHolding ? colors.accent : colors.surface,
              borderColor: isHolding ? colors.accentLight : colors.border,
            },
          ]}
        >
          {/* Subtle Inner Accent Star */}
          <Text
            style={[
              styles.starIcon,
              {
                color: isHolding ? colors.background : colors.accent,
                transform: [{ scale: isHolding ? 1.15 : 1 }],
              },
            ]}
          >
            ✦
          </Text>
          <Text
            style={[
              styles.coreLabel,
              { color: isHolding ? colors.background : colors.textPrimary },
            ]}
          >
            {isHolding ? 'RELEASING' : 'HOLD'}
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: GEAR_SIZE + 40,
    height: GEAR_SIZE + 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ambientGlow: {
    position: 'absolute',
    width: GEAR_SIZE + 30,
    height: GEAR_SIZE + 30,
    borderRadius: (GEAR_SIZE + 30) / 2,
    borderWidth: 1,
  },
  gearContainer: {
    position: 'absolute',
    width: GEAR_SIZE,
    height: GEAR_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackRim: {
    position: 'absolute',
    width: GEAR_SIZE - 16,
    height: GEAR_SIZE - 16,
    borderRadius: (GEAR_SIZE - 16) / 2,
    borderWidth: 1,
  },
  tickWrapper: {
    position: 'absolute',
    width: GEAR_SIZE,
    height: GEAR_SIZE,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  minorTick: {
    width: 2,
    height: 6,
    borderRadius: 1,
  },
  majorTick: {
    width: 3.5,
    height: 10,
    borderRadius: 1.5,
  },
  innerRingContainer: {
    position: 'absolute',
    width: CORE_SIZE + 36,
    height: CORE_SIZE + 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbitalDotWrapper: {
    position: 'absolute',
    width: CORE_SIZE + 36,
    height: CORE_SIZE + 36,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  orbitalDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  core: {
    width: CORE_SIZE,
    height: CORE_SIZE,
    borderRadius: CORE_SIZE / 2,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 4,
  },
  starIcon: {
    fontSize: 20,
    fontWeight: fontWeight.bold,
  },
  coreLabel: {
    fontSize: fontSize.tiny,
    fontWeight: fontWeight.bold,
    letterSpacing: letterSpacing.widest,
    textTransform: 'uppercase',
  },
});
