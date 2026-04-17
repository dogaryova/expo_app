import { useQuery } from '@tanstack/react-query';

import { postsApi } from '../api/posts';
import { queryKeys } from './queryKeys';
import type { Post } from '../api/types';

export function usePostDetail(id: string | undefined) {
  return useQuery<Post>({
    queryKey: queryKeys.postDetail(id ?? ''),
    enabled: !!id,
    queryFn: async ({ signal }) => {
      const data = await postsApi.detail(id!, signal);
      return data.post;
    },
  });
}
