import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle, useColorScheme } from 'react-native';
import { SafeAreaView, SafeAreaViewProps } from 'react-native-safe-area-context';
import { darkColors, lightColors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export type EazeContainerProps = SafeAreaViewProps & {
  children: React.ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  padded?: boolean;
};

/**
 * EazeContainer — Standard screen container providing safe area handling,
 * theme background, and consistent horizontal margins.
 */
export function EazeContainer({
  children,
  style,
  contentStyle,
  padded = true,
  ...rest
}: EazeContainerProps) {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;

  return (
    <SafeAreaView
      {...rest}
      style={[styles.safe, { backgroundColor: colors.background }, style]}
    >
      <View
        style={[
          styles.content,
          padded && styles.padded,
          contentStyle,
        ]}
      >
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  padded: {
    paddingHorizontal: spacing.lg,
  },
});
