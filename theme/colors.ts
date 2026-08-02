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
  gold: '#E5A93C',
  goldMuted: '#C5A059',
  red: '#FF4D6D',
  green: '#3DDC97',

  // Profile screen accents
  electricBlue: '#00F0FF',
  neonGreen: '#39FF14',
  cyberGold: '#FFD700',
  flameOrange: '#FF5500',
} as const;

export const colors = {
  background: palette.black,
  surface: palette.navy800,
  surfaceElevated: palette.navy700,
  border: palette.navy600,

  // Glass surfaces for profile cards
  glass: 'rgba(255, 255, 255, 0.05)',
  glassBorder: 'rgba(255, 255, 255, 0.10)',
  glassElevated: 'rgba(255, 255, 255, 0.08)',

  textPrimary: palette.white,
  textSecondary: palette.slate300,
  textMuted: palette.slate500,

  accentPrimary: palette.white,
  accentSecondary: palette.purple,
  accentGold: palette.gold,
  accentGoldMuted: palette.goldMuted,
  accentBlue: palette.electricBlue,
  accentGreen: palette.neonGreen,
  accentCyberGold: palette.cyberGold,
  accentOrange: palette.flameOrange,

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

