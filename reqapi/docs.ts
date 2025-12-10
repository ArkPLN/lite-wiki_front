import { DocumentsList, Document } from "@/types/docs/doc";
import axios, { AxiosRequestConfig } from "axios";
import useUserStore from "@/store";

// Helper function to get user token
const getUserToken = () => {
  const userState = useUserStore.getState();
  return userState.bearerToken || localStorage.getItem('token') || '';
};

// API function to get documents list from server
export const getDocumentsList = async (): Promise<DocumentsList> => {
  const response = await axios.get('/api/v1/documents', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getUserToken()
    }
  });
  return response.data.items || {} as DocumentsList; // Extract items array from DocumentsList response
};

// API function to get document by ID
export const getDocumentById = async (documentId: string): Promise<Document> => {
  const response = await axios.get<Document>(`/api/v1/documents/${documentId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getUserToken()
    }
  });
  return response.data as Document;
};

// API function to upload file to server
export const uploadFile = async(file:File):Promise<Document> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axios.post<Document>('/api/v1/documents/upload', formData, {
    headers: {
      'Authorization': getUserToken()
    }
  });
  return response.data as Document;
}
