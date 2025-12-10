
import React from 'react';

export type VersionState = 'working' | 'locked' | 'archived' | 'deprecated';

export interface FileVersion {
  id: string;
  version: string;
  state: VersionState;
  updatedAt: string;
  author: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string; // Added to support phone registration
  avatar?: string;
  role: 'admin' | 'user' | 'team_leader';
}

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

export enum AuthView {
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER'
}

export interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

// File System Types
export type FileType = 'folder' | 'markdown' | 'text';

export interface FileNode {
  id: string;
  name: string;
  type: FileType;
  children?: FileNode[];
  content?: string; // For files
  parentId?: string | null;
  tags?: string[]; // Added tags support
  // Versioning
  currentVersion?: string;
  versions?: FileVersion[];
  // Knowledge Base
  inKnowledgeBase?: boolean;
}

// Generic Dashboard Item for Favorites/Recent/Trash
export interface DashboardItem {
  id: string;
  name: string;
  type: FileType;
  location: string;
  date: string; // Generic date field (addedAt, accessedAt, deletedAt)
  isoDate?: string; // Added for precise date filtering (YYYY-MM-DD)
  tags: string[];
  meta?: any; // For trash daysLeft etc
}

// AI Types
export type AIMode = 'viewer' | 'editor';

export interface AIMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string; // ISO string
  avatar?: string;
  attachments?: string[];
}

// Team Types
export interface TeamPost {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  tags: string[];
  likes: number;
  isLiked?: boolean; // Track if current user liked the post
  comments: number;
  commentsList?: Comment[]; // Added comments list
  createdAt: string;
  attachments?: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'team_leader' | 'admin' | 'member' | 'viewer';
  avatar: string;
  joinedAt: string;
  status: 'online' | 'offline' | 'busy' | 'frozen';
  phone?: string;
  bio?: string;
}

// Community Types
export interface CommunityTopic {
  id: string;
  title: string;
  description: string;
  participants: number;
  hotIndex: number;
  tags: string[];
}

export interface CommunityTrendMember {
  id: string;
  name: string;
  avatar: string;
  contributionScore: number;
  rank: number;
  trend: 'up' | 'down' | 'stable';
}

export interface CommunityPost extends TeamPost {
  aiSummary?: string; // AI Summary content
  views: number;
  hotIndex: number;
}

// Notification Types
export type NotificationType = 'info' | 'warning' | 'error' | 'system';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}