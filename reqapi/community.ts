import axios from 'axios';
import useUserStore from '@/store';
import {
  CommunityFeedResponse,
  DiscussionDto,
  DiscussionDetailDto,
  CreateDiscussionRequest,
  ReplyRequest,
  DiscussionsQueryParams,
  TrendingDiscussionsParams,
  LikeResponse,
  TagDto,
  ReplyDto,
  DiscussionsQueryResult
} from '@/types/community/community';
// Helper function to get user token
const getUserToken = () => {
  const userState = useUserStore.getState();
  return userState.bearerToken || localStorage.getItem('token') || '';
};

// API function to get community feed
export const getCommunityFeed = async (): Promise<CommunityFeedResponse> => {
  const response = await axios.get('/api/v2/community/feed', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getUserToken()
    }
  });
  return response.data as CommunityFeedResponse;
};

// API function to get discussions with query parameters
export const getDiscussions = async (params?: DiscussionsQueryParams): Promise<DiscussionsQueryResult> => {
  const response = await axios.get('/api/v2/community/discussions', {
    params: {
      tag: params?.tag || undefined,
      sort: params?.sort || undefined,
      search: params?.search || undefined,
      page: params?.page || 1,
      pageSize: params?.pageSize || 20
    },
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getUserToken()
    }
  });
  return response.data as DiscussionsQueryResult;
};

// API function to get discussions by tag
export const getDiscussionsByTag = async (tag: string, page: number = 1, pageSize: number = 10): Promise<DiscussionsQueryResult> => {
  const response = await axios.get('/api/v2/community/discussions', {
    params: {
      tag,
      page,
      pageSize
    },
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getUserToken()
    }
  });
  return response.data as DiscussionsQueryResult;
};

// API function to search discussions by keyword
export const searchDiscussions = async (keyword: string, page: number = 1, pageSize: number = 10): Promise<DiscussionsQueryResult> => {
  const response = await axios.get('/api/v2/community/discussions', {
    params: {
      search: keyword,
      page,
      pageSize
    },
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getUserToken()
    }
  });
  return response.data as DiscussionsQueryResult;
};

// API function to get discussions with sorting
export const getDiscussionsWithSort = async (sortBy: string, page: number = 1, pageSize: number = 10): Promise<DiscussionsQueryResult> => {
  const response = await axios.get('/api/v2/community/discussions', {
    params: {
      sort: sortBy,
      page,
      pageSize
    },
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getUserToken()
    }
  });
  return response.data as DiscussionsQueryResult;
};

// API function to get trending discussions
export const getTrendingDiscussions = async (params?: TrendingDiscussionsParams): Promise<DiscussionDto[]> => {
  const response = await axios.get('/api/v2/community/discussions/trending', {
    params,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getUserToken()
    }
  });
  return response.data as DiscussionDto[];
};

// API function to get discussion by ID
export const getDiscussionById = async (id: string): Promise<DiscussionDetailDto> => {
  const response = await axios.get(`/api/v2/community/discussions/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getUserToken()
    }
  });
  return response.data as DiscussionDetailDto;
};

// API function to create a new discussion
export const createDiscussion = async (discussionData: CreateDiscussionRequest): Promise<DiscussionDto> => {
  const response = await axios.post('/api/v2/community/discussions', discussionData, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getUserToken()
    }
  });
  // 根据raw.ts，POST响应没有明确定义内容，只有201状态码和Location头
  // 这里返回一个模拟的DiscussionDto，实际使用时可能需要调整
  return {
    id: response.headers.location?.split('/').pop() || '',
    title: discussionData.title,
    content: discussionData.content,
    tags: discussionData.tags || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    viewCount: 0,
    replyCount: 0,
    likeCount: 0,
    isLiked: false
  } as DiscussionDto;
};

// API function to reply to a discussion
export const replyToDiscussion = async (id: string, replyData: ReplyRequest): Promise<void> => {
  await axios.post(`/api/v2/community/discussions/${id}/reply`, replyData, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getUserToken()
    }
  });
  // 根据raw.ts，POST响应没有明确定义内容，只有200状态码
};

// API function to get community tags
export const getCommunityTags = async (): Promise<string[]> => {
  const response = await axios.get('/api/v2/community/tags', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getUserToken()
    }
  });
  // 根据raw.ts中的定义，/api/v2/community/tags返回的是string[]
  return response.data as string[];
};

// 类型转换函数：将string[]转换为TagDto[]
export const convertStringsToTagDtos = (tagStrings: string[]): TagDto[] => {
  return tagStrings.map((tagName, index) => ({
    name: tagName,
    // 由于API只返回标签名称，没有计数信息，我们使用索引的倒数作为模拟的热度值
    // 热门标签排在前面，所以索引越小，热度越高
    count: tagStrings.length - index
  }));
};

// API function to get discussion replies/comments
export const getDiscussionReplies = async (discussionId: string): Promise<ReplyDto[]> => {
  const response = await axios.get(`/api/v2/community/discussions/${discussionId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getUserToken()
    }
  });
  // 根据raw.ts中的定义，DiscussionDetailDto包含replies字段
  const discussionDetail = response.data as DiscussionDetailDto;
  return discussionDetail.replies || [];
};

// API function to like or unlike a discussion
export const toggleDiscussionLike = async (id: string): Promise<void> => {
  await axios.post(`/api/v2/community/discussions/${id}/like`, {}, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getUserToken()
    }
  });
  // 根据raw.ts，POST响应没有明确定义内容，只有200状态码
};

// API function to like or unlike a reply
export const toggleReplyLike = async (id: string): Promise<void> => {
  await axios.post(`/api/v2/community/replies/${id}/like`, {}, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getUserToken()
    }
  });
  // 根据raw.ts，POST响应没有明确定义内容，只有200状态码
};