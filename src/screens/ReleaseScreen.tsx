import React, { useCallback } from 'react';
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
import { FidgetTrigger } from '../components/FidgetTrigger';
import { useHaptics } from '../hooks/useHaptics';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useSession } from '../hooks/useSession';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Release'>;

export function ReleaseScreen() {
  const navigation = useNavigation<Nav>();
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;
  const haptics = useHaptics();
  const reduceMotion = useReducedMotion();
  const { recordSession } = useSession();

  const handleGo = useCallback(() => {
    haptics.success();
    recordSession().catch(() => {});
    setTimeout(() => {
      navigation.navigate('Home');
    }, 250);
  }, [haptics, recordSession, navigation]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        {/* Top bar with back / close */}
        <View style={styles.topBar}>
          <Text style={[styles.wordmark, { color: colors.accent }]}>eaze</Text>
          <SecondaryButton
            label="Close"
            onPress={() => navigation.navigate('Home')}
            testID="btn-release-close"
          />
        </View>

        {/* Clean, calm header */}
        <View style={styles.header}>
          <Text
            style={[styles.heading, { color: colors.textPrimary }]}
            accessibilityRole="header"
          >
            One step{'\n'}at a time.
          </Text>
        </View>

        {/* Center: Tactile Kinetic Gear */}
        <View style={styles.centerArea}>
          <FidgetTrigger reduceMotion={reduceMotion} />
        </View>

        {/* Primary Action Button */}
        <View style={styles.ctaBlock}>
          <PrimaryButton
            label="GO"
            onPress={handleGo}
            testID="btn-release-go"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
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
  header: {
    paddingTop: spacing.sm,
  },
  heading: {
    fontSize: fontSize.hero,
    fontWeight: fontWeight.black,
    letterSpacing: letterSpacing.tight,
    lineHeight: fontSize.hero * lineHeight.tight,
  },
  centerArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaBlock: {
    paddingTop: spacing.xs,
  },
});
