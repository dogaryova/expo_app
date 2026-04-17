import { memo, type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';

import type { Post } from '../../api/types';
import { AuthorRow } from '../feed/AuthorRow';
import { colors, spacing, typography } from '../../theme';
import { ruPlural } from '../../utils/time';

interface PostDetailHeaderProps {
  post: Post;
  commentsCount: number;
  likeBar: ReactNode;
}

function PostDetailHeaderBase({ post, commentsCount, likeBar }: PostDetailHeaderProps) {
  return (
    <View style={styles.root}>
      <AuthorRow author={post.author} />

      <Image
        source={{ uri: post.coverUrl }}
        style={styles.cover}
        contentFit="cover"
        transition={150}
        cachePolicy="memory-disk"
      />

      <View style={styles.textBlock}>
        <Text style={styles.title}>{post.title}</Text>
        {post.body ? <Text style={styles.body}>{post.body}</Text> : null}
      </View>

      <View style={styles.actions}>{likeBar}</View>

      <View style={styles.commentsHeader}>
        <Text style={styles.commentsCount}>
          {commentsCount}{' '}
          {ruPlural(commentsCount, ['комментарий', 'комментария', 'комментариев'])}
        </Text>
        <Text style={styles.sort}>Сначала новые</Text>
      </View>
    </View>
  );
}

export const PostDetailHeader = memo(PostDetailHeaderBase);

const styles = StyleSheet.create({
  root: {
    gap: spacing.md,
    paddingBottom: spacing.sm,
  },
  cover: {
    width: '100%',
    aspectRatio: 361 / 240,
    borderRadius: 16,
    backgroundColor: colors.skeleton,
  },
  textBlock: { gap: spacing.xs },
  title: { ...typography.h2, color: colors.textPrimary },
  body: { ...typography.body, color: colors.textPrimary },
  actions: {
    paddingVertical: spacing.xs,
  },
  commentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  commentsCount: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    fontWeight: '600' as const,
  },
  sort: {
    ...typography.captionMedium,
    color: colors.primary,
  },
});
