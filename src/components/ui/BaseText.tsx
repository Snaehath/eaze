import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextProps,
  TextStyle,
  useColorScheme,
} from 'react-native';
import {
  fontFamily,
  fontSize,
  fontWeight,
  letterSpacing,
  lineHeight,
} from '../../theme/typography';
import { darkColors, lightColors } from '../../theme/colors';

export type TextVariant =
  | 'display'
  | 'heading'
  | 'subheading'
  | 'body'
  | 'bodySmall'
  | 'button'
  | 'label'
  | 'micro';

export type BaseTextProps = TextProps & {
  children: React.ReactNode;
  variant?: TextVariant;
  color?: string;
  weight?: keyof typeof fontWeight;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  style?: StyleProp<TextStyle>;
};

export function BaseText({
  children,
  variant = 'body',
  color,
  weight,
  align,
  style,
  allowFontScaling = true,
  ...rest
}: BaseTextProps) {
  const scheme = useColorScheme();
  const defaultColors = scheme === 'dark' ? darkColors : lightColors;

  const resolvedColor = color ?? defaultColors.textPrimary;
  const variantStyle = variantStyles[variant];

  return (
    <Text
      {...rest}
      allowFontScaling={allowFontScaling}
      style={[
        styles.base,
        variantStyle,
        { color: resolvedColor },
        weight && { fontWeight: fontWeight[weight] },
        align && { textAlign: align },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily: fontFamily.regular,
  },
});

const variantStyles: Record<TextVariant, TextStyle> = StyleSheet.create({
  display: {
    fontSize: fontSize.display,
    fontWeight: fontWeight.black,
    letterSpacing: letterSpacing.tight,
    lineHeight: fontSize.display * lineHeight.tight,
  },
  heading: {
    fontSize: fontSize.heading,
    fontWeight: fontWeight.black,
    letterSpacing: letterSpacing.tight,
    lineHeight: fontSize.heading * lineHeight.tight,
  },
  subheading: {
    fontSize: fontSize.subheading,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.subheading * lineHeight.relaxed,
  },
  body: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.body * lineHeight.relaxed,
    letterSpacing: letterSpacing.normal,
  },
  bodySmall: {
    fontSize: fontSize.bodySmall,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.bodySmall * lineHeight.relaxed,
    letterSpacing: letterSpacing.normal,
  },
  button: {
    fontSize: fontSize.button,
    fontWeight: fontWeight.semibold,
    letterSpacing: letterSpacing.wider,
    textTransform: 'uppercase',
  },
  label: {
    fontSize: fontSize.label,
    fontWeight: fontWeight.bold,
    letterSpacing: letterSpacing.widest,
    textTransform: 'uppercase',
  },
  micro: {
    fontSize: fontSize.micro,
    fontWeight: fontWeight.medium,
    letterSpacing: letterSpacing.wide,
    textTransform: 'uppercase',
  },
});
