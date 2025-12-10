import { accountData as UserAuthor } from '@/types/auth/user';



export type DocumentType = 'text/markdown' | 'text/plain' | string;


/**
 * Document is the base interface for all types of documents.
 */

export interface Document {
    
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  summary: string | null;
  content: string | null;
  tags: string[];
  inKnowledgeBase: boolean; 
  isPublic: boolean;
  folderId: string | null;
  teamId: string | null;
  author: UserAuthor;
  createdAt: string;
  updatedAt: string;
}

/**
 * CreateDocumentRequest is the request body for creating a document.
 */
export interface CreateDocumentRequest {
  name: string,
  content: string,
  type: DocumentType,
  folderId: string | null,
  teamId: string | null
}

export interface ModifyDocumentRequest {
  
  name: string
  content: string | null,
  isPublic: boolean | null,
  folderId: string | null
}




export interface DocumentsList{
    items: Document[];
    totalCount: number;
    pageSize: number;
    totalPages: number;
}

export type favoriteMessageRespond = 'Document added to favorites' | 'Document removed from favorites' | string

export interface FavoriteResponse {
  message: favoriteMessageRespond;
}


// 回收站相关API 接口定义
export type RecycleBinList = Document[]


export interface MoveToRecycleBinResponse {
  message: "Document moved to recycle bin successfully"|string;
}

export interface RestoreDocumentResponse {
  message: "Document restored successfully"|string;
}


export interface DeleteDocumentResponse {
  message: "Document permanently deleted"|string;
}
