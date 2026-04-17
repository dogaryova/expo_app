import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';

import { colors, radius, shadow, spacing, typography } from '../../theme';
import type { Post } from '../../api/types';
import { Icon } from '../common/Icon';
import { AuthorRow } from './AuthorRow';
import { LikeButton } from '../detail/LikeButton';
import { useLikeToggle } from '../../hooks/useLikeToggle';

interface PostCardProps {
  post: Post;
  onPress: (post: Post) => void;
}

function PostCardBase({ post, onPress }: PostCardProps) {
  const handlePress = useCallback(() => onPress(post), [onPress, post]);
  const likeToggle = useLikeToggle(post.id);

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={handlePress}
    >
      <View style={styles.header}>
        <AuthorRow author={post.author} />
      </View>

      <Image
        source={{ uri: post.coverUrl }}
        style={styles.cover}
        contentFit="cover"
        transition={150}
        cachePolicy="memory-disk"
      />

      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {post.title}
        </Text>
        <Text style={styles.preview} numberOfLines={2}>
          {post.preview}
        </Text>

        <View style={styles.footer}>
          <LikeButton
            isLiked={post.isLiked}
            likesCount={post.likesCount}
            onToggle={() => likeToggle.mutate()}
            size={18}
          />
          <View style={styles.metric}>
            <Icon name="comment" size={18} color={colors.textSecondary} />
            <Text style={styles.metricText}>{post.commentsCount}</Text>
          </View>
          <View style={styles.spacer} />
          <Text style={styles.more}>Показать ещё</Text>
        </View>
      </View>
    </Pressable>
  );
}

export const PostCard = memo(PostCardBase);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadow.card,
  },
  cardPressed: { opacity: 0.92 },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  cover: {
    width: '100%',
    aspectRatio: 361 / 240,
    backgroundColor: colors.skeleton,
  },
  body: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  title: { ...typography.h3, color: colors.textPrimary },
  preview: {
    ...typography.body,
    color: colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metricText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '500' as const,
  },
  spacer: { flex: 1 },
  more: {
    ...typography.captionMedium,
    color: colors.primary,
  },
});
