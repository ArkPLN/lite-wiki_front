import { create } from 'zustand';
import { ChatSession, AIMessage, ChatSessionId } from '@/types/ai/session';

interface ChatState {
  // 当前活跃的会话ID
  activeSessionId: ChatSessionId | null;
  // 当前会话的消息列表
  currentMessages: AIMessage[];
  // 是否正在接收AI响应
  isReceivingResponse: boolean;
  // 当前正在接收的AI响应内容（用于流式显示）
  streamingContent: string;
  // 设置活跃会话
  setActiveSessionId: (sessionId: ChatSessionId | null) => void;
  // 设置当前消息列表
  setCurrentMessages: (messages: AIMessage[]) => void;
  // 添加用户消息
  addUserMessage: (content: string) => void;
  // 添加AI消息
  addAiMessage: (content: string) => void;
  // 设置接收响应状态
  setReceivingResponse: (isReceiving: boolean) => void;
  // 更新流式内容
  updateStreamingContent: (content: string) => void;
  // 追加流式内容
  appendStreamingContent: (content: string) => void;
  // 完成流式响应，将内容添加到AI消息中
  completeStreamingResponse: () => void;
  // 清空当前会话
  clearCurrentSession: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  activeSessionId: null,
  currentMessages: [],
  isReceivingResponse: false,
  streamingContent: '',
  
  setActiveSessionId: (sessionId) => set({ activeSessionId: sessionId }),
  
  setCurrentMessages: (messages) => set({ currentMessages: messages || [] }),
  
  addUserMessage: (content) => set((state) => ({
    currentMessages: [
      ...(state.currentMessages || []),
      {
        id: Date.now().toString(),
        role: 'user',
        content,
        timestamp: new Date(),
      }
    ]
  })),
  
  addAiMessage: (content) => set((state) => ({
    currentMessages: [
      ...(state.currentMessages || []),
      {
        id: Date.now().toString(),
        role: 'ai',
        content,
        timestamp: new Date(),
      }
    ]
  })),
  
  setReceivingResponse: (isReceiving) => set({ isReceivingResponse: isReceiving }),
  
  updateStreamingContent: (content) => set({ streamingContent: content }),
  
  appendStreamingContent: (content) => set((state) => ({ 
    streamingContent: state.streamingContent + content 
  })),
  
  completeStreamingResponse: () => {
    const { streamingContent } = get();
    if (streamingContent.trim()) {
      set((state) => ({
        currentMessages: [
          ...(state.currentMessages || []),
          {
            id: Date.now().toString(),
            role: 'ai',
            content: streamingContent,
            timestamp: new Date(),
          }
        ],
        streamingContent: '',
      }));
    }
  },
  
  clearCurrentSession: () => set({
    currentMessages: [],
    streamingContent: '',
    isReceivingResponse: false,
  }),
}));