import axios from 'axios';
import useUserStore from '@/store';
import { CommentList, CommentResponse, PostCommentRequest } from '@/types/docs/comment';

// Helper function to get user token
const getUserToken = () => {
  const userState = useUserStore.getState();
  return userState.bearerToken || localStorage.getItem('token') || '';
};

// API function to get comments for a specific document
export const getDocumentComments = async (documentId: string): Promise<CommentList> => {
  const response = await axios.get(`/api/v1/documents/${documentId}/comments`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getUserToken()
    }
  });
  return response.data as CommentList;
};

// API function to post a comment to a specific document
export const postDocumentComment = async (documentId: string, commentData: PostCommentRequest): Promise<CommentResponse> => {
  const response = await axios.post(`/api/v1/documents/${documentId}/comments`, commentData, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getUserToken()
    }
  });
  return response.data as CommentResponse;
};

