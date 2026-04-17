import { useInfiniteQuery } from '@tanstack/react-query';

import { commentsApi } from '../api/comments';
import type { CommentsPage } from '../api/types';
import { queryKeys } from './queryKeys';

const PAGE_SIZE = 20;

export function useComments(postId: string | undefined) {
  return useInfiniteQuery<
    CommentsPage,
    Error,
    { pages: CommentsPage[]; pageParams: (string | undefined)[] },
    readonly [string, string],
    string | undefined
  >({
    queryKey: queryKeys.comments(postId ?? ''),
    enabled: !!postId,
    initialPageParam: undefined,
    queryFn: ({ pageParam, signal }) =>
      commentsApi.list(postId!, { limit: PAGE_SIZE, cursor: pageParam }, signal),
    getNextPageParam: (last) => (last.hasMore ? last.nextCursor ?? undefined : undefined),
  });
}
