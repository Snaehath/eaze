import React from 'react';
import { StyleProp, StyleSheet, TextStyle, ViewStyle, useColorScheme } from 'react-native';
import { BasePressable } from '../ui/BasePressable';
import { BaseText } from '../ui/BaseText';
import { darkColors, lightColors } from '../../theme/colors';
import { buttonHeight, minTouchTarget, spacing } from '../../theme/spacing';
import { radii } from '../../theme/radii';
import { useHaptics } from '../../hooks/useHaptics';

export type EazeButtonVariant = 'primary' | 'secondary' | 'ghost';

export type EazeButtonProps = {
  label: string;
  onPress: () => void;
  variant?: EazeButtonVariant;
  disabled?: boolean;
  accessibilityLabel?: string;
  testID?: string;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
};

/**
 * EazeButton — Standardized button primitive supporting:
 * - primary: full-width prominent action button
 * - secondary: pill outlined container
 * - ghost: quiet text-only button
 *
 * Includes built-in spring compression, tactile haptics, and accessible hitSlop.
 */
export function EazeButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  accessibilityLabel,
  testID,
  style,
  labelStyle,
}: EazeButtonProps) {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;
  const haptics = useHaptics();

  const handleHaptic = () => {
    if (variant === 'primary') {
      haptics.medium();
    } else {
      haptics.light();
    }
  };

  // Variant container styling
  const variantContainerStyles: Record<EazeButtonVariant, ViewStyle> = {
    primary: {
      height: buttonHeight.primary,
      backgroundColor: colors.buttonPrimaryBg,
      borderRadius: radii.pill,
      paddingHorizontal: spacing.xl,
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: minTouchTarget,
    },
    secondary: {
      height: buttonHeight.secondary,
      borderWidth: 1,
      borderColor: colors.borderStrong,
      borderRadius: radii.pill,
      paddingHorizontal: spacing.lg,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent',
      minHeight: minTouchTarget,
    },
    ghost: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent',
      minHeight: minTouchTarget,
    },
  };

  // Variant text color
  const textColor: Record<EazeButtonVariant, string> = {
    primary: colors.buttonPrimaryText,
    secondary: colors.textPrimary,
    ghost: colors.textSecondary,
  };

  return (
    <BasePressable
      onPress={onPress}
      disabled={disabled}
      hapticFeedback={handleHaptic}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      testID={testID}
      style={[variantContainerStyles[variant], style]}
    >
      <BaseText
        variant={variant === 'primary' ? 'button' : 'micro'}
        color={disabled ? colors.textTertiary : textColor[variant]}
        weight={variant === 'primary' ? 'semibold' : 'medium'}
        numberOfLines={1}
        style={labelStyle}
      >
        {label}
      </BaseText>
    </BasePressable>
  );
}
