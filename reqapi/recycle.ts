import axios from "axios";
import { type AxiosRequestConfig } from "axios";
import { MoveToRecycleBinResponse, RecycleBinList, RestoreDocumentResponse, DeleteDocumentResponse } from "@/types/docs/doc";

import useUserStore from '@/store';

/**
 * Delete a document from the document section
 * @param id The ID of the document to delete
 * @returns A promise that resolves to a MoveToRecycleBinResponse object
 */
export const deleteFile = async (id:string): Promise<MoveToRecycleBinResponse> =>{
    const userState = useUserStore.getState();
    const requestConfig:AxiosRequestConfig = {
        method:'DELETE',
        url:`/api/v1/documents/${id}`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': useUserStore.getState().bearerToken || localStorage.getItem('token') || ''
        }
    }
    const response = await axios(requestConfig);
    return response.data as MoveToRecycleBinResponse;
}

/**
 * Get the list of documents in the recycle bin
 * @returns A promise that resolves to a RecycleBinList object
 */
export const getRecycleBin = async (): Promise<RecycleBinList> =>{
    const requestConfig:AxiosRequestConfig = {
        method:'GET',
        url:`/api/v1/documents/recycle-bin`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': useUserStore.getState().bearerToken || localStorage.getItem('token') || ''
        }
    }
    const response = await axios(requestConfig);
    return response.data as RecycleBinList;
}



/**
 * Restore a document from the recycle bin
 * @param id The ID of the document to restore
 * @returns A promise that resolves to a RestoreDocumentResponse object
 */
export const restoreFromRecycleBinById = async (id:string): Promise<RestoreDocumentResponse> =>{
    const requestConfig:AxiosRequestConfig = {
        method:'POST',
        url:`/api/v1/documents/${id}/restore`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': useUserStore.getState().bearerToken || localStorage.getItem('token') || ''
        }
    }
    const response = await axios(requestConfig);
    return response.data as RestoreDocumentResponse;
}

/**
 * Permanently delete a document from the recycle bin
 * @param id The ID of the document to delete
 * @returns A promise that resolves to a DeleteDocumentResponse object
 */
export const removeFromRecycleBinById = async (id:string): Promise<DeleteDocumentResponse> =>{
    const requestConfig:AxiosRequestConfig = {
        method:'DELETE',
        url:`/api/v1/documents/${id}/permanent`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': useUserStore.getState().bearerToken || localStorage.getItem('token') || ''
        }
    }
    const response = await axios(requestConfig);
    return response.data as DeleteDocumentResponse;
    
}

/**
 * Empty the recycle bin - permanently delete all documents
 * This function gets all documents in the recycle bin and deletes them one by one
 * @returns A promise that resolves to a response object with message and count
 */
export const emptyRecycleBin = async (): Promise<{message: string, count: number}> => {
    try {
        // First, get all documents in the recycle bin
        const recycleBinItems = await getRecycleBin();
        
        if (!recycleBinItems || recycleBinItems.length === 0) {
            return { message: "回收站已经是空的", count: 0 };
        }
        
        // Delete each document one by one
        let deletedCount = 0;
        for (const item of recycleBinItems) {
            try {
                await removeFromRecycleBinById(item.id);
                deletedCount++;
            } catch (error) {
                console.error(`Failed to delete document ${item.id}:`, error);
                // Continue with other documents even if one fails
            }
        }
        
        return { 
            message: `成功永久删除了 ${deletedCount} 个文件`, 
            count: deletedCount 
        };
    } catch (error) {
        console.error('Failed to empty recycle bin:', error);
        throw new Error('清空回收站失败');
    }
}