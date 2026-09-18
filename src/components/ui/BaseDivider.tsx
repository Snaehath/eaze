import React from 'react';
import { StyleSheet, View, ViewProps, useColorScheme } from 'react-native';
import { darkColors, lightColors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export type BaseDividerProps = ViewProps & {
  spacingVertical?: keyof typeof spacing;
  color?: string;
};

export function BaseDivider({
  spacingVertical = 'md',
  color,
  style,
  ...rest
}: BaseDividerProps) {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? darkColors : lightColors;

  return (
    <View
      {...rest}
      style={[
        styles.divider,
        {
          borderColor: color ?? colors.border,
          marginVertical: spacing[spacingVertical],
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  divider: {
    borderTopWidth: 1,
    width: '100%',
  },
});
