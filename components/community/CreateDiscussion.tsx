import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  Plus, 
  X,
  Hash
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createDiscussion } from '@/reqapi/community';
import { CreateDiscussionRequest } from '@/types/community/community';
import { communityPostToCreateDiscussionRequest } from '@/utils/communityTypeConverters';
import { useLanguage } from '@/lib/i18n';

interface CreateDiscussionProps {
  onBack: () => void;
  onSuccess?: () => void;
}

export const CreateDiscussion: React.FC<CreateDiscussionProps> = ({ 
  onBack, 
  onSuccess 
}) => {
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<CreateDiscussionRequest>({
    title: '',
    content: '',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');

  // 创建讨论
  const createMutation = useMutation({
    mutationFn: (data: CreateDiscussionRequest) => createDiscussion(data),
    onSuccess: () => {
      // 清空表单
      setFormData({ title: '', content: '', tags: [] });
      setTagInput('');
      
      // 刷新讨论列表
      queryClient.invalidateQueries({ queryKey: ['discussions'] });
      
      // 调用成功回调
      if (onSuccess) onSuccess();
    },
  });

  // 处理表单字段变化
  const handleFieldChange = (field: keyof CreateDiscussionRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // 添加标签
  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, trimmedTag]
      }));
      setTagInput('');
    }
  };

  // 处理标签输入的键盘事件
  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  // 移除标签
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // 处理表单提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('请填写标题和内容');
      return;
    }

    createMutation.mutate(formData);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            返回
          </Button>
          <h1 className="text-xl font-bold text-gray-900">发布新讨论</h1>
        </div>
        <Button 
          onClick={handleSubmit} 
          disabled={createMutation.isPending || !formData.title.trim() || !formData.content.trim()}
        >
          {createMutation.isPending ? '发布中...' : '发布'}
        </Button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        {/* Title */}
        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            标题
          </label>
          <Input
            id="title"
            placeholder="请输入讨论标题..."
            value={formData.title}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            className="text-lg"
          />
        </div>

        {/* Tags */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            标签
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.tags.map(tag => (
              <span 
                key={tag} 
                className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-md flex items-center gap-1"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-primary-500 hover:text-primary-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="添加标签..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleTagKeyPress}
                className="pl-10"
              />
            </div>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleAddTag}
              disabled={!tagInput.trim()}
            >
              添加
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="mb-6">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            内容
          </label>
          <textarea
            id="content"
            placeholder="分享你的想法..."
            value={formData.content}
            onChange={(e) => handleFieldChange('content', e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            rows={10}
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onBack}
          >
            取消
          </Button>
          <Button 
            type="submit" 
            disabled={createMutation.isPending || !formData.title.trim() || !formData.content.trim()}
          >
            {createMutation.isPending ? '发布中...' : '发布'}
          </Button>
        </div>
      </form>
    </div>
  );
};