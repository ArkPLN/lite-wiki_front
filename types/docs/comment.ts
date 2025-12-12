import { accountData } from "../auth/user";

export interface CommentResponse{
    /**
     * 评论ID
     */
    id:string;
    /**
     * 评论内容
     */
    content:string;
    /**
     * 评论用户
     */
    user:accountData;
    createdAt: string;
    updatedAt: string;
}

export interface PostCommentRequest{
    /**
     * 评论内容
     */
    content:string;
}

export type CommentList = CommentResponse[]
