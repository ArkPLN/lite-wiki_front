import { accountData } from "@/types/auth/user";
import { Document } from "@/types/docs/doc";

export interface KnowledgeBase{
    id:string;
    name:string;
    description:string;
    owner:accountData;
    isPublic: boolean;
    settings:any|null;
    documentCount:string;
    createdAt: string;
    updatedAt: string;
}
    
export interface UpdateKnowledgeBaseConfigRequest{
    name:string|null;
    description:string|null;
    isPublic: boolean|null;
    settings:any|null;
}

export interface KnowledgeBaseDoc{
    id:string;
    knowledgeBaseId:string;
    // 文档信息
    document:Document;
    // 文档添加人
    addedBy:accountData;
    // 文档添加时间
    addedAt: string;
}
export type KnowledgeBaseDocList = KnowledgeBaseDoc[]