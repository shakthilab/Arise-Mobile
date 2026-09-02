export const palette = {
  black: '#000000',
  navy900: '#050505',
  navy800: '#0E0E10',
  navy700: '#161618',
  navy600: '#27272A',
  navy500: '#3F3F46',

  white: '#FFFFFF',
  slate100: '#F4F4F6',
  slate300: '#A1A1AA',
  slate500: '#71717A',

  blue: '#5B8CFF',
  purple: '#9D4EDD',
  orange: '#FE5B01',
  orangeMuted: 'rgba(254, 91, 1, 0.65)',
  gold: '#FE5B01',
  goldMuted: '#FF7A00',
  red: '#FF4D6D',
  green: '#3DDC97',
} as const;

export const colors = {
  background: palette.black,
  surface: palette.navy800,
  surfaceElevated: palette.navy700,
  border: palette.navy600,

  textPrimary: palette.white,
  textSecondary: palette.slate300,
  textMuted: palette.slate500,

  accentPrimary: palette.white,
  accentSecondary: palette.purple,
  accentOrange: palette.orange,
  accentGold: palette.orange,
  accentGoldMuted: palette.orangeMuted,

  success: palette.green,
  danger: palette.red,
  warning: palette.orange,

  // Loot / achievement rarity tiers
  rarity: {
    common: palette.slate300,
    rare: palette.blue,
    epic: palette.purple,
    legendary: palette.orange,
  },
} as const;

export type AppColors = typeof colors;
