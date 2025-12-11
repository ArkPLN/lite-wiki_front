import { ChatSession, ChatSessionHistory, ChatMessageRequest, AIMessage, ChatSessionType } from '@/types/ai/session';

// API响应的会话数据接口
interface ApiChatSession {
  id: string;
  relatedId: string;
  title: string | null;
  type: ChatSessionType | string;
  createdAt: string;
  updatedAt: string;
}

// API响应的会话历史数据接口
interface ApiChatSessionHistory {
  id: string;
  title: string;
  type: ChatSessionType | string;
  relatedId: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
  messages?: ApiChatMessage[];
}

// API响应的消息数据接口
interface ApiChatMessage {
  id: string;
  role: string;
  content: string;
  createdAt: string;
}

// 从API响应转换为前端ChatSession类型
export const adaptChatSessionFromApi = (apiSession: ApiChatSession): ChatSession => {
  return {
    id: apiSession.id || '',
    relatedId: apiSession.relatedId || '',
    title: apiSession.title || null,
    type: (apiSession.type as ChatSessionType) || ChatSessionType.rag,
    createdAt: apiSession.createdAt || new Date().toISOString(),
    updatedAt: apiSession.updatedAt || new Date().toISOString(),
  };
};

// 从API响应转换为前端ChatSessionHistory类型
export const adaptChatSessionHistoryFromApi = (apiSessionHistory: ApiChatSessionHistory): ChatSessionHistory => {
  return {
    id: apiSessionHistory.id || '',
    title: apiSessionHistory.title || '',
    type: (apiSessionHistory.type as ChatSessionType) || ChatSessionType.rag,
    relatedId: apiSessionHistory.relatedId || null,
    userId: apiSessionHistory.userId || '',
    createdAt: apiSessionHistory.createdAt || new Date().toISOString(),
    updatedAt: apiSessionHistory.updatedAt || new Date().toISOString(),
    message: apiSessionHistory.messages ? apiSessionHistory.messages.map(adaptMessageFromApi) : [],
  };
};

// 从API响应转换为前端AIMessage类型
export const adaptMessageFromApi = (apiMessage: ApiChatMessage): AIMessage => {
  return {
    id: apiMessage.id || '',
    role: apiMessage.role?.toLowerCase() === 'user' ? 'user' : 'ai',
    content: apiMessage.content || '',
    timestamp: new Date(apiMessage.createdAt || new Date()),
  };
};

// 将前端AIMessage转换为API请求格式
export const adaptMessageToApi = (message: string, agentType: string = 'Analyst'): ChatMessageRequest => {
  return {
    content: message,
    agentType: agentType,
    strategy: null, // 根据需求设置策略
  };
};

// 处理事件流数据，将流式响应转换为可显示的消息
export const processEventStream = async (
  response: any, 
  onChunk?: (text: string) => void
): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    if (!response) {
      reject(new Error('Response is null or undefined'));
      return;
    }

    let result = '';
    let isResolved = false;
    
    // 防止多次调用resolve或reject
    const finalResolve = (value: string) => {
      if (!isResolved) {
        isResolved = true;
        resolve(value);
      }
    };
    
    const finalReject = (error: Error) => {
      if (!isResolved) {
        isResolved = true;
        reject(error);
      }
    };
    
    try {
      // 检查是否是浏览器环境的fetch响应
      if (response.body && typeof response.body.getReader === 'function') {
        // 浏览器环境，使用fetch API的ReadableStream
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunkStr = decoder.decode(value, { stream: true });
            // 处理事件流格式 (data: ...)
            const lines = chunkStr.split('\n');
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.substring(6);
                if (data.trim() === '[DONE]') {
                  finalResolve(result);
                  return;
                }
                try {
                  const parsed = JSON.parse(data) as { text?: string };
                  if (parsed.text) {
                    result += parsed.text;
                    // 实时回调，逐字更新
                    if (onChunk) {
                      onChunk(parsed.text);
                    }
                  }
                } catch (e) {
                  // 忽略解析错误，继续处理下一行
                  console.warn('Failed to parse stream data:', line);
                }
              }
            }
          }
          finalResolve(result);
        } catch (error) {
          finalReject(error as Error);
        } finally {
          reader.releaseLock();
        }
      } else if (typeof response.on === 'function') {
        // Node.js环境，使用传统流API
        response.on('data', (chunk: Buffer) => {
          const chunkStr = chunk.toString('utf8');
          // 处理事件流格式 (data: ...)
          const lines = chunkStr.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.substring(6);
              if (data.trim() === '[DONE]') {
                finalResolve(result);
                return;
              }
              try {
                const parsed = JSON.parse(data) as { text?: string };
                if (parsed.text) {
                  result += parsed.text;
                  // 实时回调，逐字更新
                  if (onChunk) {
                    onChunk(parsed.text);
                  }
                }
              } catch (e) {
                // 忽略解析错误，继续处理下一行
                console.warn('Failed to parse stream data:', line);
              }
            }
          }
        });
        
        response.on('end', () => {
          finalResolve(result);
        });
        
        response.on('error', (error: Error) => {
          finalReject(error);
        });
      } else {
        finalReject(new Error('Unsupported response type for streaming'));
      }
    } catch (error) {
      finalReject(new Error(`Failed to process stream: ${error}`));
    }
  });
};