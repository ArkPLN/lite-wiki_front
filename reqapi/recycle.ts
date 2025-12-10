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