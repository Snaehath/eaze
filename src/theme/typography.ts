import { Platform } from 'react-native';

export const fontFamily = Platform.select({
  ios: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },
  android: {
    regular: 'sans-serif',
    medium: 'sans-serif-medium',
    semibold: 'sans-serif-medium',
    bold: 'sans-serif',
  },
  default: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },
});

export const fontSize = {
  /** Display — large hero titles ("Feeling nervous?", "YOU'RE READY.") */
  display: 44,
  /** Hero — alias for display */
  hero: 44,
  /** Heading — screen and section headers */
  heading: 28,
  /** Subheading — secondary headers */
  subheading: 20,
  /** Body — primary readable copy */
  body: 17,
  /** Secondary body / descriptive copy */
  bodySmall: 15,
  /** Button label */
  button: 15,
  /** Label / metadata / navigation kicker */
  label: 13,
  /** Micro-label — timestamps, subtle counters */
  micro: 11,
  /** Tiny — alias for micro */
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
  tight: -0.6,
  normal: 0,
  wide: 0.8,
  wider: 1.6,
  widest: 3.2,
} as const;
