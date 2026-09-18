import React, { useEffect, useState } from 'react';
import {
  ScrollView,
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
import { radius } from '../theme/radii';
import { SecondaryButton } from '../components/SecondaryButton';



import {
  getSessionsCompleted,
  getLastSessionDate,
  formatLastSessionDate,
} from '../utils/storage';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList, 'History'>;

export function HistoryScreen() {
  const navigation = useNavigation<Nav>();
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;

  const [sessions, setSessions] = useState(0);
  const [lastDate, setLastDate] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getSessionsCompleted(), getLastSessionDate()]).then(
      ([count, date]) => {
        setSessions(count);
        setLastDate(date);
      },
    );
  }, []);

  const sessionWord = sessions === 1 ? 'time' : 'times';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.wordmark, { color: colors.accent }]}>eaze</Text>
          <SecondaryButton
            label="Close"
            onPress={() => navigation.goBack()}
            testID="btn-history-close"
          />
        </View>

        {/* Hero stat */}
        <View style={styles.heroStat}>
          <Text style={[styles.heroNumber, { color: colors.textPrimary }]}>{sessions}</Text>
          <Text style={[styles.heroLabel, { color: colors.textSecondary }]}>
            {sessions === 0
              ? 'No resets yet.'
              : `You've shown up ${sessions} ${sessionWord}.`}
          </Text>
        </View>

        {/* Stats row */}
        {sessions > 0 && (
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.statLabel, { color: colors.textTertiary }]}>Last reset</Text>
              <Text style={[styles.statValue, { color: colors.textPrimary }]}>
                {formatLastSessionDate(lastDate)}
              </Text>
            </View>
          </View>
        )}

        {/* About note */}
        <View style={[styles.noteCard, { borderColor: colors.border }]}>
          <Text style={[styles.noteText, { color: colors.textTertiary }]}>
            eaze is a self-guided tool for moments of everyday nervousness before important events.{'\n\n'}It isn't a medical treatment or a substitute for professional care.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
    gap: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  wordmark: {
    fontSize: fontSize.label,
    fontWeight: fontWeight.bold,
    letterSpacing: letterSpacing.widest,
  },
  heroStat: {
    gap: spacing.sm,
  },
  heroNumber: {
    fontSize: 96,
    fontWeight: fontWeight.black,
    lineHeight: 96,
  },
  heroLabel: {
    fontSize: fontSize.subheading,
    lineHeight: fontSize.subheading * lineHeight.relaxed,
    fontWeight: fontWeight.regular,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.xxs,
  },
  statLabel: {
    fontSize: fontSize.tiny,
    fontWeight: fontWeight.medium,
    letterSpacing: letterSpacing.wider,
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
  },
  noteCard: {
    borderTopWidth: 1,
    paddingTop: spacing.lg,
  },
  noteText: {
    fontSize: fontSize.bodySmall,
    lineHeight: fontSize.bodySmall * lineHeight.relaxed,
  },
});
