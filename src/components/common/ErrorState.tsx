import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../../theme';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

function ErrorStateBase({
  title = 'Не удалось загрузить публикацию',
  description,
  actionLabel = 'Повторить',
  onAction,
}: ErrorStateProps) {
  return (
    <View style={styles.root}>
      <View style={styles.illustration}>
        <View style={styles.blob} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.desc}>{description}</Text> : null}
      {onAction ? (
        <Button label={actionLabel} onPress={onAction} variant="primary" fullWidth />
      ) : null}
    </View>
  );
}

export const ErrorState = memo(ErrorStateBase);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.lg,
  },
  illustration: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  blob: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primaryTint,
    opacity: 0.6,
  },
  title: {
    ...typography.h3,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  desc: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
