import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Hash, TrendingUp } from 'lucide-react';
import { getCommunityTags, convertStringsToTagDtos } from '@/reqapi/community';
import { TagDto } from '@/types/community/community';
import { tagToCommunityTopic } from '@/utils/communityTypeConverters';

interface TagCloudProps {
  onTagClick?: (tag: string) => void;
  selectedTag?: string;
}

export const TagCloud: React.FC<TagCloudProps> = ({ 
  onTagClick, 
  selectedTag 
}) => {
  // 获取热门标签
  const { data: tagStrings = [], isLoading, error } = useQuery({
    queryKey: ['communityTags'],
    queryFn: getCommunityTags,
    staleTime: 10 * 60 * 1000, // 10分钟
  });

  // 使用类型转换函数将string[]转换为TagDto[]
  const tags = convertStringsToTagDtos(tagStrings);
  
  // 调试日志
  console.log('TagCloud - tagStrings:', tagStrings);
  console.log('TagCloud - tags:', tags);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Hash className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">热门标签</h3>
        </div>
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Hash className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">热门标签</h3>
        </div>
        <div className="text-center py-4">
          <p className="text-red-500 text-sm">加载标签时出错</p>
        </div>
      </div>
    );
  }

  // 按热度排序标签
  const sortedTags = [...tags].sort((a, b) => (b.count || 0) - (a.count || 0));
  
  // 获取最大热度值，用于计算标签大小
  const maxCount = Math.max(...sortedTags.map(tag => tag.count || 0));
  
  // 计算标签大小
  const getTagSize = (count: number = 0) => {
    const ratio = count / maxCount;
    if (ratio > 0.8) return 'text-lg font-bold';
    if (ratio > 0.6) return 'text-base font-semibold';
    if (ratio > 0.4) return 'text-sm font-medium';
    return 'text-sm';
  };

  // 获取标签颜色
  const getTagColor = (count: number = 0) => {
    const ratio = count / maxCount;
    if (ratio > 0.8) return 'text-primary-600 bg-primary-50 border-primary-200';
    if (ratio > 0.6) return 'text-primary-700 bg-primary-50 border-primary-200';
    if (ratio > 0.4) return 'text-gray-700 bg-gray-50 border-gray-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Hash className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">热门标签</h3>
        </div>
        <TrendingUp className="h-4 w-4 text-orange-500" />
      </div>
      
      {sortedTags.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {sortedTags.map((tag) => (
            <button
              key={tag.name}
              onClick={() => onTagClick && onTagClick(tag.name)}
              className={`px-3 py-1.5 rounded-full border transition-all hover:shadow-sm ${
                selectedTag === tag.name
                  ? 'bg-primary-600 text-white border-primary-600'
                  : getTagColor(tag.count)
              } ${getTagSize(tag.count)}`}
            >
              #{tag.name}
              <span className="ml-1 text-xs opacity-75">
                ({tag.count || 0})
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-500 text-sm">暂无热门标签</p>
        </div>
      )}
    </div>
  );
};