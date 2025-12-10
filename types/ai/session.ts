export type ChatSessionId = string;

export enum ChatSessionType{

  rag = "rag",
    
}

export enum AgentType{
    Summary = "Summary",
    Analyst = "Analyst",
    Editor = "Editor",
    GlobalNavigator = "GlobalNavigator",
}

export interface createChatSessionRequest{
    type: ChatSessionType|string;
    relatedId: string;
    title:string|null;
}

export interface ChatMessageRequest{
    content:string;
    agentType: AgentType|string;
    strategy: string|null;
}


export interface ChatSession{
    id: ChatSessionId;
    relatedId: string;
    title: string|null;
    type:ChatSessionType;
    createdAt: string;
    updatedAt: string;
}

export interface DeleteChatSessionRespond{
    message: '会话已删除'|string;
}

export interface ChatSessionHistory{
    message:ChatSession[];
    userId:string;
    id: ChatSessionId;
    title: string;
    type:ChatSessionType;
    relatedId: string|null;
    createdAt: string;
    updatedAt: string;

}