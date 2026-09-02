import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  Animated,
  AppState,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import Svg, {
  Circle,
  Line,
  Path,
  Polygon,
  Defs,
  RadialGradient,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import { lightColors, darkColors } from '../theme/colors';
import { fontSize, fontWeight, letterSpacing } from '../theme/typography';
import { useHaptics } from '../hooks/useHaptics';

type Props = {
  reduceMotion?: boolean;
};

const VIEW_SIZE = 310;
const CENTER = VIEW_SIZE / 2;
const OUTER_BEZEL_RADIUS = 138;
const GEAR_TRACK_RADIUS = 120;
const SATELLITE_ORBIT_RADIUS = 82;
const SATELLITE_RADIUS = 18;
const CORE_RADIUS = 48;

/**
 * Luminous Chrono-Horology Kinetic Instrument
 *
 * - Steady, minimal core button with steady 'HOLD' typography (no flipping text, no AI stars)
 * - Rhythmic dual-pulse mechanical escapement haptics (harmonic tick-tock cadence)
 * - Precision Guilloché outer dial with 48 laser indices & cardinal jewels
 * - 3 counter-rotating planetary pinion gears
 * - Deep ambient radial aura glow
 */
export function FidgetTrigger({ reduceMotion = false }: Props) {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;
  const isDark = scheme === 'dark';
  const haptics = useHaptics();

  const [isHolding, setIsHolding] = useState(false);

  // Animated values
  const mainRotationAnim = useRef(new Animated.Value(0)).current;
  const counterRotationAnim = useRef(new Animated.Value(0)).current;
  const satelliteSelfSpinAnim = useRef(new Animated.Value(0)).current;
  const coreScaleAnim = useRef(new Animated.Value(1)).current;
  const chargeGlowAnim = useRef(new Animated.Value(0)).current;

  // Physics & Rhythmic Haptics State
  const angleRef = useRef(0);
  const velocityRef = useRef(0);
  const isHoldingRef = useRef(false);
  const animFrameIdRef = useRef<number | null>(null);
  const lastHapticTimeRef = useRef(0);
  const hapticStepRef = useRef(0); // 0 = tick (light), 1 = tock (medium)

  // Physics animation loop + Rhythmic escapement haptics
  useEffect(() => {
    let lastTime = Date.now();

    const loop = () => {
      const now = Date.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      if (isHoldingRef.current) {
        // Progressive acceleration up to high RPM
        velocityRef.current = Math.min(velocityRef.current + dt * 20, 32);
      } else {
        // Natural friction coast-down
        velocityRef.current = Math.max(velocityRef.current - dt * 10, 0);
      }

      if (velocityRef.current > 0.03) {
        angleRef.current = (angleRef.current + velocityRef.current * dt * 145) % 360;
        mainRotationAnim.setValue(angleRef.current);
        counterRotationAnim.setValue(-angleRef.current * 0.7);
        satelliteSelfSpinAnim.setValue(-angleRef.current * 3);

        // Harmonic Escapement Cadence (Rhythmic Tick-Tock pairs)
        // Interval shortens gracefully with velocity
        const baseInterval = Math.max(50, 360 - velocityRef.current * 10);
        // Add subtle rhythmic spacing between tick and tock
        const stepInterval = hapticStepRef.current === 0 ? baseInterval * 0.85 : baseInterval * 1.15;

        if (now - lastHapticTimeRef.current >= stepInterval) {
          lastHapticTimeRef.current = now;
          if (hapticStepRef.current === 0) {
            haptics.light(); // Tick
            hapticStepRef.current = 1;
          } else {
            if (velocityRef.current > 14) {
              haptics.medium(); // Resonant Tock
            } else {
              haptics.light();
            }
            hapticStepRef.current = 0;
          }
        }
      }

      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    animFrameIdRef.current = requestAnimationFrame(loop);

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState !== 'active') {
        isHoldingRef.current = false;
        setIsHolding(false);
        velocityRef.current = 0;
      }
    });

    return () => {
      subscription.remove();
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [mainRotationAnim, counterRotationAnim, satelliteSelfSpinAnim, haptics]);

  const handlePressIn = useCallback(() => {
    isHoldingRef.current = true;
    setIsHolding(true);
    haptics.medium();

    if (velocityRef.current < 4) {
      velocityRef.current = 7; // Initial impulse kick
    }

    if (!reduceMotion) {
      Animated.parallel([
        Animated.spring(coreScaleAnim, {
          toValue: 0.94,
          speed: 60,
          bounciness: 4,
          useNativeDriver: true,
        }),
        Animated.timing(chargeGlowAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [coreScaleAnim, chargeGlowAnim, haptics, reduceMotion]);

  const handlePressOut = useCallback(() => {
    isHoldingRef.current = false;
    setIsHolding(false);

    if (!reduceMotion) {
      Animated.parallel([
        Animated.spring(coreScaleAnim, {
          toValue: 1,
          speed: 25,
          bounciness: 8,
          useNativeDriver: true,
        }),
        Animated.timing(chargeGlowAnim, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [coreScaleAnim, chargeGlowAnim, reduceMotion]);

  const mainSpin = mainRotationAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  const counterSpin = counterRotationAnim.interpolate({
    inputRange: [-360, 0, 360],
    outputRange: ['-360deg', '0deg', '360deg'],
  });

  const satelliteSpin = satelliteSelfSpinAnim.interpolate({
    inputRange: [-360, 0, 360],
    outputRange: ['-360deg', '0deg', '360deg'],
  });

  // Luminous Palette
  const accent = colors.accent;
  const accentGlow = isDark ? '#E89872' : '#B85E38';
  const trackBorder = isDark ? 'rgba(245, 240, 232, 0.18)' : 'rgba(26, 24, 20, 0.16)';
  const tickSubtle = isDark ? 'rgba(245, 240, 232, 0.28)' : 'rgba(26, 24, 20, 0.22)';
  const tickBright = isDark ? 'rgba(245, 240, 232, 0.85)' : 'rgba(26, 24, 20, 0.8)';
  const gearFill = isDark ? '#221F1B' : '#ECE5DA';

  return (
    <View style={styles.container}>
      {/* 1. Deep Ambient Radial Aura Layer */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.absoluteLayer,
          {
            opacity: chargeGlowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [isDark ? 0.35 : 0.2, 0.95],
            }),
            transform: [
              {
                scale: chargeGlowAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.95, 1.12],
                }),
              },
            ],
          },
        ]}
      >
        <Svg width={VIEW_SIZE} height={VIEW_SIZE} viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}>
          <Defs>
            <RadialGradient id="ambientAura" cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0%" stopColor={accentGlow} stopOpacity={isHolding ? '0.45' : '0.2'} />
              <Stop offset="55%" stopColor={accent} stopOpacity={isHolding ? '0.2' : '0.06'} />
              <Stop offset="100%" stopColor={accent} stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Circle cx={CENTER} cy={CENTER} r={OUTER_BEZEL_RADIUS + 16} fill="url(#ambientAura)" />
        </Svg>
      </Animated.View>

      {/* 2. Static Outer Foundation Ring */}
      <View pointerEvents="none" style={styles.absoluteLayer}>
        <Svg width={VIEW_SIZE} height={VIEW_SIZE} viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}>
          <Circle
            cx={CENTER}
            cy={CENTER}
            r={OUTER_BEZEL_RADIUS}
            stroke={trackBorder}
            strokeWidth={1.5}
            fill="none"
          />
          <Circle
            cx={CENTER}
            cy={CENTER}
            r={SATELLITE_ORBIT_RADIUS}
            stroke={trackBorder}
            strokeWidth={1}
            strokeDasharray="4 8"
            fill="none"
            opacity={0.6}
          />
        </Svg>
      </View>

      {/* 3. Main Rotating Chronograph Bezel & Guilloché Indices */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.absoluteLayer,
          {
            transform: [{ rotate: mainSpin }],
          },
        ]}
      >
        <Svg width={VIEW_SIZE} height={VIEW_SIZE} viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}>
          <Defs>
            <LinearGradient id="accentBeam" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={accentGlow} />
              <Stop offset="100%" stopColor={accent} />
            </LinearGradient>
          </Defs>

          {/* Solid Gear Track Rim */}
          <Circle
            cx={CENTER}
            cy={CENTER}
            r={GEAR_TRACK_RADIUS}
            stroke={isHolding ? 'url(#accentBeam)' : trackBorder}
            strokeWidth={isHolding ? 2 : 1.5}
            fill="none"
          />
          <Circle
            cx={CENTER}
            cy={CENTER}
            r={GEAR_TRACK_RADIUS - 10}
            stroke={trackBorder}
            strokeWidth={1}
            strokeDasharray="2 4"
            fill="none"
          />

          {/* 48 Laser Precision Dial Indices */}
          {Array.from({ length: 48 }).map((_, i) => {
            const angle = (i * 360) / 48;
            const rad = (angle * Math.PI) / 180;
            const isCardinal = i % 12 === 0;
            const isMajor = i % 4 === 0;
            const len = isCardinal ? 14 : isMajor ? 9 : 5;
            const r1 = GEAR_TRACK_RADIUS;
            const r2 = GEAR_TRACK_RADIUS - len;

            const x1 = CENTER + r1 * Math.cos(rad);
            const y1 = CENTER + r1 * Math.sin(rad);
            const x2 = CENTER + r2 * Math.cos(rad);
            const y2 = CENTER + r2 * Math.sin(rad);

            let strokeColor = tickSubtle;
            if (isCardinal) strokeColor = isHolding ? accentGlow : tickBright;
            else if (isMajor) strokeColor = isHolding ? accent : tickBright;

            return (
              <Line
                key={`idx-${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={strokeColor}
                strokeWidth={isCardinal ? 2.5 : isMajor ? 1.75 : 1}
                strokeLinecap="round"
              />
            );
          })}

          {/* 4 Cardinal Diamond Jewels at 0°, 90°, 180°, 270° */}
          {[0, 90, 180, 270].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const dDist = GEAR_TRACK_RADIUS - 20;
            const cx = CENTER + dDist * Math.cos(rad);
            const cy = CENTER + dDist * Math.sin(rad);
            const s = 4.5;
            const points = `${cx},${cy - s} ${cx + s},${cy} ${cx},${cy + s} ${cx - s},${cy}`;

            return (
              <Polygon
                key={`diamond-${i}`}
                points={points}
                fill={isHolding ? accentGlow : tickBright}
              />
            );
          })}

          {/* Kinetic Energy Flairs around perimeter */}
          {Array.from({ length: 3 }).map((_, i) => {
            const startAngle = i * 120 + 20;
            const endAngle = startAngle + 75;
            const rad1 = (startAngle * Math.PI) / 180;
            const rad2 = (endAngle * Math.PI) / 180;
            const r = OUTER_BEZEL_RADIUS - 2;
            const x1 = CENTER + r * Math.cos(rad1);
            const y1 = CENTER + r * Math.sin(rad1);
            const x2 = CENTER + r * Math.cos(rad2);
            const y2 = CENTER + r * Math.sin(rad2);

            return (
              <Path
                key={`flare-${i}`}
                d={`M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`}
                stroke={isHolding ? 'url(#accentBeam)' : accent}
                strokeWidth={isHolding ? 2.5 : 1.5}
                strokeLinecap="round"
                fill="none"
                opacity={isHolding ? 1 : 0.5}
              />
            );
          })}
        </Svg>
      </Animated.View>

      {/* 4. Counter-Rotating Inner Astrolabe Dash Ring */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.absoluteLayer,
          {
            transform: [{ rotate: counterSpin }],
          },
        ]}
      >
        <Svg width={VIEW_SIZE} height={VIEW_SIZE} viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}>
          <Circle
            cx={CENTER}
            cy={CENTER}
            r={CORE_RADIUS + 14}
            stroke={isHolding ? accent : trackBorder}
            strokeWidth={1}
            strokeDasharray="6 10"
            fill="none"
          />
        </Svg>
      </Animated.View>

      {/* 5. 3 Planetary Epicyclic Pinion Gears (Orbiting & Counter-Spinning) */}
      {Array.from({ length: 3 }).map((_, satIdx) => {
        const orbitAngleOffset = (satIdx * 360) / 3;
        const orbitSpin = mainRotationAnim.interpolate({
          inputRange: [0, 360],
          outputRange: [`${orbitAngleOffset}deg`, `${orbitAngleOffset + 360}deg`],
        });

        return (
          <Animated.View
            key={`satellite-${satIdx}`}
            pointerEvents="none"
            style={[
              styles.satelliteOrbitArm,
              {
                transform: [{ rotate: orbitSpin }],
              },
            ]}
          >
            <View style={styles.satelliteNode}>
              <Animated.View style={{ transform: [{ rotate: satelliteSpin }] }}>
                <Svg width={46} height={46} viewBox="0 0 46 46">
                  {/* Pinion Body */}
                  <Circle
                    cx={23}
                    cy={23}
                    r={SATELLITE_RADIUS}
                    stroke={isHolding ? accentGlow : trackBorder}
                    strokeWidth={1.5}
                    fill={gearFill}
                  />
                  {/* 8 Precision Pinion Teeth */}
                  {Array.from({ length: 8 }).map((_, toothIdx) => {
                    const toothRad = ((toothIdx * 45) * Math.PI) / 180;
                    const x1 = 23 + 12 * Math.cos(toothRad);
                    const y1 = 23 + 12 * Math.sin(toothRad);
                    const x2 = 23 + 20 * Math.cos(toothRad);
                    const y2 = 23 + 20 * Math.sin(toothRad);

                    return (
                      <Line
                        key={`tooth-${toothIdx}`}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke={isHolding ? accentGlow : tickBright}
                        strokeWidth={2}
                        strokeLinecap="round"
                      />
                    );
                  })}
                  {/* Pinion Hub Jewel */}
                  <Circle
                    cx={23}
                    cy={23}
                    r={4}
                    fill={isHolding ? accentGlow : accent}
                  />
                </Svg>
              </Animated.View>
            </View>
          </Animated.View>
        );
      })}

      {/* 6. Central Tactile Monolith Core Button (Steady Typography, No Star, No Text Flickering) */}
      <Animated.View style={{ transform: [{ scale: coreScaleAnim }] }}>
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          accessibilityLabel="Kinetic chrono instrument. Hold to spin and ground energy."
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.coreButton,
            {
              backgroundColor: pressed || isHolding ? accent : colors.surface,
              borderColor: isHolding ? accentGlow : isDark ? 'rgba(245,240,232,0.22)' : 'rgba(26,24,20,0.14)',
            },
          ]}
        >
          {/* Concentric Precision Inner Bezel */}
          <View
            style={[
              styles.coreInnerBezel,
              {
                borderColor: isHolding
                  ? 'rgba(255,255,255,0.45)'
                  : isDark
                  ? 'rgba(245,240,232,0.12)'
                  : 'rgba(26,24,20,0.08)',
              },
            ]}
          />

          {/* Minimal Precision Hub Center Indicator */}
          <View
            style={[
              styles.hubPip,
              {
                backgroundColor: isHolding ? colors.background : accent,
              },
            ]}
          />

          {/* Steady, Confident Typography (Never Flips or Changes) */}
          <Text
            style={[
              styles.coreActionText,
              { color: isHolding ? colors.background : colors.textPrimary },
            ]}
          >
            HOLD
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: VIEW_SIZE,
    height: VIEW_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  absoluteLayer: {
    position: 'absolute',
    width: VIEW_SIZE,
    height: VIEW_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  satelliteOrbitArm: {
    position: 'absolute',
    width: VIEW_SIZE,
    height: VIEW_SIZE,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  satelliteNode: {
    position: 'absolute',
    top: CENTER - SATELLITE_ORBIT_RADIUS - 23,
    left: CENTER - 23,
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coreButton: {
    width: CORE_RADIUS * 2,
    height: CORE_RADIUS * 2,
    borderRadius: CORE_RADIUS,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 8,
  },
  coreInnerBezel: {
    position: 'absolute',
    width: CORE_RADIUS * 2 - 12,
    height: CORE_RADIUS * 2 - 12,
    borderRadius: CORE_RADIUS - 6,
    borderWidth: 1,
  },
  hubPip: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  coreActionText: {
    fontSize: fontSize.bodySmall,
    fontWeight: fontWeight.bold,
    letterSpacing: letterSpacing.widest,
    textTransform: 'uppercase',
  },
});
