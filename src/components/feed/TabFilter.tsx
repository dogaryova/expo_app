import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '../../theme';
import type { PostTier } from '../../api/types';

export type FeedFilter = 'all' | PostTier;

interface TabFilterProps {
  value: FeedFilter;
  onChange: (next: FeedFilter) => void;
}

const ITEMS: { value: FeedFilter; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'free', label: 'Бесплатные' },
  { value: 'paid', label: 'Платные' },
];

function TabFilterBase({ value, onChange }: TabFilterProps) {
  return (
    <View style={styles.container}>
      {ITEMS.map((item) => {
        const active = item.value === value;
        return (
          <Pressable
            key={item.value}
            onPress={() => onChange(item.value)}
            style={[styles.tab, active && styles.tabActive]}
            hitSlop={{ top: 6, bottom: 6 }}
          >
            <Text style={[styles.label, active && styles.labelActive]}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export const TabFilter = memo(TabFilterBase);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    padding: 4,
    gap: 2,
    alignSelf: 'stretch',
  },
  tab: {
    flex: 1,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  label: {
    ...typography.captionMedium,
    color: colors.textSecondary,
  },
  labelActive: {
    color: colors.textInverse,
    fontWeight: '600' as const,
  },
});
