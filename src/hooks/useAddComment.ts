import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';

import { commentsApi } from '../api/comments';
import { queryKeys } from './queryKeys';
import type { Comment, CommentsPage, Post } from '../api/types';

export function useAddComment(postId: string) {
  const qc = useQueryClient();

  return useMutation<{ comment: Comment }, Error, string>({
    mutationFn: (text) => commentsApi.create(postId, text),

    onMutate: async () => {
      await qc.cancelQueries({ queryKey: queryKeys.postDetail(postId) });
      const prevPost = qc.getQueryData<Post>(queryKeys.postDetail(postId));
      if (prevPost) {
        qc.setQueryData<Post>(queryKeys.postDetail(postId), {
          ...prevPost,
          commentsCount: prevPost.commentsCount + 1,
        });
      }
      return { prevPost };
    },

    onError: (_err, _text, ctx) => {
      const context = ctx as { prevPost?: Post } | undefined;
      if (context?.prevPost) {
        qc.setQueryData(queryKeys.postDetail(postId), context.prevPost);
      }
    },

    onSuccess: (result) => {
      qc.setQueryData<InfiniteData<CommentsPage>>(
        queryKeys.comments(postId),
        (data) => {
          if (!data) return data;
          const first = data.pages[0];
          if (!first) return data;
          if (first.comments.some((c) => c.id === result.comment.id)) {
            return data;
          }
          return {
            ...data,
            pages: [
              { ...first, comments: [result.comment, ...first.comments] },
              ...data.pages.slice(1),
            ],
          };
        },
      );
    },
  });
}
