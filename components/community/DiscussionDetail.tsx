import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  ThumbsUp, 
  MessageCircle, 
  Send, 
  Bot,
  Flag,
  Share2,
  MoreHorizontal,
  Hash
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { getDiscussionById, replyToDiscussion, toggleDiscussionLike, getDiscussionReplies } from '@/reqapi/community';
import { DiscussionDto, ReplyRequest } from '@/types/community/community';
import { CommunityPost, Comment } from '@/types';
import { discussionToCommunityPost, apiCommentToComment } from '@/utils/communityTypeConverters';
import { useLanguage } from '@/lib/i18n';

interface DiscussionDetailProps {
  discussionId: string;
  onBack: () => void;
}

export const DiscussionDetail: React.FC<DiscussionDetailProps> = ({ 
  discussionId, 
  onBack 
}) => {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState('');

  // 获取讨论详情
  const { data: discussion, isLoading, error } = useQuery({
    queryKey: ['discussion', discussionId],
    queryFn: () => getDiscussionById(discussionId),
    staleTime: 2 * 60 * 1000, // 2分钟
  });

  // 获取讨论评论
  const { data: comments = [], isLoading: commentsLoading } = useQuery({
    queryKey: ['discussionComments', discussionId],
    queryFn: () => getDiscussionReplies(discussionId),
    staleTime: 1 * 60 * 1000, // 1分钟
  });

  // 点赞/取消点赞讨论
  const likeMutation = useMutation({
    mutationFn: () => toggleDiscussionLike(discussionId),
    onSuccess: () => {
      // 重新获取讨论详情以更新点赞状态
      queryClient.invalidateQueries({ queryKey: ['discussion', discussionId] });
      // 同时更新列表中的数据
      queryClient.invalidateQueries({ queryKey: ['discussions'] });
    },
  });

  // 回复讨论
  const replyMutation = useMutation({
    mutationFn: (replyData: ReplyRequest) => replyToDiscussion(discussionId, replyData),
    onSuccess: () => {
      setNewComment('');
      // 重新获取讨论详情以获取新评论
      queryClient.invalidateQueries({ queryKey: ['discussion', discussionId] });
      // 重新获取评论列表
      queryClient.invalidateQueries({ queryKey: ['discussionComments', discussionId] });
      // 更新讨论列表中的回复数
      queryClient.invalidateQueries({ queryKey: ['discussions'] });
    },
  });

  // 处理点赞
  const handleLike = () => {
    likeMutation.mutate();
  };

  // 处理提交评论
  const handleSubmitComment = () => {
    if (!newComment.trim()) return;
    
    replyMutation.mutate({
      content: newComment.trim()
    });
  };

  // 处理举报
  const handleReport = () => {
    alert("讨论已举报给管理员。");
  };

  // 处理分享
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: discussion?.title,
        text: discussion?.content,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("链接已复制到剪贴板");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !discussion) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-red-500 mb-4">加载讨论详情时出错</p>
        <Button onClick={onBack}>返回</Button>
      </div>
    );
  }

  // 转换为CommunityPost格式
  const post = discussionToCommunityPost(discussion);

  // 转换评论数据
  const convertedComments = comments.map((comment: any) => apiCommentToComment(comment));

  // 渲染评论
  const renderComment = (comment: Comment, index: number) => (
    <div key={comment.id} className="flex gap-3">
      <img 
        src={comment.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.author}`} 
        alt={comment.author} 
        className="h-8 w-8 rounded-full bg-gray-100 flex-shrink-0" 
      />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-sm text-gray-900">{comment.author}</span>
          <span className="text-xs text-gray-500">{comment.timestamp}</span>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
          {comment.content}
        </div>
        <div className="flex items-center gap-4 mt-2">
          <button className="text-xs text-gray-500 hover:text-blue-600 flex items-center gap-1">
            <ThumbsUp className="h-3 w-3" /> 赞
          </button>
          <button className="text-xs text-gray-500 hover:text-blue-600 flex items-center gap-1">
            <MessageCircle className="h-3 w-3" /> 回复
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          返回
        </Button>
        <h1 className="text-xl font-bold text-gray-900">讨论详情</h1>
      </div>

      {/* Discussion Content */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        {/* Post Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <img src={post.author.avatar} alt={post.author.name} className="h-12 w-12 rounded-full bg-gray-100" />
            <div>
              <h4 className="font-semibold text-gray-900">{post.author.name}</h4>
              <p className="text-sm text-gray-500">{post.author.role} • {post.createdAt}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
              onClick={handleShare}
              title="分享"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <button 
              className="p-2 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
              onClick={handleReport}
              title="举报"
            >
              <Flag className="h-4 w-4" />
            </button>
            <button 
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
              title="更多"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Post Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{post.title}</h2>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map(tag => (
            <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-md font-medium">
              #{tag}
            </span>
          ))}
        </div>

        {/* Post Content */}
        <div className="prose max-w-none mb-6">
          <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
        </div>

        {/* AI Summary */}
        {post.aiSummary && (
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-100 flex gap-3">
            <div className="p-1.5 bg-white rounded-md h-fit shadow-sm text-purple-600">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-purple-700 uppercase tracking-wide mb-1 block">
                AI 摘要
              </span>
              <p className="text-sm text-gray-700 leading-relaxed">{post.aiSummary}</p>
            </div>
          </div>
        )}

        {/* Post Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <button 
              className={`flex items-center gap-2 transition-colors ${
                post.isLiked ? 'text-blue-600 font-medium' : 'text-gray-500 hover:text-blue-600'
              }`}
              onClick={handleLike}
              disabled={likeMutation.isPending}
            >
              <ThumbsUp className={`h-5 w-5 ${post.isLiked ? 'fill-current' : ''}`} />
              {likeMutation.isPending ? '...' : post.likes}
            </button>
            <div className="flex items-center gap-2 text-gray-500">
              <MessageCircle className="h-5 w-5" />
              {post.comments} 回复
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Hash className="h-4 w-4 text-orange-500" />
              {post.hotIndex}
            </span>
            <span>{post.views} 浏览</span>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          回复 ({post.comments})
        </h3>

        {/* Add Comment */}
        <div className="mb-6">
          <div className="flex gap-3">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=currentuser" 
              alt="当前用户" 
              className="h-8 w-8 rounded-full bg-gray-100 flex-shrink-0" 
            />
            <div className="flex-1">
              <textarea
                placeholder="分享你的想法..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={3}
              />
              <div className="flex justify-end mt-2">
                <Button 
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim() || replyMutation.isPending}
                  className="flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  {replyMutation.isPending ? '发布中...' : '发布回复'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Comments List */}
        {commentsLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
          </div>
        ) : convertedComments && convertedComments.length > 0 ? (
          <div className="space-y-4">
            {convertedComments.map((comment, index) => renderComment(comment, index))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">暂无回复，来做第一个回复的人吧！</p>
          </div>
        )}

        {/* No Comments */}
        {(!post.commentsList || post.commentsList.length === 0) && (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p>还没有回复，成为第一个回复的人吧！</p>
          </div>
        )}
      </div>
    </div>
  );
};