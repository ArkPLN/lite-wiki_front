import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  createChatSession, 
  getChatSessions, 
  getChatSessionById, 
  deleteChatSession,
  sendMessageToSession
} from '@/reqapi/ai';
import { 
  ChatSession, 
  ChatSessionHistory, 
  ChatSessionId, 
  createChatSessionRequest, 
  ChatMessageRequest, 
  DeleteChatSessionRespond 
} from '@/types/ai/session';

// 获取所有聊天会话
export const useChatSessions = () => {
  return useQuery<ChatSession[]>({
    queryKey: ['chatSessions'],
    queryFn: getChatSessions,
    staleTime: 2 * 60 * 1000, // 2分钟
  });
};

// 根据ID获取特定聊天会话详情（包含消息历史）
export const useChatSessionById = (id: ChatSessionId) => {
  return useQuery<ChatSessionHistory>({
    queryKey: ['chatSession', id],
    queryFn: () => getChatSessionById(id),
    enabled: !!id, // 只有当id存在时才执行查询
    staleTime: 1 * 60 * 1000, // 1分钟
  });
};

// 创建新的聊天会话
export const useCreateChatSession = () => {
  const queryClient = useQueryClient();
  
  return useMutation<{id: ChatSessionId}, Error, createChatSessionRequest>({
    mutationFn: createChatSession,
    onSuccess: () => {
      // 使聊天会话列表查询失效，触发重新获取
      queryClient.invalidateQueries({ queryKey: ['chatSessions'] });
    },
    onError: (error) => {
      console.error('Failed to create chat session:', error);
    }
  });
};

// 删除聊天会话
export const useDeleteChatSession = () => {
  const queryClient = useQueryClient();
  
  return useMutation<DeleteChatSessionRespond, Error, ChatSessionId>({
    mutationFn: deleteChatSession,
    onSuccess: () => {
      // 使聊天会话列表查询失效，触发重新获取
      queryClient.invalidateQueries({ queryKey: ['chatSessions'] });
    },
    onError: (error) => {
      console.error('Failed to delete chat session:', error);
    }
  });
};

// 发送消息到聊天会话（流式传输）
export const useSendMessageToSession = () => {
  return useMutation<any, Error, { id: ChatSessionId; messageRequest: ChatMessageRequest }>({
    mutationFn: ({ id, messageRequest }) => sendMessageToSession(id, messageRequest),
    onError: (error) => {
      console.error('Failed to send message to session:', error);
    }
  });
};