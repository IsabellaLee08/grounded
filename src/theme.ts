// Palette + type pulled from the Grounded pitch deck:
// charcoal slides, navy panels, pastel periwinkle backgrounds, light-blue chips.
export const colors = {
  bg: '#D5DAE6',
  bgGradient: ['#DDE1EC', '#CBD8F1', '#DAD6EE'] as const,
  card: '#EEF0F6',
  charcoal: '#3E3E40',
  ink: '#1D1D20',
  navy: '#123A73',
  blue: '#1F57B5',
  sky: '#A9CCF5',
  chip: '#CFE1FA',
  outline: '#2B2B2E',
  muted: '#6B6F7A',
  white: '#FFFFFF',
  danger: '#B3362F',
  headerGradient: ['#9DB8E8', '#C5C9F0', '#8FA3D8'] as const,
};

export const radius = { card: 22, pill: 999, input: 14 };

// Deck titles are heavy, tightly tracked sans-serif.
export const type = {
  display: { fontSize: 44, fontWeight: '800' as const, letterSpacing: -2, color: colors.charcoal },
  title: { fontSize: 32, fontWeight: '800' as const, letterSpacing: -1.2, color: colors.ink },
  h2: { fontSize: 18, fontWeight: '800' as const, letterSpacing: -0.4, color: colors.ink },
  body: { fontSize: 14, color: colors.ink },
  small: { fontSize: 12, color: colors.muted },
  eyebrow: { fontSize: 11, fontWeight: '700' as const, letterSpacing: 1.6, color: colors.blue },
};
