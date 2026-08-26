import { Platform } from 'react-native';

export const fontFamily = Platform.select({
  ios: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  android: {
    regular: 'sans-serif',
    medium: 'sans-serif-medium',
    bold: 'sans-serif',
  },
  default: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
});

export const fontSize = {
  /** Hero — screen title */
  hero: 48,
  /** Display — large heading */
  display: 36,
  /** Heading */
  heading: 28,
  /** Subheading */
  subheading: 20,
  /** Body */
  body: 17,
  /** Secondary body */
  bodySmall: 15,
  /** Label / caption */
  label: 13,
  /** Tiny */
  tiny: 11,
  /** Countdown numbers */
  countdown: 80,
} as const;

export const fontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  black: '900' as const,
};

export const lineHeight = {
  tight: 1.1,
  normal: 1.4,
  relaxed: 1.6,
} as const;

export const letterSpacing = {
  tight: -0.5,
  normal: 0,
  wide: 1,
  wider: 2,
  widest: 4,
} as const;
