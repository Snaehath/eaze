import React, { useEffect, useCallback, useState } from 'react';
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
import { useSafeTimeout } from '../utils/timing';
import { useHaptics } from '../hooks/useHaptics';
import { useSession } from '../hooks/useSession';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList, 'QuickReset'>;

export function QuickResetScreen() {
  const navigation = useNavigation<Nav>();
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;
  const reduceMotion = useReducedMotion();
  const { set: safeTimeout } = useSafeTimeout();
  const haptics = useHaptics();
  const { recordSession } = useSession();

  type QPhase = 'trigger' | 'breathing' | 'done';
  const [phase, setPhase] = useState<QPhase>('trigger');

  const handleBreathingComplete = useCallback(() => {
    setPhase('done');
    haptics.success();
  }, [haptics]);

  const { phase: breathPhase, animatedValue, timeRemaining, start: startBreathing } =
    useBreathing({
      inhaleDuration: 4000,
      exhaleDuration: 6000,
      totalDuration: 20000,
      onComplete: handleBreathingComplete,
      reduceMotion,
    });

  useEffect(() => {
    safeTimeout(() => {
      setPhase('breathing');
      setTimeout(() => startBreathing(), 300);
    }, 10000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGo = useCallback(() => {
    haptics.success();
    recordSession().catch(() => {});
    setTimeout(() => navigation.navigate('Home'), 300);
  }, [haptics, recordSession, navigation]);

  const handleSkip = useCallback(() => {
    navigation.navigate('Home');
  }, [navigation]);

  const secs = timeRemaining % 60;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.topBar}>
          <Text style={[styles.wordmark, { color: colors.accent }]}>30 SEC RESET</Text>
          <SecondaryButton
            label="Cancel"
            onPress={handleSkip}
            testID="btn-quick-cancel"
          />
        </View>

        {phase === 'trigger' && (
          <>
            <View style={styles.centerArea}>
              <FidgetTrigger reduceMotion={reduceMotion} />
            </View>
            <View style={styles.bottomArea}>
              <Text style={[styles.hintText, { color: colors.textSecondary }]}>
                Discharge the restless energy.{'\n'}Breathing begins in a moment.
              </Text>
            </View>
          </>
        )}

        {phase === 'breathing' && (
          <>
            <View style={styles.centerArea}>
              <BreathingCircle
                phase={breathPhase}
                animatedValue={animatedValue}
                reduceMotion={reduceMotion}
              />
            </View>
            <View style={styles.bottomArea}>
              <Text style={[styles.timerText, { color: colors.textTertiary }]}>
                {secs}s remaining
              </Text>
            </View>
          </>
        )}

        {phase === 'done' && (
          <>
            <View style={styles.doneArea}>
              <Text style={[styles.doneHeading, { color: colors.textPrimary }]}>
                YOU'RE{'\n'}READY.
              </Text>
              <Text style={[styles.doneSub, { color: colors.textSecondary }]}>
                Take a breath and walk in.
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
  },
  wordmark: {
    fontSize: fontSize.label,
    fontWeight: fontWeight.bold,
    letterSpacing: letterSpacing.widest,
  },
  centerArea: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomArea: {
    paddingBottom: spacing.sm,
  },
  hintText: {
    fontSize: fontSize.bodySmall,
    textAlign: 'center',
    lineHeight: fontSize.bodySmall * lineHeight.relaxed,
  },
  timerText: {
    fontSize: fontSize.label,
    fontWeight: fontWeight.medium,
    letterSpacing: letterSpacing.wide,
    textAlign: 'center',
  },
  doneArea: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
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
  },
});
