import React from 'react';
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
import { PrimaryButton } from '../components/PrimaryButton';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList, 'About'>;

export function AboutScreen() {
  const navigation = useNavigation<Nav>();
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={[styles.wordmark, { color: colors.accent }]}>eaze</Text>

        <View style={styles.body}>
          <Text style={[styles.heading, { color: colors.textPrimary }]}>
            What is this?
          </Text>

          <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
            eaze is a short sensory reset for the 2 minutes before something important.
          </Text>

          <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
            It combines tactile haptic grounding, slow rhythmic breathing, and simple cognitive reframing to help you feel settled before you begin.
          </Text>

          <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
            The idea is simple: don't fight the nervous energy. Give it somewhere to go.
          </Text>

          <View style={[styles.divider, { borderColor: colors.border }]} />

          <Text style={[styles.disclaimer, { color: colors.textTertiary }]}>
            eaze is a self-guided tool for moments of everyday nervousness before important events. It isn't a medical treatment or a substitute for professional care.
          </Text>
        </View>

        <View style={styles.closeBlock}>
          <PrimaryButton
            label="CLOSE"
            onPress={() => navigation.goBack()}
            testID="btn-about-close"
          />
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
  },
  wordmark: {
    fontSize: fontSize.label,
    fontWeight: fontWeight.bold,
    letterSpacing: letterSpacing.widest,
    marginBottom: spacing.xxxl,
  },
  body: {
    flex: 1,
    gap: spacing.lg,
  },
  heading: {
    fontSize: fontSize.heading,
    fontWeight: fontWeight.black,
    letterSpacing: letterSpacing.tight,
    marginBottom: spacing.sm,
  },
  paragraph: {
    fontSize: fontSize.body,
    lineHeight: fontSize.body * lineHeight.relaxed,
  },
  divider: {
    borderTopWidth: 1,
    marginVertical: spacing.md,
  },
  disclaimer: {
    fontSize: fontSize.bodySmall,
    lineHeight: fontSize.bodySmall * lineHeight.relaxed,
  },
  closeBlock: {
    marginTop: spacing.xxl,
  },
});
