import axios from 'axios'
import {type AxiosRequestConfig} from 'axios'
import useUserStore from '@/store'
import {type createChatSessionRequest, type ChatSessionId, type ChatSession, type ChatSessionHistory, type ChatMessageRequest, type DeleteChatSessionRespond} from '@/types/ai/session'
import { create } from 'domain';
import { adaptChatSessionFromApi, adaptChatSessionHistoryFromApi } from '@/utils/chatAdapter';


// Helper function to get user token
const getUserToken = () => {
  const userState = useUserStore.getState();
  return userState.bearerToken || localStorage.getItem('token') || '';
};

export const createChatSession = async (createRequest:createChatSessionRequest) :Promise<{id:ChatSessionId}> => {

    const createdRequest:createChatSessionRequest = createRequest || {
        type:'rag',
        relatedId:'',
        title:new Date().getTime().toString()
    }
    const config:AxiosRequestConfig = {
    method:'POST',
    url:'/api/v1/chat/sessions',
    data:createdRequest,
    headers:{
      'Authorization': getUserToken()
    }
  }
  const response = await axios(config)
  return {id:response.data.id} as {id:ChatSessionId}
}

// 获取所有聊天会话历史记录
export const getChatSessions = async (): Promise<ChatSession[]> => {
  const config: AxiosRequestConfig = {
    method: 'GET',
    url: '/api/v1/chat/sessions',
    headers: {
      'Authorization': getUserToken()
    }
  }
  const response = await axios(config)
  // 使用适配器将API响应转换为前端格式
  return response.data.map((session: any) => adaptChatSessionFromApi(session))
}

// 根据ID获取特定聊天会话详情（包含消息历史）
export const getChatSessionById = async (id: ChatSessionId): Promise<ChatSessionHistory> => {
  const config: AxiosRequestConfig = {
    method: 'GET',
    url: `/api/v1/chat/sessions/${id}`,
    headers: {
      'Authorization': getUserToken()
    }
  }
  const response = await axios(config)
  // 使用适配器将API响应转换为前端格式
  return adaptChatSessionHistoryFromApi(response.data)
}

// 删除聊天会话
export const deleteChatSession = async (id: ChatSessionId): Promise<DeleteChatSessionRespond> => {
  const config: AxiosRequestConfig = {
    method: 'DELETE',
    url: `/api/v1/chat/sessions/${id}`,
    headers: {
      'Authorization': getUserToken()
    }
  }
  const response = await axios(config)
  return response.data as DeleteChatSessionRespond
}

// 发送消息到聊天会话
export const sendMessageToSession = async (id: ChatSessionId, messageRequest: ChatMessageRequest): Promise<any> => {
  // 使用fetch API来支持流式响应
  const response = await fetch(`/api/v1/chat/sessions/${id}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getUserToken()
    },
    body: JSON.stringify(messageRequest)
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  // 确保返回的响应对象具有正确的流式读取能力
  // 检查response.body是否存在且可读
  if (!response.body) {
    throw new Error('Response body is null or not readable');
  }
  
  return response;
}
