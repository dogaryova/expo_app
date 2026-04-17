import type { PostTier } from '../api/types';

export const queryKeys = {
  postsFeed: (tier: PostTier | 'all') => ['posts', 'feed', tier] as const,
  allPostsFeeds: () => ['posts', 'feed'] as const,
  postDetail: (id: string) => ['posts', 'detail', id] as const,
  comments: (postId: string) => ['comments', postId] as const,
};
