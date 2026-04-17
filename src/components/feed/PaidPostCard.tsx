import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';

import { colors, radius, shadow, spacing, typography } from '../../theme';
import type { Post } from '../../api/types';
import { AuthorRow } from './AuthorRow';
import { Button } from '../common/Button';
import { Icon } from '../common/Icon';

interface PaidPostCardProps {
  post: Post;
  onPress: (post: Post) => void;
  onDonate?: (post: Post) => void;
}

function PaidPostCardBase({ post, onPress, onDonate }: PaidPostCardProps) {
  const handlePress = useCallback(() => onPress(post), [onPress, post]);
  const handleDonate = useCallback(() => onDonate?.(post), [onDonate, post]);

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={handlePress}
    >
      <View style={styles.header}>
        <AuthorRow author={post.author} />
      </View>

      <View style={styles.coverWrapper}>
        <Image
          source={{ uri: post.coverUrl }}
          style={styles.cover}
          contentFit="cover"
          transition={150}
          cachePolicy="memory-disk"
          blurRadius={24}
        />
        <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
        <View style={styles.overlay}>
          <View style={styles.lockPill}>
            <Icon name="lock" size={16} color={colors.textInverse} />
          </View>
          <Text style={styles.overlayText}>
            Контент скрыт пользователем.{'\n'}Доступ откроется после доната.
          </Text>
          <Button
            label="Отправить донат"
            onPress={handleDonate}
            variant="primary"
            size="md"
          />
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.skeletonLine} />
        <View style={[styles.skeletonLine, { width: '70%' }]} />
      </View>
    </Pressable>
  );
}

export const PaidPostCard = memo(PaidPostCardBase);

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
  coverWrapper: {
    width: '100%',
    aspectRatio: 361 / 240,
    backgroundColor: colors.skeleton,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cover: { ...StyleSheet.absoluteFillObject },
  overlay: {
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
  },
  lockPill: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayText: {
    ...typography.caption,
    color: colors.textInverse,
    textAlign: 'center',
    fontWeight: '500' as const,
  },
  body: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  skeletonLine: {
    height: 10,
    borderRadius: radius.sm,
    backgroundColor: colors.skeleton,
  },
});
