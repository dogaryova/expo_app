import { apiFetch } from './client';
import type {
  LikeResult,
  ListPostsParams,
  Post,
  PostsPage,
} from './types';

export const postsApi = {
  list(params: ListPostsParams = {}, signal?: AbortSignal): Promise<PostsPage> {
    return apiFetch<PostsPage>('/posts', {
      query: {
        limit: params.limit ?? 10,
        cursor: params.cursor,
        tier: params.tier,
        simulate_error: params.simulate_error,
      },
      signal,
    });
  },

  detail(id: string, signal?: AbortSignal): Promise<{ post: Post }> {
    return apiFetch<{ post: Post }>(`/posts/${encodeURIComponent(id)}`, { signal });
  },

  toggleLike(id: string): Promise<LikeResult> {
    return apiFetch<LikeResult>(`/posts/${encodeURIComponent(id)}/like`, {
      method: 'POST',
    });
  },
};
