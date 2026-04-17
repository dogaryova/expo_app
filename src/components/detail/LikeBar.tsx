import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '../common/Icon';
import { LikeButton } from './LikeButton';
import { colors, spacing, typography } from '../../theme';

interface LikeBarProps {
  isLiked: boolean;
  likesCount: number;
  commentsCount: number;
  onToggleLike: () => void;
  onFocusInput?: () => void;
  disabled?: boolean;
}

function LikeBarBase({
  isLiked,
  likesCount,
  commentsCount,
  onToggleLike,
  onFocusInput,
  disabled,
}: LikeBarProps) {
  const handleComment = useCallback(() => onFocusInput?.(), [onFocusInput]);

  return (
    <View style={styles.row}>
      <LikeButton
        isLiked={isLiked}
        likesCount={likesCount}
        onToggle={onToggleLike}
        disabled={disabled}
      />
      <Pressable onPress={handleComment} style={styles.btn} hitSlop={{ top: 6, bottom: 6 }}>
        <Icon name="comment" size={20} color={colors.textSecondary} />
        <Text style={styles.count}>{commentsCount}</Text>
      </Pressable>
    </View>
  );
}

export const LikeBar = memo(LikeBarBase);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.lg,
    alignItems: 'center',
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  count: {
    ...typography.captionMedium,
    color: colors.textSecondary,
    fontWeight: '600' as const,
  },
});
