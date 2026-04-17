import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';

import { postsApi } from '../api/posts';
import { queryKeys } from './queryKeys';
import type { LikeResult, Post, PostsPage } from '../api/types';

export function useLikeToggle(postId: string) {
  const qc = useQueryClient();

  return useMutation<LikeResult, Error, void>({
    mutationFn: () => postsApi.toggleLike(postId),

    onMutate: async () => {
      await qc.cancelQueries({ queryKey: queryKeys.postDetail(postId) });
      await qc.cancelQueries({ queryKey: queryKeys.allPostsFeeds() });

      const prevDetail = qc.getQueryData<Post>(queryKeys.postDetail(postId));
      const prevFeeds = qc.getQueriesData<InfiniteData<PostsPage>>({
        queryKey: queryKeys.allPostsFeeds(),
      });

      const flip = (p: Post): Post => ({
        ...p,
        isLiked: !p.isLiked,
        likesCount: Math.max(0, p.likesCount + (p.isLiked ? -1 : 1)),
      });

      if (prevDetail) {
        qc.setQueryData<Post>(queryKeys.postDetail(postId), flip(prevDetail));
      }

      for (const [key] of prevFeeds) {
        qc.setQueryData<InfiniteData<PostsPage>>(key, (data) => {
          if (!data) return data;
          return {
            ...data,
            pages: data.pages.map((page) => ({
              ...page,
              posts: page.posts.map((p) => (p.id === postId ? flip(p) : p)),
            })),
          };
        });
      }

      return { prevDetail, prevFeeds };
    },

    onError: (_err, _vars, ctx) => {
      const context = ctx as
        | {
            prevDetail?: Post;
            prevFeeds: [readonly unknown[], InfiniteData<PostsPage> | undefined][];
          }
        | undefined;
      if (context?.prevDetail) {
        qc.setQueryData(queryKeys.postDetail(postId), context.prevDetail);
      }
      for (const [key, value] of context?.prevFeeds ?? []) {
        qc.setQueryData(key, value);
      }
    },

    onSuccess: (result) => {
      applyLikeState(qc, postId, result);
    },
  });
}

export function applyLikeState(
  qc: ReturnType<typeof useQueryClient>,
  postId: string,
  state: { isLiked?: boolean; likesCount: number },
) {
  qc.setQueryData<Post>(queryKeys.postDetail(postId), (prev) => {
    if (!prev) return prev;
    return {
      ...prev,
      likesCount: state.likesCount,
      isLiked: state.isLiked ?? prev.isLiked,
    };
  });

  const feeds = qc.getQueriesData<InfiniteData<PostsPage>>({
    queryKey: queryKeys.allPostsFeeds(),
  });
  for (const [key] of feeds) {
    qc.setQueryData<InfiniteData<PostsPage>>(key, (data) => {
      if (!data) return data;
      return {
        ...data,
        pages: data.pages.map((page) => ({
          ...page,
          posts: page.posts.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  likesCount: state.likesCount,
                  isLiked: state.isLiked ?? p.isLiked,
                }
              : p,
          ),
        })),
      };
    });
  }
}
