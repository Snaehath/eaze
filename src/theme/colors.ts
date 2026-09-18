// Theme: Color tokens — Light and Dark variants
// Curated, harmonious palette: Deep Charcoal (#141210), Warm Cream (#F5F0E8), Muted Terra-cotta (#C2724F)

export const palette = {
  // Warm neutrals
  cream: '#F5F0E8',
  creamDark: '#EDE7D9',
  charcoal: '#141210',
  charcoalMid: '#1E1B18',
  charcoalLight: '#2C2824',

  // Text
  inkPrimary: '#141210',
  inkSecondary: '#6B6560',
  inkTertiary: '#9E9890',
  inkInverted: '#F5F0E8',
  inkInvertedSoft: '#C8C2B8',
  inkInvertedTertiary: 'rgba(245, 240, 232, 0.4)',

  // Accent — Warm Amber / Terra-cotta
  terra: '#C2724F',
  terraLight: '#D4896A',
  terraDark: '#A35C3A',
  terraFaintLight: 'rgba(194, 114, 79, 0.12)',
  terraFaintDark: 'rgba(194, 114, 79, 0.16)',

  // Neutrals for subtle UI
  surfaceLight: '#EDEBE6',
  surfaceDark: '#1E1B18',
  borderLight: 'rgba(20, 18, 16, 0.08)',
  borderDark: 'rgba(245, 240, 232, 0.08)',
  borderLightStrong: 'rgba(20, 18, 16, 0.15)',
  borderDarkStrong: 'rgba(245, 240, 232, 0.15)',

  // Breathing circle
  breathCircleLight: 'rgba(194, 114, 79, 0.15)',
  breathCircleLightBorder: 'rgba(194, 114, 79, 0.4)',
  breathCircleDark: 'rgba(194, 114, 79, 0.2)',
  breathCircleDarkBorder: 'rgba(194, 114, 79, 0.5)',
} as const;

export type ColorScheme = {
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
  borderStrong: string;
  breathCircle: string;
  breathCircleBorder: string;
  surface: string;
  surfaceSubtle: string;
};

export const lightColors: ColorScheme = {
  background: palette.cream,
  backgroundAlt: palette.creamDark,
  textPrimary: palette.inkPrimary,
  textSecondary: palette.inkSecondary,
  textTertiary: palette.inkTertiary,
  accent: palette.terra,
  accentLight: palette.terraLight,
  accentFaint: palette.terraFaintLight,
  buttonPrimaryBg: palette.inkPrimary,
  buttonPrimaryText: palette.inkInverted,
  buttonSecondaryBg: 'transparent',
  buttonSecondaryBorder: palette.borderLightStrong,
  buttonSecondaryText: palette.inkSecondary,
  border: palette.borderLight,
  borderStrong: palette.borderLightStrong,
  breathCircle: palette.breathCircleLight,
  breathCircleBorder: palette.breathCircleLightBorder,
  surface: palette.surfaceLight,
  surfaceSubtle: palette.creamDark,
};

export const darkColors: ColorScheme = {
  background: palette.charcoal,
  backgroundAlt: palette.charcoalMid,
  textPrimary: palette.inkInverted,
  textSecondary: palette.inkInvertedSoft,
  textTertiary: palette.inkInvertedTertiary,
  accent: palette.terra,
  accentLight: palette.terraLight,
  accentFaint: palette.terraFaintDark,
  buttonPrimaryBg: palette.inkInverted,
  buttonPrimaryText: palette.charcoal,
  buttonSecondaryBg: 'transparent',
  buttonSecondaryBorder: palette.borderDarkStrong,
  buttonSecondaryText: palette.inkInvertedSoft,
  border: palette.borderDark,
  borderStrong: palette.borderDarkStrong,
  breathCircle: palette.breathCircleDark,
  breathCircleBorder: palette.breathCircleDarkBorder,
  surface: palette.charcoalLight,
  surfaceSubtle: palette.charcoalMid,
};
