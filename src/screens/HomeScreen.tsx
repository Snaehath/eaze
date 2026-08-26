import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { lightColors, darkColors } from '../theme/colors';
import { fontSize, fontWeight, letterSpacing, lineHeight } from '../theme/typography';
import { spacing, radius, buttonHeight } from '../theme/spacing';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
import {
  getSessionsCompleted,
  getLastSessionDate,
  formatLastSessionDate,
} from '../utils/storage';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;

  const [sessions, setSessions] = useState<number | null>(null);
  const [lastDate, setLastDate] = useState<string | null>(null);

  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Load stats
    Promise.all([getSessionsCompleted(), getLastSessionDate()]).then(([count, date]) => {
      setSessions(count);
      setLastDate(date);
    });

    // Entry animation
    Animated.parallel([
      Animated.timing(fadeIn, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(slideUp, { toValue: 0, useNativeDriver: true, speed: 12, bounciness: 4 }),
    ]).start();
  }, [fadeIn, slideUp]);

  const handleNervous = useCallback(() => {
    navigation.navigate('Release');
  }, [navigation]);

  const handleQuickReset = useCallback(() => {
    navigation.navigate('QuickReset');
  }, [navigation]);

  const handleAbout = useCallback(() => {
    navigation.navigate('About');
  }, [navigation]);

  const handleHistory = useCallback(() => {
    navigation.navigate('History');
  }, [navigation]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Top bar */}
        <View style={styles.topBar}>
          <Text style={[styles.wordmark, { color: colors.accent }]} allowFontScaling={false}>
            eaze
          </Text>
          {sessions !== null && sessions > 0 && (
            <Pressable
              onPress={handleHistory}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              accessibilityLabel={`History — ${sessions} sessions`}
              accessibilityRole="button"
            >
              <View style={[styles.badge, { backgroundColor: colors.accentFaint }]}>
                <Text style={[styles.badgeText, { color: colors.accent }]}>
                  {sessions}
                </Text>
              </View>
            </Pressable>
          )}
        </View>

        <Animated.View
          style={[
            styles.content,
            { opacity: fadeIn, transform: [{ translateY: slideUp }] },
          ]}
        >
          {/* Heading */}
          <View style={styles.headingBlock}>
            <Text
              style={[styles.heading, { color: colors.textPrimary }]}
              allowFontScaling
              accessibilityRole="header"
            >
              Feeling{'\n'}nervous?
            </Text>
            <Text style={[styles.sub, { color: colors.textSecondary }]} allowFontScaling>
              Let's turn that energy{'\n'}into something useful.
            </Text>
          </View>

          {/* Primary CTA */}
          <View style={styles.ctaBlock}>
            <PrimaryButton
              label="I'M NERVOUS"
              onPress={handleNervous}
              testID="btn-nervous"
            />
          </View>

          {/* Secondary row */}
          <View style={styles.secondaryRow}>
            <Pressable
              onPress={handleQuickReset}
              style={({ pressed }) => [
                styles.quickResetBtn,
                { borderColor: colors.border, opacity: pressed ? 0.6 : 1 },
              ]}
              accessibilityLabel="30 second quick reset"
              accessibilityRole="button"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              testID="btn-quick-reset"
            >
              <Text style={[styles.quickResetText, { color: colors.textSecondary }]}>
                30 SEC RESET
              </Text>
            </Pressable>

            <SecondaryButton
              label="What is this?"
              onPress={handleAbout}
              testID="btn-about"
            />
          </View>

          {/* Last session hint */}
          {lastDate && (
            <Text style={[styles.lastSession, { color: colors.textTertiary }]}>
              Last reset: {formatLastSessionDate(lastDate)}
            </Text>
          )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xxxl,
  },
  wordmark: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.black,
    letterSpacing: letterSpacing.tight,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radius.pill,
    minWidth: 32,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: fontSize.label,
    fontWeight: fontWeight.bold,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  headingBlock: {
    marginBottom: spacing.xxxl,
    gap: spacing.md,
  },
  heading: {
    fontSize: fontSize.hero,
    fontWeight: fontWeight.black,
    letterSpacing: letterSpacing.tight,
    lineHeight: fontSize.hero * lineHeight.tight,
  },
  sub: {
    fontSize: fontSize.body,
    lineHeight: fontSize.body * lineHeight.relaxed,
    fontWeight: fontWeight.regular,
  },
  ctaBlock: {
    marginBottom: spacing.lg,
  },
  secondaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xxl,
  },
  quickResetBtn: {
    borderWidth: 1,
    borderRadius: radius.pill,
    height: buttonHeight.secondary,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickResetText: {
    fontSize: fontSize.bodySmall,
    fontWeight: fontWeight.medium,
    letterSpacing: letterSpacing.wide,
    textTransform: 'uppercase',
  },
  lastSession: {
    fontSize: fontSize.tiny,
    textAlign: 'center',
    letterSpacing: letterSpacing.wide,
    textTransform: 'uppercase',
  },
});
