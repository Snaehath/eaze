import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { darkColors, lightColors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { motionDurations, motionSprings } from '../theme/motion';
import { EazeContainer } from '../components/eaze/EazeContainer';
import { EazeText } from '../components/eaze/EazeText';
import { EazeButton } from '../components/eaze/EazeButton';
import { EazeBadge } from '../components/eaze/EazeBadge';
import { useReducedMotion } from '../hooks/useReducedMotion';
import {
  getSessionsCompleted,
  getLastSessionDate,
  formatLastSessionDate,
} from '../utils/storage';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Home'>;

/**
 * HomeScreen — eaze landing screen
 *
 * Target Hierarchy:
 * - Wordmark "eaze" + Quiet Session Badge
 * - Feeling nervous? / Let's get you steady.
 * - [ I'M NERVOUS ] (Primary 60px tactile CTA)
 * - [ 30 SEC RESET ]  [ WHAT IS THIS? ] (Secondary action row)
 * - Last reset indicator (quiet footer)
 */
export function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;
  const reduceMotion = useReducedMotion();

  const [sessions, setSessions] = useState<number | null>(null);
  const [lastDate, setLastDate] = useState<string | null>(null);

  const fadeIn = useRef(new Animated.Value(reduceMotion ? 1 : 0)).current;
  const slideUp = useRef(new Animated.Value(reduceMotion ? 0 : 24)).current;

  useEffect(() => {
    // Load local storage session counters
    Promise.all([getSessionsCompleted(), getLastSessionDate()]).then(
      ([count, date]) => {
        setSessions(count);
        setLastDate(date);
      },
    );

    // Entry animation (respects reduced motion)
    if (!reduceMotion) {
      Animated.parallel([
        Animated.timing(fadeIn, {
          toValue: 1,
          duration: motionDurations.deliberate,
          useNativeDriver: true,
        }),
        Animated.spring(slideUp, {
          toValue: 0,
          useNativeDriver: true,
          speed: motionSprings.appear.speed,
          bounciness: motionSprings.appear.bounciness,
        }),
      ]).start();
    }
  }, [fadeIn, slideUp, reduceMotion]);

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
    <EazeContainer>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Top Bar: Wordmark + Session Count Badge */}
        <View style={styles.topBar}>
          <EazeText
            variant="label"
            color={colors.accent}
            weight="black"
            allowFontScaling={false}
          >
            eaze
          </EazeText>

          {sessions !== null && sessions > 0 && (
            <EazeBadge count={sessions} onPress={handleHistory} />
          )}
        </View>

        <Animated.View
          style={[
            styles.content,
            { opacity: fadeIn, transform: [{ translateY: slideUp }] },
          ]}
        >
          {/* Header Block: Problem Formulation */}
          <View style={styles.headingBlock}>
            <EazeText
              variant="display"
              color={colors.textPrimary}
              accessibilityRole="header"
            >
              Feeling{'\n'}nervous?
            </EazeText>
            <EazeText variant="body" color={colors.textSecondary}>
              Let's get you steady.
            </EazeText>
          </View>

          {/* Primary CTA: 1-Tap Instant Grounding */}
          <View style={styles.primaryCtaBlock}>
            <EazeButton
              label="I'M NERVOUS"
              variant="primary"
              onPress={handleNervous}
              accessibilityLabel="I'm nervous. Start instant sensory reset."
              testID="btn-nervous"
            />
          </View>

          {/* Secondary Actions: 30s Reset & Concept Explainer */}
          <View style={styles.secondaryRow}>
            <EazeButton
              label="30 SEC RESET"
              variant="secondary"
              onPress={handleQuickReset}
              accessibilityLabel="30 second guided reset"
              testID="btn-quick-reset"
            />
            <EazeButton
              label="WHAT IS THIS?"
              variant="ghost"
              onPress={handleAbout}
              accessibilityLabel="What is this? Learn about eaze"
              testID="btn-about"
            />
          </View>

          {/* Subtle Last Reset Footer */}
          {lastDate && (
            <View style={styles.footer}>
              <EazeText
                variant="micro"
                color={colors.textTertiary}
                align="center"
              >
                LAST RESET: {formatLastSessionDate(lastDate).toUpperCase()}
              </EazeText>
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </EazeContainer>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 40,
    marginBottom: spacing.xxxl,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  headingBlock: {
    marginBottom: spacing.xxxl,
    gap: spacing.sm,
  },
  primaryCtaBlock: {
    marginBottom: spacing.md,
  },
  secondaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  footer: {
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
    alignItems: 'center',
  },
});
