import { Document } from '@/types/docs/doc';
import { DashboardItem, FileNode } from '@/types';

/**
 * 递归查找文件节点路径
 * @param nodes 文件节点数组
 * @param folderId 要查找的文件夹ID
 * @param currentPath 当前路径
 * @returns 完整路径
 */
const findFolderPath = (nodes: FileNode[] | null, folderId: string | null, currentPath: string = ''): string => {
  if (!nodes || !folderId) return '/';
  
  for (const node of nodes) {
    if (node.id === folderId) {
      return `${currentPath}/${node.name}`;
    }
    
    if (node.children && node.children.length > 0) {
      const childPath = findFolderPath(node.children, folderId, `${currentPath}/${node.name}`);
      if (childPath !== '/') {
        return childPath;
      }
    }
  }
  
  return '/';
};

/**
 * 将Document类型转换为DashboardItem类型
 * @param document 文档对象
 * @param fileNodes 文件节点数组，用于构建完整路径
 * @returns DashboardItem对象
 */
export const documentToDashboardItem = (document: Document, fileNodes: FileNode[] | null = null): DashboardItem => {
  // 计算删除日期和剩余天数
  const deletedDate = new Date(document.updatedAt);
  const now = new Date();
  const daysSinceDeleted = Math.floor((now.getTime() - deletedDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysLeft = Math.max(0, 30 - daysSinceDeleted); // 假设30天后永久删除
  
  // 格式化日期显示
  let dateDisplay = '';
  if (daysSinceDeleted === 0) {
    dateDisplay = 'Today';
  } else if (daysSinceDeleted === 1) {
    dateDisplay = 'Yesterday';
  } else if (daysSinceDeleted < 7) {
    dateDisplay = `${daysSinceDeleted} days ago`;
  } else if (daysSinceDeleted < 30) {
    const weeks = Math.floor(daysSinceDeleted / 7);
    dateDisplay = `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  } else {
    dateDisplay = deletedDate.toLocaleDateString();
  }

  // 确定文件类型
  const fileType = document.type.includes('markdown') ? 'markdown' : 
                   document.type.includes('text') ? 'text' : 'folder';

  // 获取完整路径
  const location = findFolderPath(fileNodes, document.folderId);

  return {
    id: document.id,
    name: document.name,
    type: fileType,
    location,
    date: dateDisplay,
    isoDate: deletedDate.toISOString().split('T')[0],
    tags: document.tags,
    meta: { 
      daysLeft,
      documentId: document.id,
      folderId: document.folderId
    }
  };
};