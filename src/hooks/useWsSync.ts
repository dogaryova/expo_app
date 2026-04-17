import { useEffect } from 'react';
import { useQueryClient, type InfiniteData } from '@tanstack/react-query';

import { useWsStore } from '../stores/RootStore';
import { applyLikeState } from './useLikeToggle';
import { queryKeys } from './queryKeys';
import type { CommentsPage, Post, PostsPage, WsEvent } from '../api/types';

export function useWsSync() {
  const ws = useWsStore();
  const qc = useQueryClient();

  useEffect(() => {
    const unsubscribe = ws.subscribe((event: WsEvent) => {
      if (event.type === 'like_updated') {
        applyLikeState(qc, event.postId, { likesCount: event.likesCount });
        return;
      }

      if (event.type === 'comment_added') {
        const { postId, comment } = event;

        qc.setQueryData<InfiniteData<CommentsPage>>(
          queryKeys.comments(postId),
          (data) => {
            if (!data) return data;
            const first = data.pages[0];
            if (!first) return data;
            if (first.comments.some((c) => c.id === comment.id)) return data;
            return {
              ...data,
              pages: [
                { ...first, comments: [comment, ...first.comments] },
                ...data.pages.slice(1),
              ],
            };
          },
        );

        qc.setQueryData<Post>(queryKeys.postDetail(postId), (prev) =>
          prev ? { ...prev, commentsCount: prev.commentsCount + 1 } : prev,
        );

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
                    ? { ...p, commentsCount: p.commentsCount + 1 }
                    : p,
                ),
              })),
            };
          });
        }
      }

    });

    return unsubscribe;
  }, [ws, qc]);
}
