import { accountData as UserAuthor } from '@/types/auth/user';

/**
 * 社区讨论接口
 */
export interface DiscussionDto {
  id?: string;
  title?: string;
  content?: string;
  userId?: string;
  userName?: string;
  tags?: string[];
  /** Format: int32 */
  viewCount?: number | string;
  /** Format: int32 */
  replyCount?: number | string;
  /** Format: int32 */
  likeCount?: number | string;
  /** Format: double */
  trendingScore?: number | string;
  /** Format: date-time */
  createdAt?: string;
  /** Format: date-time */
  updatedAt?: string;
  isLiked?: boolean;
}

/**
 * 讨论详情接口，包含回复
 */
export interface DiscussionDetailDto {
  id?: string;
  title?: string;
  content?: string;
  userId?: string;
  userName?: string;
  tags?: string[];
  /** Format: int32 */
  viewCount?: number | string;
  /** Format: int32 */
  replyCount?: number | string;
  /** Format: int32 */
  likeCount?: number | string;
  /** Format: double */
  trendingScore?: number | string;
  isLiked?: boolean;
  /** Format: date-time */
  createdAt?: string;
  /** Format: date-time */
  updatedAt?: string;
  replies?: ReplyDto[];
}

/**
 * 回复接口
 */
export interface ReplyDto {
  id?: string;
  userId?: string;
  userName?: string;
  content?: string;
  /** Format: int32 */
  likeCount?: number | string;
  isLiked?: boolean;
  /** Format: date-time */
  createdAt?: string;
  /** Format: date-time */
  updatedAt?: string;
}

/**
 * 创建讨论请求
 */
export interface CreateDiscussionRequest {
  title: string;
  content: string;
  tags?: string[];
}

/**
 * 创建讨论命令
 */
export interface CreateDiscussionCommand {
  title: string;
  content: string;
  tags?: null | string[];
  userId?: string;
  userName?: string;
}

/**
 * 回复请求
 */
export interface ReplyRequest {
  content: string;
}

/**
 * 回复讨论命令
 */
export interface ReplyToDiscussionCommand {
  discussionId?: string;
  userId?: string;
  userName?: string;
  content?: string;
}

/**
 * 社区动态响应
 * 注意：根据raw.ts，/api/v2/community/feed的响应没有明确定义
 * 这个类型定义是基于API描述的推测
 */
export interface CommunityFeedResponse {
  trendingDiscussions?: DiscussionDto[];
  popularTags?: string[];
  latestDiscussions?: DiscussionDto[];
}

/**
 * 讨论查询结果
 */
export interface DiscussionsQueryResult {
  discussions?: DiscussionDto[];
  /** Format: int32 */
  totalCount?: number | string;
  /** Format: int32 */
  page?: number | string;
  /** Format: int32 */
  pageSize?: number | string;
  /** Format: int32 */
  totalPages?: number | string;
}

/**
 * 点赞响应
 */
export interface LikeResponse {
  message: string;
  isLiked: boolean;
  likeCount: number;
}

/**
 * 标签DTO
 */
export interface TagDto {
  name: string;
  count?: number;
}

/**
 * 讨论列表查询参数
 */
export interface DiscussionsQueryParams {
  tag?: string;
  sort?: 'latest' | 'popular'| string;
  search?: string;
  page?: number;
  pageSize?: number;
}

/**
 * 热门讨论查询参数
 */
export interface TrendingDiscussionsParams {
  count?: number;
}