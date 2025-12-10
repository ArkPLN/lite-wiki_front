import {type AxiosResponse } from 'axios';
import axios from 'axios';
import useUserStore from '@/store';
import { Document, FavoriteResponse } from "@/types/docs/doc";


// Helper function to get user token
const getUserToken = () => {
  const userState = useUserStore.getState();
  return userState.bearerToken || localStorage.getItem('token') || '';
};

/**
 * Fetch user's favorite documents
 * @returns A promise that resolves to an array of favorite documents
 */


export const getFavorites = async (): Promise<Document[]> => {
  const response = await axios.get('/api/v1/documents/favorites', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getUserToken()
    }
  });
  return response.data || []; // Extract items array from Favorites response
};

/**
 * Add or remove a document from user's favorites
 * @param documentId - The ID of the document to favorite/unfavorite
 * @returns A promise that resolves to a FavoriteResponse object ,
 * which contains a message indicating the favor or unfavor operation
 */


export const postFavoriteById = async (documentId: string): Promise<FavoriteResponse> => {
  const response = await axios.post(`/api/v1/documents/${documentId}/favorite`, {}, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getUserToken()
    }
  });
  return response.data as FavoriteResponse; // Extract document from response
};