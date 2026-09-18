import React, { useRef, useCallback } from 'react';
import {
  Animated,
  GestureResponderEvent,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { hitSlop as defaultHitSlop } from '../../theme/spacing';
import { motionSprings } from '../../theme/motion';

export type BasePressableProps = PressableProps & {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  scaleOnPress?: boolean;
  scaleTo?: number;
  onPress?: (event: GestureResponderEvent) => void;
  hapticFeedback?: () => void;
};

/**
 * BasePressable — Primitive pressable with native driver spring scaling,
 * accessible hitSlop, and optional tactile haptic trigger.
 */
export function BasePressable({
  children,
  style,
  scaleOnPress = true,
  scaleTo = motionSprings.press.scaleDown,
  disabled = false,
  onPress,
  onPressIn,
  onPressOut,
  hapticFeedback,
  hitSlop = defaultHitSlop,
  accessibilityRole = 'button',
  ...rest
}: BasePressableProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(
    (e: GestureResponderEvent) => {
      if (scaleOnPress && !disabled) {
        Animated.spring(scale, {
          toValue: scaleTo,
          useNativeDriver: true,
          speed: motionSprings.press.speed,
          bounciness: motionSprings.press.bounciness,
        }).start();
      }
      onPressIn?.(e);
    },
    [scaleOnPress, disabled, scale, scaleTo, onPressIn],
  );

  const handlePressOut = useCallback(
    (e: GestureResponderEvent) => {
      if (scaleOnPress && !disabled) {
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          speed: motionSprings.release.speed,
          bounciness: motionSprings.release.bounciness,
        }).start();
      }
      onPressOut?.(e);
    },
    [scaleOnPress, disabled, scale, onPressOut],
  );

  const handlePress = useCallback(
    (e: GestureResponderEvent) => {
      if (disabled) return;
      hapticFeedback?.();
      onPress?.(e);
    },
    [disabled, hapticFeedback, onPress],
  );

  return (
    <Animated.View style={[{ transform: [{ scale }] }, disabled && styles.disabled]}>
      <Pressable
        {...rest}
        disabled={disabled}
        hitSlop={hitSlop}
        accessibilityRole={accessibilityRole}
        accessibilityState={{
          ...rest.accessibilityState,
          disabled: !!disabled,
        }}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={style}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.5,
  },
});
