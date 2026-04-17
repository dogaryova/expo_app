
export const colors = {
  primary: '#7B4FFF',
  primaryPressed: '#5F3BD4',
  primaryTint: '#E9E0FF',

  background: '#F5F8FD',
  surface: '#FFFFFF',

  textPrimary: '#1A1A1A',
  textSecondary: '#7B7B82',
  textMuted: '#B0B3BA',
  textInverse: '#FFFFFF',

  danger: '#FF3B30',
  success: '#34C759',

  border: '#E8EAF0',
  divider: '#EFF1F5',
  skeleton: '#E6E9EF',

  overlay: 'rgba(27, 27, 40, 0.35)',
} as const;

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  pill: 999,
} as const;

export const typography = {
  h1: { fontSize: 24, fontWeight: '700' as const, lineHeight: 32 },
  h2: { fontSize: 20, fontWeight: '700' as const, lineHeight: 26 },
  h3: { fontSize: 17, fontWeight: '600' as const, lineHeight: 22 },
  bodyLarge: { fontSize: 16, fontWeight: '400' as const, lineHeight: 22 },
  body: { fontSize: 15, fontWeight: '400' as const, lineHeight: 20 },
  bodyMedium: { fontSize: 15, fontWeight: '500' as const, lineHeight: 20 },
  caption: { fontSize: 13, fontWeight: '400' as const, lineHeight: 18 },
  captionMedium: { fontSize: 13, fontWeight: '500' as const, lineHeight: 18 },
  small: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
  button: { fontSize: 15, fontWeight: '600' as const, lineHeight: 20 },
} as const;

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  popover: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
} as const;

export const layout = {
  screenWidth: 393,
  cardGap: spacing.lg,
  screenPadding: spacing.lg,
  hitSlop: { top: 8, bottom: 8, left: 8, right: 8 },
} as const;

export type Colors = typeof colors;
export type Spacing = typeof spacing;
export type Radius = typeof radius;
