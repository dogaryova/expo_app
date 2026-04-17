import { memo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Comment } from '../../api/types';
import { Avatar } from '../common/Avatar';
import { Icon } from '../common/Icon';
import { colors, spacing, typography } from '../../theme';

interface CommentItemProps {
  comment: Comment;
}

function CommentItemBase({ comment }: CommentItemProps) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);

  return (
    <View style={styles.row}>
      <Avatar uri={comment.author.avatarUrl} displayName={comment.author.displayName} size={32} />
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>
          {comment.author.displayName}
        </Text>
        <Text style={styles.text}>{comment.text}</Text>
      </View>
      <Pressable
        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        onPress={() => {
          setLiked((prev) => {
            setCount((c) => c + (prev ? -1 : 1));
            return !prev;
          });
        }}
        style={styles.like}
      >
        <Icon
          name={liked ? 'heart-filled' : 'heart-outline'}
          size={16}
          color={liked ? colors.danger : colors.textSecondary}
        />
        {count > 0 ? <Text style={styles.likeCount}>{count}</Text> : null}
      </Pressable>
    </View>
  );
}

export const CommentItem = memo(CommentItemBase);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  body: {
    flex: 1,
    gap: 2,
  },
  name: {
    ...typography.captionMedium,
    color: colors.textPrimary,
    fontWeight: '600' as const,
  },
  text: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  like: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingTop: 2,
  },
  likeCount: {
    ...typography.small,
    color: colors.textSecondary,
    fontWeight: '500' as const,
  },
});
