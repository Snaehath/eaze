import React from 'react';
import { StyleSheet, View, useColorScheme } from 'react-native';
import { BasePressable } from '../ui/BasePressable';
import { BaseText } from '../ui/BaseText';
import { darkColors, lightColors } from '../../theme/colors';
import { radii } from '../../theme/radii';
import { spacing } from '../../theme/spacing';

export type EazeBadgeProps = {
  count: number;
  onPress?: () => void;
  accessibilityLabel?: string;
};

/**
 * EazeBadge — Quiet, respectful session counter pill.
 */
export function EazeBadge({ count, onPress, accessibilityLabel }: EazeBadgeProps) {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;

  const content = (
    <View style={[styles.badge, { backgroundColor: colors.accentFaint }]}>
      <BaseText
        variant="micro"
        color={colors.accent}
        weight="bold"
        allowFontScaling={false}
      >
        {count}
      </BaseText>
    </View>
  );

  if (onPress) {
    return (
      <BasePressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? `History — ${count} sessions`}
      >
        {content}
      </BasePressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radii.pill,
    minWidth: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
