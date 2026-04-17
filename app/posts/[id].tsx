import { FlashList, type FlashListRef } from '@shopify/flash-list';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useRef } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { Comment } from '../../src/api/types';
import { ErrorState } from '../../src/components/common/ErrorState';
import { Icon } from '../../src/components/common/Icon';
import { CommentInput } from '../../src/components/detail/CommentInput';
import { CommentItem } from '../../src/components/detail/CommentItem';
import { LikeBar } from '../../src/components/detail/LikeBar';
import { PostDetailHeader } from '../../src/components/detail/PostDetailHeader';
import { useAddComment } from '../../src/hooks/useAddComment';
import { useComments } from '../../src/hooks/useComments';
import { useLikeToggle } from '../../src/hooks/useLikeToggle';
import { usePostDetail } from '../../src/hooks/usePostDetail';
import { colors, spacing } from '../../src/theme';

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const listRef = useRef<FlashListRef<Comment>>(null);

  const postQuery = usePostDetail(id);
  const commentsQuery = useComments(id);
  const addComment = useAddComment(id ?? '');
  const likeToggle = useLikeToggle(id ?? '');

  const comments = useMemo(
    () => commentsQuery.data?.pages.flatMap((p) => p.comments) ?? [],
    [commentsQuery.data],
  );

  const renderItem = useCallback(
    ({ item }: { item: Comment }) => <CommentItem comment={item} />,
    [],
  );

  const keyExtractor = useCallback((item: Comment) => item.id, []);

  const handleEndReached = useCallback(() => {
    if (commentsQuery.hasNextPage && !commentsQuery.isFetchingNextPage) {
      commentsQuery.fetchNextPage();
    }
  }, [commentsQuery]);

  const handleAdd = useCallback(
    async (text: string) => {
      await addComment.mutateAsync(text);
      // Scroll to top (newest) after the comment is appended.
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
    },
    [addComment],
  );

  const handleBack = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  }, []);

  if (postQuery.status === 'pending') {
    return (
      <SafeAreaView style={styles.root}>
        <BackHeader onBack={handleBack} />
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (postQuery.status === 'error' || !postQuery.data) {
    return (
      <SafeAreaView style={styles.root}>
        <BackHeader onBack={handleBack} />
        <ErrorState onAction={() => postQuery.refetch()} />
      </SafeAreaView>
    );
  }

  const post = postQuery.data;

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
      <BackHeader onBack={handleBack} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <FlashList
          ref={listRef}
          data={comments}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={Separator}
          ListHeaderComponent={
            <PostDetailHeader
              post={post}
              commentsCount={post.commentsCount}
              likeBar={
                <LikeBar
                  isLiked={post.isLiked}
                  likesCount={post.likesCount}
                  commentsCount={post.commentsCount}
                  onToggleLike={() => likeToggle.mutate()}
                />
              }
            />
          }
          ListFooterComponent={
            commentsQuery.isFetchingNextPage ? (
              <View style={styles.footer}>
                <ActivityIndicator color={colors.primary} />
              </View>
            ) : null
          }
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        />

        <View style={styles.inputWrap}>
          <CommentInput onSubmit={handleAdd} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

function BackHeader({ onBack }: { onBack: () => void }) {
  return (
    <View style={styles.backHeader}>
      <Pressable
        onPress={onBack}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={({ pressed }) => [styles.backBtn, pressed && styles.backBtnPressed]}
      >
        <Icon name="back" size={24} color={colors.textPrimary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  backHeader: {
    height: 44,
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnPressed: { opacity: 0.6 },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  separator: { height: 4 },
  footer: { paddingVertical: spacing.lg, alignItems: 'center' },
  inputWrap: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: Platform.OS === 'ios' ? spacing.sm : spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
});
