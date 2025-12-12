import axios from 'axios';
import { type AxiosRequestConfig } from 'axios';
import useUserStore from '@/store';
import { KnowledgeBaseDocResponse, UpdateKnowledgeBaseConfigRequest ,KnowledgeBase, GetKnowledgeBaseResponse, KnowledgeBaseDocList} from '@/types/kb/kb';

export const addDocumentToKnowledgeBase = async (docId:string) :Promise<KnowledgeBaseDocResponse> =>{
    const requestConfig:AxiosRequestConfig= {
        method:'POST',
        url:`/api/v1/documents/${docId}/toggle-kb`,
        data:{
            enabled:true,
        },
        headers:{
            'Authorization': useUserStore.getState().bearerToken || localStorage.getItem('token') || '',
            'Content-Type':'application/json',
        },
    }
    const response = await axios(requestConfig);
    return response.data as KnowledgeBaseDocResponse;
}

export const removeDocumentFromKnowledgeBase = async (docId:string) :Promise<KnowledgeBaseDocResponse> =>{
    const requestConfig:AxiosRequestConfig= {
        method:'POST',
        url:`/api/v1/documents/${docId}/toggle-kb`,
        data:{
            enabled:false,
        },
        headers:{
            'Authorization': useUserStore.getState().bearerToken || localStorage.getItem('token') || '',
            'Content-Type':'application/json',
        },
    }
    const response = await axios(requestConfig);
    return response.data as KnowledgeBaseDocResponse;
}

export const getKnowledgeBase = async () :Promise<GetKnowledgeBaseResponse> =>{
    const requestConfig:AxiosRequestConfig= {
        method:'GET',
        url:`/api/v1/knowledge-base`,
        headers:{
            'Authorization': useUserStore.getState().bearerToken || localStorage.getItem('token') || '',
            'Content-Type':'application/json',
        },
    }
    const response = await axios(requestConfig);
    return response.data as GetKnowledgeBaseResponse;
}



export const updateKnowledgeBaseConfig = async (config:UpdateKnowledgeBaseConfigRequest) :Promise<KnowledgeBase> =>{
    const requestConfig:AxiosRequestConfig= {
        method:'PUT',
        url:`/api/v1/knowledge-base`,
        data:config,
        headers:{
            'Authorization': useUserStore.getState().bearerToken || localStorage.getItem('token') || '',
            'Content-Type':'application/json',
        },
    }
    const response = await axios(requestConfig);
    return response.data as KnowledgeBase;
}

export const getKnowledgeBaseDocs = async () :Promise<KnowledgeBaseDocList> =>{
    const requestConfig:AxiosRequestConfig= {
        method:'GET',
        url:`/api/v1/knowledge-base/documents`,
        headers:{
            'Authorization': useUserStore.getState().bearerToken || localStorage.getItem('token') || '',
            'Content-Type':'application/json',
        },
    }
    const response = await axios(requestConfig);
    return response.data as KnowledgeBaseDocList;
}

