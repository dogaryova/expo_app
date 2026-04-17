import { apiFetch } from './client';
import type { Comment, CommentsPage, ListCommentsParams } from './types';

export const commentsApi = {
  list(
    postId: string,
    params: ListCommentsParams = {},
    signal?: AbortSignal,
  ): Promise<CommentsPage> {
    return apiFetch<CommentsPage>(
      `/posts/${encodeURIComponent(postId)}/comments`,
      {
        query: { limit: params.limit ?? 20, cursor: params.cursor },
        signal,
      },
    );
  },

  create(postId: string, text: string): Promise<{ comment: Comment }> {
    return apiFetch<{ comment: Comment }>(
      `/posts/${encodeURIComponent(postId)}/comments`,
      { method: 'POST', body: { text } },
    );
  },
};
