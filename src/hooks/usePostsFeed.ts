import { useInfiniteQuery } from '@tanstack/react-query';

import { postsApi } from '../api/posts';
import type { PostsPage } from '../api/types';
import type { FeedFilter } from '../components/feed/TabFilter';
import { queryKeys } from './queryKeys';

const PAGE_SIZE = 10;

export function usePostsFeed(filter: FeedFilter) {
  return useInfiniteQuery<
    PostsPage,
    Error,
    { pages: PostsPage[]; pageParams: (string | undefined)[] },
    readonly [string, string, FeedFilter],
    string | undefined
  >({
    queryKey: queryKeys.postsFeed(filter),
    initialPageParam: undefined,
    queryFn: ({ pageParam, signal }) =>
      postsApi.list(
        {
          limit: PAGE_SIZE,
          cursor: pageParam,
          tier: filter === 'all' ? undefined : filter,
        },
        signal,
      ),
    getNextPageParam: (last) => (last.hasMore ? last.nextCursor ?? undefined : undefined),
  });
}
