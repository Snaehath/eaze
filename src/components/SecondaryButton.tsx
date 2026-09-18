import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  AccessibilityRole,
} from 'react-native';
import { lightColors, darkColors } from '../theme/colors';
import { fontSize, fontWeight, letterSpacing } from '../theme/typography';
import { spacing, buttonHeight, hitSlop } from '../theme/spacing';
import { radius } from '../theme/radii';


type Props = {
  label: string;
  onPress: () => void;
  bordered?: boolean;
  accessibilityLabel?: string;
  testID?: string;
};

/**
 * Visually recessive secondary button.
 * Used for SKIP and other non-primary actions.
 */
export function SecondaryButton({
  label,
  onPress,
  bordered = false,
  accessibilityLabel,
  testID,
}: Props) {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole={'button' as AccessibilityRole}
      accessibilityLabel={accessibilityLabel ?? label}
      hitSlop={hitSlop}
      testID={testID}
      style={({ pressed }) => [
        styles.button,
        bordered && {
          borderWidth: 1,
          borderColor: colors.buttonSecondaryBorder,
          borderRadius: radius.pill,
          height: buttonHeight.secondary,
          paddingHorizontal: spacing.lg,
        },
        pressed && styles.pressed,
      ]}
    >
      <Text
        style={[styles.label, { color: colors.textSecondary }]}
        numberOfLines={1}
        allowFontScaling
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  label: {
    fontSize: fontSize.bodySmall,
    fontWeight: fontWeight.medium,
    letterSpacing: letterSpacing.wide,
    textTransform: 'uppercase',
  },
  pressed: {
    opacity: 0.5,
  },
});
