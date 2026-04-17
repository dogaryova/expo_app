import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { Post } from '../src/api/types';
import { EmptyState } from '../src/components/common/EmptyState';
import { ErrorState } from '../src/components/common/ErrorState';
import { PaidPostCard } from '../src/components/feed/PaidPostCard';
import { PostCard } from '../src/components/feed/PostCard';
import { TabFilter, type FeedFilter } from '../src/components/feed/TabFilter';
import { usePostsFeed } from '../src/hooks/usePostsFeed';
import { colors, spacing, typography } from '../src/theme';

export default function FeedScreen() {
  const [filter, setFilter] = useState<FeedFilter>('all');
  const query = usePostsFeed(filter);

  const posts = useMemo(
    () => query.data?.pages.flatMap((p) => p.posts) ?? [],
    [query.data],
  );

  const handleOpen = useCallback((post: Post) => {
    router.push(`/posts/${post.id}`);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Post }) =>
      item.tier === 'paid' ? (
        <PaidPostCard post={item} onPress={handleOpen} />
      ) : (
        <PostCard post={item} onPress={handleOpen} />
      ),
    [handleOpen],
  );

  const keyExtractor = useCallback((item: Post) => item.id, []);

  const handleEndReached = useCallback(() => {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      query.fetchNextPage();
    }
  }, [query]);

  const handleRefresh = useCallback(() => {
    void query.refetch();
  }, [query]);

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <TabFilter value={filter} onChange={setFilter} />
      </View>

      {query.status === 'pending' ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : query.status === 'error' ? (
        <ErrorState onAction={() => query.refetch()} />
      ) : posts.length === 0 ? (
        <EmptyState onAction={() => setFilter('all')} />
      ) : (
        <FlashList
          data={posts}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContent}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.4}
          refreshControl={
            <RefreshControl
              refreshing={query.isRefetching && !query.isFetchingNextPage}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
            />
          }
          ListFooterComponent={
            query.isFetchingNextPage ? (
              <View style={styles.footer}>
                <ActivityIndicator color={colors.primary} />
              </View>
            ) : !query.hasNextPage && posts.length > 0 ? (
              <Text style={styles.footerText}>Больше постов нет</Text>
            ) : null
          }
          ItemSeparatorComponent={Separator}
        />
      )}
    </SafeAreaView>
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  separator: { height: spacing.lg },
  footer: { paddingVertical: spacing.lg, alignItems: 'center' },
  footerText: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
});
