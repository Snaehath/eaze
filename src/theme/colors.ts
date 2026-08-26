// Theme: color tokens — light and dark variants
// These are the only values used across the app. No inline colors allowed.

const palette = {
  // Warm neutrals
  cream: '#F5F0E8',
  creamDark: '#EDE7D9',
  charcoal: '#1A1814',
  charcoalMid: '#2C2924',
  charcoalLight: '#3D3A35',

  // Text
  inkPrimary: '#1A1814',
  inkSecondary: '#6B6560',
  inkTertiary: '#9E9890',
  inkInverted: '#F5F0E8',
  inkInvertedSoft: '#C8C2B8',

  // Accent — a single warm amber/terra-cotta
  accent: '#C2724F',
  accentLight: '#D4896A',
  accentDark: '#A35C3A',
  accentFaint: 'rgba(194, 114, 79, 0.12)',

  // Neutrals for subtle UI
  surfaceLight: '#EDEBE6',
  borderLight: 'rgba(26, 24, 20, 0.1)',
  borderDark: 'rgba(245, 240, 232, 0.1)',

  // Breathing circle
  breathCircleLight: 'rgba(194, 114, 79, 0.15)',
  breathCircleLightBorder: 'rgba(194, 114, 79, 0.4)',
  breathCircleDark: 'rgba(194, 114, 79, 0.2)',
  breathCircleDarkBorder: 'rgba(194, 114, 79, 0.5)',
} as const;

type ColorScheme = {
  background: string;
  backgroundAlt: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  accent: string;
  accentLight: string;
  accentFaint: string;
  buttonPrimaryBg: string;
  buttonPrimaryText: string;
  buttonSecondaryBg: string;
  buttonSecondaryBorder: string;
  buttonSecondaryText: string;
  border: string;
  breathCircle: string;
  breathCircleBorder: string;
  surface: string;
};

export const lightColors: ColorScheme = {
  background: palette.cream,
  backgroundAlt: palette.creamDark,
  textPrimary: palette.inkPrimary,
  textSecondary: palette.inkSecondary,
  textTertiary: palette.inkTertiary,
  accent: palette.accent,
  accentLight: palette.accentLight,
  accentFaint: palette.accentFaint,
  buttonPrimaryBg: palette.inkPrimary,
  buttonPrimaryText: palette.inkInverted,
  buttonSecondaryBg: 'transparent',
  buttonSecondaryBorder: palette.borderLight,
  buttonSecondaryText: palette.inkSecondary,
  border: palette.borderLight,
  breathCircle: palette.breathCircleLight,
  breathCircleBorder: palette.breathCircleLightBorder,
  surface: palette.surfaceLight,
};

export const darkColors: ColorScheme = {
  background: palette.charcoal,
  backgroundAlt: palette.charcoalMid,
  textPrimary: palette.inkInverted,
  textSecondary: palette.inkInvertedSoft,
  textTertiary: 'rgba(245, 240, 232, 0.4)',
  accent: palette.accentLight,
  accentLight: palette.accent,
  accentFaint: 'rgba(194, 114, 79, 0.15)',
  buttonPrimaryBg: palette.inkInverted,
  buttonPrimaryText: palette.charcoal,
  buttonSecondaryBg: 'transparent',
  buttonSecondaryBorder: palette.borderDark,
  buttonSecondaryText: palette.inkInvertedSoft,
  border: palette.borderDark,
  breathCircle: palette.breathCircleDark,
  breathCircleBorder: palette.breathCircleDarkBorder,
  surface: palette.charcoalLight,
};

export type { ColorScheme };
