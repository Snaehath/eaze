import React, { useEffect, useCallback, useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { lightColors, darkColors } from '../theme/colors';
import { fontSize, fontWeight, letterSpacing, lineHeight } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { BreathingCircle } from '../components/BreathingCircle';
import { FidgetTrigger } from '../components/FidgetTrigger';
import { useBreathing } from '../hooks/useBreathing';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useSafeTimeout, useSafeInterval } from '../utils/timing';
import { useHaptics } from '../hooks/useHaptics';
import { useSession } from '../hooks/useSession';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList, 'QuickReset'>;

type QPhase = 'trigger' | 'breathing' | 'done';

/**
 * 30-Second Reset — Zero-friction emergency ritual
 *
 * Contract:
 * 1. 10s Tactile Release (Kinetic Gear)
 * 2. 20s Paced Breathing (4s Inhale / 6s Exhale)
 * 3. DONE: "YOU'RE READY." -> GO (Single satisfying haptic pop)
 *
 * Fully automatic progression. No manual intermediate screens.
 */
export function QuickResetScreen() {
  const navigation = useNavigation<Nav>();
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;
  const reduceMotion = useReducedMotion();
  const { set: safeTimeout } = useSafeTimeout();
  const { set: safeInterval } = useSafeInterval();
  const haptics = useHaptics();
  const { recordSession } = useSession();

  const [phase, setPhase] = useState<QPhase>('trigger');
  const [triggerSecsRemaining, setTriggerSecsRemaining] = useState(10);
  const isMountedRef = useRef(true);

  const handleBreathingComplete = useCallback(() => {
    if (!isMountedRef.current) return;
    setPhase('done');
    haptics.success();
  }, [haptics]);

  const { phase: breathPhase, animatedValue, timeRemaining, start: startBreathing, stop: stopBreathing } =
    useBreathing({
      inhaleDuration: 4000,
      exhaleDuration: 6000,
      totalDuration: 20000,
      onComplete: handleBreathingComplete,
      reduceMotion,
    });

  // Phase 1: 10s Trigger Timer
  useEffect(() => {
    isMountedRef.current = true;

    // Countdown interval for the 10s trigger phase
    safeInterval(() => {
      setTriggerSecsRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);

    // Auto-advance to breathing after exactly 10 seconds
    safeTimeout(() => {
      if (!isMountedRef.current) return;
      setPhase('breathing');
      haptics.light();
      setTimeout(() => {
        if (isMountedRef.current) {
          startBreathing();
        }
      }, 200);
    }, 10000);

    return () => {
      isMountedRef.current = false;
      stopBreathing();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGo = useCallback(() => {
    haptics.success();
    recordSession().catch(() => {});
    setTimeout(() => {
      navigation.navigate('Home');
    }, 250);
  }, [haptics, recordSession, navigation]);

  const handleCancel = useCallback(() => {
    stopBreathing();
    navigation.navigate('Home');
  }, [stopBreathing, navigation]);

  const breathSecs = timeRemaining % 60;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <Text style={[styles.wordmark, { color: colors.accent }]}>30 SEC RESET</Text>
          {phase !== 'done' && (
            <SecondaryButton
              label="Cancel"
              onPress={handleCancel}
              testID="btn-quick-cancel"
            />
          )}
        </View>

        {/* Phase 1: 10s Tactile Discharge */}
        {phase === 'trigger' && (
          <>
            <View style={styles.headerArea}>
              <Text style={[styles.kicker, { color: colors.accent }]}>DISCHARGE</Text>
              <Text style={[styles.phaseHeading, { color: colors.textPrimary }]}>
                Discharge{'\n'}the energy.
              </Text>
            </View>

            <View style={styles.centerArea}>
              <FidgetTrigger reduceMotion={reduceMotion} />
            </View>

            <View style={styles.bottomArea}>
              <Text style={[styles.timerText, { color: colors.textTertiary }]}>
                Breathing starts in {triggerSecsRemaining}s
              </Text>
            </View>
          </>
        )}

        {/* Phase 2: 20s Paced Breathing */}
        {phase === 'breathing' && (
          <>
            <View style={styles.headerArea}>
              <Text style={[styles.kicker, { color: colors.accent }]}>BREATHE</Text>
              <Text style={[styles.phaseHeading, { color: colors.textPrimary }]}>
                Now become{'\n'}still.
              </Text>
            </View>

            <View style={styles.centerArea}>
              <BreathingCircle
                phase={breathPhase}
                animatedValue={animatedValue}
                reduceMotion={reduceMotion}
              />
            </View>

            <View style={styles.bottomArea}>
              <Text style={[styles.timerText, { color: colors.textTertiary }]}>
                {breathSecs}s remaining
              </Text>
            </View>
          </>
        )}

        {/* Phase 3: Completion Moment */}
        {phase === 'done' && (
          <>
            <View style={styles.doneArea}>
              <Text style={[styles.doneHeading, { color: colors.textPrimary }]}>
                YOU'RE{'\n'}READY.
              </Text>
              <Text style={[styles.doneSub, { color: colors.textSecondary }]}>
                You don't need to feel fearless.{'\n'}You just need to begin.
              </Text>
            </View>

            <View style={styles.bottomArea}>
              <PrimaryButton label="GO" onPress={handleGo} testID="btn-quick-go" />
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 36,
  },
  wordmark: {
    fontSize: fontSize.label,
    fontWeight: fontWeight.bold,
    letterSpacing: letterSpacing.widest,
  },
  headerArea: {
    paddingTop: spacing.xs,
    gap: spacing.xxs,
  },
  kicker: {
    fontSize: fontSize.label,
    fontWeight: fontWeight.bold,
    letterSpacing: letterSpacing.widest,
    textTransform: 'uppercase',
  },
  phaseHeading: {
    fontSize: fontSize.heading,
    fontWeight: fontWeight.black,
    letterSpacing: letterSpacing.tight,
    lineHeight: fontSize.heading * lineHeight.tight,
  },
  centerArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomArea: {
    paddingBottom: spacing.xs,
  },
  timerText: {
    fontSize: fontSize.label,
    fontWeight: fontWeight.medium,
    letterSpacing: letterSpacing.wide,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  doneArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  doneHeading: {
    fontSize: fontSize.hero,
    fontWeight: fontWeight.black,
    letterSpacing: letterSpacing.tight,
    textAlign: 'center',
    lineHeight: fontSize.hero * lineHeight.tight,
  },
  doneSub: {
    fontSize: fontSize.body,
    textAlign: 'center',
    lineHeight: fontSize.body * lineHeight.relaxed,
  },
});
