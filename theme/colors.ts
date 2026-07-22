export const palette = {
  black: '#05070C',
  navy900: '#0A0E17',
  navy800: '#131826',
  navy700: '#1C2333',
  navy600: '#2A3347',
  navy500: '#3A4560',

  white: '#FFFFFF',
  slate100: '#E6E9F2',
  slate300: '#8A93A8',
  slate500: '#5A627A',

  blue: '#5B8CFF',
  purple: '#9D4EDD',
  gold: '#FFC94D',
  red: '#FF4D6D',
  green: '#3DDC97',
} as const;

export const colors = {
  background: palette.navy900,
  surface: palette.navy800,
  surfaceElevated: palette.navy700,
  border: palette.navy600,

  textPrimary: palette.slate100,
  textSecondary: palette.slate300,
  textMuted: palette.slate500,

  accentPrimary: palette.blue,
  accentSecondary: palette.purple,

  success: palette.green,
  danger: palette.red,
  warning: palette.gold,

  // Loot / achievement rarity tiers
  rarity: {
    common: palette.slate300,
    rare: palette.blue,
    epic: palette.purple,
    legendary: palette.gold,
  },
} as const;

export type AppColors = typeof colors;
