import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Flame, 
  TrendingUp, 
  MessageCircle, 
  ThumbsUp, 
  Hash,
  Search,
  Plus,
  Bot,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { getDiscussions, getCommunityTags, getTrendingDiscussions, convertStringsToTagDtos } from '@/reqapi/community';
import { DiscussionDto, DiscussionsQueryResult, TagDto } from '@/types/community/community';
import { CommunityPost } from '@/types';
import { discussionToCommunityPost, tagToCommunityTopic } from '@/utils/communityTypeConverters';
import { useLanguage } from '@/lib/i18n';

interface DiscussionListProps {
  onDiscussionClick: (discussion: CommunityPost) => void;
  onCreateNewClick: () => void;
}

export const DiscussionList: React.FC<DiscussionListProps> = ({ 
  onDiscussionClick, 
  onCreateNewClick 
}) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'trending'>('latest');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // 获取讨论列表
  const { data: discussionsData = { discussions: [] }, isLoading, error, refetch } = useQuery({
    queryKey: ['discussions', { searchQuery, selectedTag, sortBy, page }],
    queryFn: async () => {
      if (sortBy === 'trending') {
        const trendingData = await getTrendingDiscussions({ count: pageSize });
        // 将trending数据转换为DiscussionsQueryResult格式
        return {
          discussions: trendingData,
          totalCount: trendingData.length,
          page: 1,
          pageSize: pageSize,
          totalPages: 1
        } as DiscussionsQueryResult;
      } else {
        return getDiscussions({
          search: searchQuery || undefined,
          tag: selectedTag || undefined,
          sort: sortBy,
          page,
          pageSize
        });
      }
    },
    staleTime: 5 * 60 * 1000, // 5分钟
  });

  // 处理可能的响应数据结构
  const discussions = discussionsData?.discussions || [];

  // 获取热门标签
  const { data: tagStrings = [] } = useQuery({
    queryKey: ['communityTags'],
    queryFn: getCommunityTags,
    staleTime: 10 * 60 * 1000, // 10分钟
  });

  // 使用类型转换函数将string[]转换为TagDto[]
  const tags = convertStringsToTagDtos(tagStrings);

  // 处理搜索
  const handleSearch = () => {
    setPage(1);
    refetch();
  };

  // 处理标签点击
  const handleTagClick = (tag: string) => {
    setSelectedTag(tag === selectedTag ? '' : tag);
    setPage(1);
  };

  // 处理排序变化
  const handleSortChange = (newSort: 'latest' | 'popular' | 'trending') => {
    setSortBy(newSort);
    setPage(1);
  };

  // 转换讨论数据为CommunityPost
  const communityPosts: CommunityPost[] = discussions.map(discussionToCommunityPost);

  // 渲染讨论卡片
  const renderDiscussionCard = (post: CommunityPost) => (
    <div 
      key={post.id} 
      onClick={() => onDiscussionClick(post)}
      className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-primary-300 hover:shadow-md transition-all cursor-pointer group"
    >
      {/* Post Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <img src={post.author.avatar} alt={post.author.name} className="h-10 w-10 rounded-full bg-gray-100" />
          <div>
            <h4 className="font-semibold text-gray-900 text-sm group-hover:text-primary-600 transition-colors">
              {post.author.name}
            </h4>
            <p className="text-xs text-gray-500">{post.author.role} • {post.createdAt}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {post.tags.slice(0, 3).map(tag => (
            <span 
              key={tag} 
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium cursor-pointer hover:bg-primary-100 hover:text-primary-600"
              onClick={(e) => {
                e.stopPropagation();
                handleTagClick(tag);
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Post Content */}
      <h3 className="text-lg font-bold text-slate-900 mb-2 hover:text-primary-600 transition-colors">
        {post.title}
      </h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {post.content}
      </p>

      {/* AI Summary Block */}
      {post.aiSummary && (
        <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-100 flex gap-3">
          <div className="p-1.5 bg-white rounded-md h-fit shadow-sm text-purple-600">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-purple-700 uppercase tracking-wide mb-1 block">
              AI 摘要
            </span>
            <p className="text-xs text-gray-700 leading-relaxed">{post.aiSummary}</p>
          </div>
        </div>
      )}

      {/* Post Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-50 text-sm text-gray-500">
        <div className="flex gap-4">
          <button 
            className={`flex items-center gap-1.5 transition-colors z-10 ${
              post.isLiked ? 'text-blue-600 font-medium' : 'hover:text-blue-600'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              // 这里将处理点赞逻辑
            }}
          >
            <ThumbsUp className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} /> 
            {post.likes}
          </button>
          <button className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
            <MessageCircle className="h-4 w-4" /> {post.comments}
          </button>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Flame className="h-4 w-4 text-orange-500" />
            {post.hotIndex}
          </span>
          <span>{post.views} 浏览</span>
        </div>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-red-500 mb-4">加载讨论列表时出错</p>
        <Button onClick={() => refetch()}>重试</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">社区讨论</h1>
        <Button onClick={onCreateNewClick} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          发布新帖
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex gap-2 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="搜索讨论..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10"
          />
        </div>
        <Button onClick={handleSearch}>搜索</Button>
      </div>

      {/* Sort Options */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={sortBy === 'latest' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleSortChange('latest')}
        >
          最新
        </Button>
        <Button
          variant={sortBy === 'popular' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleSortChange('popular')}
        >
          热门
        </Button>
        <Button
          variant={sortBy === 'trending' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleSortChange('trending')}
        >
          趋势
        </Button>
      </div>

      {/* Popular Tags */}
      {tags.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Hash className="h-4 w-4" />
            热门标签
          </h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.name}
                onClick={() => handleTagClick(tag.name)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedTag === tag.name
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                #{tag.name} ({tag.count || 0})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Active Filters */}
      {(selectedTag || searchQuery) && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-sm text-gray-500">当前筛选:</span>
          {selectedTag && (
            <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-md flex items-center gap-1">
              #{selectedTag}
              <button
                onClick={() => {
                  setSelectedTag('');
                  setPage(1);
                }}
                className="ml-1 text-primary-500 hover:text-primary-700"
              >
                ×
              </button>
            </span>
          )}
          {searchQuery && (
            <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-md flex items-center gap-1">
              "{searchQuery}"
              <button
                onClick={() => {
                  setSearchQuery('');
                  setPage(1);
                }}
                className="ml-1 text-primary-500 hover:text-primary-700"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      )}

      {/* Discussion List */}
      {!isLoading && communityPosts.length > 0 && (
        <div className="space-y-4">
          {communityPosts.map(renderDiscussionCard)}
          
          {/* Pagination */}
          <div className="flex justify-center mt-8">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                上一页
              </Button>
              <span className="px-3 py-1 text-sm text-gray-600 flex items-center">
                第 {page} 页
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={communityPosts.length < pageSize}
                onClick={() => setPage(page + 1)}
              >
                下一页
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && communityPosts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <MessageCircle className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">暂无讨论</h3>
          <p className="text-gray-500 mb-4">
            {selectedTag || searchQuery 
              ? '没有找到匹配的讨论，请尝试其他筛选条件'
              : '成为第一个发起讨论的人吧！'
            }
          </p>
          {!selectedTag && !searchQuery && (
            <Button onClick={onCreateNewClick} className="flex items-center gap-2 mx-auto">
              <Plus className="h-4 w-4" />
              发布新帖
            </Button>
          )}
        </div>
      )}
    </div>
  );
};