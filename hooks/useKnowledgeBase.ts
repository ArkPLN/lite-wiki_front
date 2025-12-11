import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  addDocumentToKnowledgeBase, 
  removeDocumentFromKnowledgeBase, 
  getKnowledgeBase,
  getKnowledgeBaseDocs
} from '@/reqapi/kb';
import { GetKnowledgeBaseResponse, KnowledgeBaseDocResponse, KnowledgeBaseDocList } from '@/types/kb/kb';

// 获取知识库信息
export const useKnowledgeBase = () => {
  return useQuery<GetKnowledgeBaseResponse>({
    queryKey: ['knowledgeBase'],
    queryFn: getKnowledgeBase,
    staleTime: 5 * 60 * 1000, // 5分钟
  });
};

// 获取知识库文档列表
export const useKnowledgeBaseDocs = () => {
  return useQuery<KnowledgeBaseDocList>({
    queryKey: ['knowledgeBaseDocs'],
    queryFn: getKnowledgeBaseDocs,
    staleTime: 5 * 60 * 1000, // 5分钟
  });
};

// 添加文档到知识库
export const useAddDocumentToKnowledgeBase = () => {
  const queryClient = useQueryClient();
  
  return useMutation<KnowledgeBaseDocResponse, Error, string>({
    mutationFn: (docId: string) => addDocumentToKnowledgeBase(docId),
    onSuccess: () => {
      // 使知识库查询失效，触发重新获取
      queryClient.invalidateQueries({ queryKey: ['knowledgeBase'] });
      // 使知识库文档列表查询失效，触发重新获取
      queryClient.invalidateQueries({ queryKey: ['knowledgeBaseDocs'] });
      // 也可以考虑更新文档列表相关的查询
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
    onError: (error) => {
      console.error('Failed to add document to knowledge base:', error);
    }
  });
};

// 从知识库移除文档
export const useRemoveDocumentFromKnowledgeBase = () => {
  const queryClient = useQueryClient();
  
  return useMutation<KnowledgeBaseDocResponse, Error, string>({
    mutationFn: (docId: string) => removeDocumentFromKnowledgeBase(docId),
    onSuccess: () => {
      // 使知识库查询失效，触发重新获取
      queryClient.invalidateQueries({ queryKey: ['knowledgeBase'] });
      // 使知识库文档列表查询失效，触发重新获取
      queryClient.invalidateQueries({ queryKey: ['knowledgeBaseDocs'] });
      // 也可以考虑更新文档列表相关的查询
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
    onError: (error) => {
      console.error('Failed to remove document from knowledge base:', error);
    }
  });
};