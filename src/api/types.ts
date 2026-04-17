
export interface Author {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  subscribersCount: number;
  isVerified: boolean;
}

export type PostTier = 'free' | 'paid';

export interface Post {
  id: string;
  author: Author;
  title: string;
  body: string;
  preview: string;
  coverUrl: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  tier: PostTier;
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  author: Author;
  text: string;
  createdAt: string;
}

export interface Page<T> {
  posts?: T[];
  comments?: T[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface PostsPage {
  posts: Post[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface CommentsPage {
  comments: Comment[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface LikeResult {
  isLiked: boolean;
  likesCount: number;
}

export type ApiResponse<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: string; message: string } };

export interface ListPostsParams {
  limit?: number;
  cursor?: string;
  tier?: PostTier;
  simulate_error?: boolean;
}

export interface ListCommentsParams {
  limit?: number;
  cursor?: string;
}


export interface WsLikeUpdated {
  type: 'like_updated';
  postId: string;
  likesCount: number;
}

export interface WsCommentAdded {
  type: 'comment_added';
  postId: string;
  comment: Comment;
}

export interface WsPing {
  type: 'ping';
}

export type WsEvent = WsLikeUpdated | WsCommentAdded | WsPing;
