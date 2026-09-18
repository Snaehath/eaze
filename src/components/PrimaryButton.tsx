import React, { useRef, useCallback } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  AccessibilityRole,
} from 'react-native';
import { lightColors, darkColors } from '../theme/colors';
import { fontSize, fontWeight, letterSpacing } from '../theme/typography';
import { spacing, buttonHeight } from '../theme/spacing';
import { radius } from '../theme/radii';


type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  accessibilityLabel?: string;
  testID?: string;
};

/**
 * Large full-width CTA button.
 * Springs down slightly on press for a tactile feel.
 */
export function PrimaryButton({
  label,
  onPress,
  disabled = false,
  accessibilityLabel,
  testID,
}: Props) {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  }, [scale]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 6,
    }).start();
  }, [scale]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        accessibilityRole={'button' as AccessibilityRole}
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityState={{ disabled }}
        testID={testID}
        style={[
          styles.button,
          {
            backgroundColor: disabled
              ? colors.textTertiary
              : colors.buttonPrimaryBg,
          },
        ]}
      >
        <Text
          style={[
            styles.label,
            {
              color: disabled ? colors.background : colors.buttonPrimaryText,
            },
          ]}
          numberOfLines={1}
          allowFontScaling
        >
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    height: buttonHeight.primary,
    borderRadius: radius.pill,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  label: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    letterSpacing: letterSpacing.wider,
    textTransform: 'uppercase',
  },
});
