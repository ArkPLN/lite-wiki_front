import { DiscussionDto, TagDto } from '@/types/community/community';
import { CommunityPost, CommunityTopic, Comment } from '@/types';

/**
 * 将DiscussionDto转换为CommunityPost
 */
export const discussionToCommunityPost = (discussion: DiscussionDto): CommunityPost => {
  return {
    id: discussion.id || '',
    title: discussion.title || '',
    content: discussion.content || '',
    author: {
      name: discussion.userName || 'Anonymous',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${discussion.userName || 'user'}`,
      role: 'Member'
    },
    tags: discussion.tags || [],
    likes: typeof discussion.likeCount === 'string' ? parseInt(discussion.likeCount) : (discussion.likeCount || 0),
    isLiked: discussion.isLiked || false,
    comments: typeof discussion.replyCount === 'string' ? parseInt(discussion.replyCount) : (discussion.replyCount || 0),
    createdAt: discussion.createdAt ? new Date(discussion.createdAt).toLocaleDateString() : '',
    views: typeof discussion.viewCount === 'string' ? parseInt(discussion.viewCount) : (discussion.viewCount || 0),
    hotIndex: typeof discussion.trendingScore === 'string' ? parseFloat(discussion.trendingScore) : (discussion.trendingScore || 0),
    commentsList: [], // 需要额外的API调用来获取评论
    aiSummary: '', // 可能需要额外的API调用来获取AI摘要
  };
};

/**
 * 将TagDto转换为CommunityTopic
 */
export const tagToCommunityTopic = (tag: TagDto): CommunityTopic => {
  return {
    id: tag.name,
    title: tag.name,
    description: `讨论关于${tag.name}的话题`,
    participants: tag.count || 0,
    hotIndex: tag.count || 0,
    tags: [tag.name]
  };
};

/**
 * 将CommunityPost转换为CreateDiscussionRequest
 */
export const communityPostToCreateDiscussionRequest = (post: Partial<CommunityPost>) => {
  return {
    title: post.title || '',
    content: post.content || '',
    tags: post.tags || []
  };
};

/**
 * 将API评论数据转换为Comment类型
 */
export const apiCommentToComment = (apiComment: any): Comment => {
  return {
    id: apiComment.id || '',
    author: apiComment.userName || 'Anonymous',
    content: apiComment.content || '',
    timestamp: apiComment.createdAt ? new Date(apiComment.createdAt).toLocaleDateString() : '',
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${apiComment.userName || 'user'}`
  };
};