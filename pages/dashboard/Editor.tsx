import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { 
  Folder, 
  FileText, 
  ChevronRight, 
  ChevronDown, 
  Plus, 
  MoreVertical,
  Bot,
  MessageSquare,
  X,
  Send,
  Sparkles,
  PenTool,
  Save,
  Download,
  Trash2,
  Edit2,
  FilePlus,
  FolderPlus,
  Clock,
  Archive,
  Lock,
  AlertOctagon,
  CheckCircle2,
  History,
  ListChecks,
  Bold,
  Italic,
  List,
  CheckSquare,
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Table,
  Paperclip,
  Smile,
  Share2, 
  Copy, 
  Calendar, 
  Shield, 
  Check,
  UploadCloud,
  Database
} from 'lucide-react';
import { useBlocker } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { FileNode, FileType, AIMode, AIMessage, FileVersion, VersionState } from '../../types';
import { useLanguage } from '@/lib/i18n';
import { Button } from '../../components/ui/Button';
import { MOCK_USER } from '../../constants';
import useUserStore from '@/store';
import { CreateDocumentRequest, Document, ModifyDocumentRequest } from '@/types/docs/doc';
import { getDocumentComments, postDocumentComment } from '@/reqapi/comment';
import { CommentList, CommentResponse, PostCommentRequest } from '@/types/docs/comment';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { getDocumentsList, getDocumentById, uploadFile } from '@/reqapi/docs';
import { deleteFile } from '@/reqapi/recycle';
import { addDocumentToKnowledgeBase, removeDocumentFromKnowledgeBase } from '@/reqapi/kb';
import { debounce } from '@/utils/debounce';
import { CircularProgress } from '@mui/material';

// Import MdEditorRt components
import { MdEditor } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import { ExportPDF } from '@vavt/rt-extension';
// All CSS for this extension library
import '@vavt/rt-extension/lib/asset/style.css';
import { queryClient } from '@/lib/queryClient';

// --- MOCK DATA ---
const INITIAL_VERSIONS: FileVersion[] = [
  { id: 'v3', version: 'V1.2', state: 'working', updatedAt: 'Just now', author: 'You' },
  { id: 'v2', version: 'V1.1', state: 'locked', updatedAt: '2 days ago', author: 'Sarah' },
  { id: 'v1', version: 'V1.0', state: 'archived', updatedAt: '1 week ago', author: 'You' },
];

// Mock History Data for AI
const MOCK_AI_HISTORY = [
  { id: 'h1', title: 'Summarize Document', date: '2 hours ago', mode: 'viewer' as const, preview: 'Can you summarize the key points of the introduction?' },
  { id: 'h2', title: 'Fix Grammar & Style', date: 'Yesterday', mode: 'editor' as const, preview: 'Please check for grammar errors and improve the tone.' },
  { id: 'h3', title: 'React Hooks Explanation', date: '2 days ago', mode: 'viewer' as const, preview: 'What is the difference between useEffect and useLayoutEffect?' },
  { id: 'h4', title: 'Unit Test Generation', date: '3 days ago', mode: 'editor' as const, preview: 'Generate unit tests for the calculateTotal function.' },
];

// --- HELPER: Recursive Tree Operations ---
const createNodeRecursive = (nodes: FileNode[], parentId: string | null, newNode: FileNode): FileNode[] => {
  if (parentId === null) {
    return [...nodes, newNode];
  }
  return nodes.map(node => {
    if (node.id === parentId) {
      return { ...node, children: [...(node.children || []), newNode] };
    }
    if (node.children) {
      return { ...node, children: createNodeRecursive(node.children, parentId, newNode) };
    }
    return node;
  });
};

const deleteNodeRecursive = (nodes: FileNode[], id: string): FileNode[] => {
  return nodes
    .filter(node => node.id !== id)
    .map(node => ({
      ...node,
      children: node.children ? deleteNodeRecursive(node.children, id) : undefined
    }));
};

// Batch delete recursive
const batchDeleteRecursive = (nodes: FileNode[], idsToDelete: Set<string>): FileNode[] => {
  return nodes
    .filter(node => !idsToDelete.has(node.id))
    .map(node => ({
      ...node,
      children: node.children ? batchDeleteRecursive(node.children, idsToDelete) : undefined
    }));
};

const renameNodeRecursive = (nodes: FileNode[], id: string, newName: string): FileNode[] => {
  return nodes.map(node => {
    if (node.id === id) {
      return { ...node, name: newName };
    }
    if (node.children) {
      return { ...node, children: renameNodeRecursive(node.children, id, newName) };
    }
    return node;
  });
};

const findNodeById = (nodes: FileNode[], id: string): FileNode | null => {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
};

// Helper function to merge file nodes from server with existing files
const mergeFileNodes = (existingFiles: FileNode[], serverFiles: FileNode[]): FileNode[] => {
  // Create a map of existing files for quick lookup
  const existingFileMap = new Map<string, FileNode>();
  
  // Helper function to add file to map recursively
  const addToMap = (files: FileNode[], map: Map<string, FileNode>) => {
    files.forEach(file => {
      map.set(file.id, file);
      if (file.children && file.children.length > 0) {
        addToMap(file.children, map);
      }
    });
  };
  
  addToMap(existingFiles, existingFileMap);
  
  // Helper function to create a new array with updated/added files
  const updateFileList = (serverFiles: FileNode[]): FileNode[] => {
    return serverFiles.map(serverFile => {
      const existingFile = existingFileMap.get(serverFile.id);
      
      if (existingFile) {
        // Update existing file with server data
        return {
          ...serverFile,
          children: existingFile.children, // Preserve children (especially for uploaded files)
          content: existingFile.content || serverFile.content // Keep existing content if available
        };
      } else {
        // Add new file from server
        return serverFile;
      }
    });
  };
  
  // Add server files and merge
  const updatedFiles = updateFileList(serverFiles);
  
  // Add any existing files that don't exist in server (uploaded files)
  const finalFiles = [...updatedFiles];
  
  existingFiles.forEach(existingFile => {
    if (!serverFiles.find(serverFile => serverFile.id === existingFile.id)) {
      finalFiles.push(existingFile);
    }
  });
  
  return finalFiles;
};

// --- COMPONENT: Version Badge ---
const VersionBadge: React.FC<{ currentVersion?: string; versions?: FileVersion[] }> = ({ currentVersion, versions }) => {
  const [showHistory, setShowHistory] = useState(false);
  const { t } = useLanguage();

  if (!currentVersion || !versions) return null;

  const getStateIcon = (state: VersionState) => {
    switch(state) {
      case 'working': return <CheckCircle2 className="h-3 w-3 text-green-600" />;
      case 'locked': return <Lock className="h-3 w-3 text-orange-500" />;
      case 'archived': return <Archive className="h-3 w-3 text-blue-500" />;
      case 'deprecated': return <AlertOctagon className="h-3 w-3 text-red-500" />;
    }
  };

  const getStateLabel = (state: VersionState) => {
    switch(state) {
      case 'working': return t.common.stateWorking;
      case 'locked': return t.common.stateLocked;
      case 'archived': return t.common.stateArchived;
      case 'deprecated': return t.common.stateDeprecated;
    }
  };

  const getStateColor = (state: VersionState) => {
     switch(state) {
      case 'working': return 'bg-green-50 text-green-700 border-green-100';
      case 'locked': return 'bg-orange-50 text-orange-700 border-orange-100';
      case 'archived': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'deprecated': return 'bg-red-50 text-red-700 border-red-100';
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setShowHistory(!showHistory)}
        className="flex items-center gap-1.5 px-2.5 py-0.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-full text-xs font-bold transition-colors"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
        {currentVersion}
        <ChevronDown className="h-3 w-3 opacity-50" />
      </button>

      {showHistory && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowHistory(false)}></div>
          <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-fade-in-up">
            <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t.common.versionHistory}</span>
              <History className="h-3 w-3 text-gray-400" />
            </div>
            <div className="max-h-64 overflow-y-auto">
              {versions.map((ver) => (
                <div key={ver.id} className="px-4 py-3 hover:bg-gray-50 flex items-center justify-between cursor-pointer border-b border-gray-50 last:border-0 group transition-colors">
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-bold font-mono ${ver.version === currentVersion ? 'text-primary-600' : 'text-gray-700'}`}>
                      {ver.version}
                    </span>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border ${getStateColor(ver.state)}`}>
                          {getStateIcon(ver.state)}
                          {getStateLabel(ver.state)}
                        </span>
                        {ver.version === currentVersion && (
                           <span className="text-[10px] text-gray-400 italic">(Current)</span>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-400 mt-0.5">Updated {ver.updatedAt} by {ver.author}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-center">
               <button className="text-xs text-primary-600 font-medium hover:text-primary-700">View all versions</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// --- COMPONENT: File Tree Item ---
interface FileTreeItemProps { 
  node: FileNode; 
  level: number; 
  activeId: string | null; 
  expandedIds: Set<string>;
  onToggle: (id: string) => void;
  onSelect: (node: FileNode) => void | Promise<void>;
  onCreate: (parentId: string, type: FileType) => void;
  onRename: (id: string, currentName: string) => void;
  onDelete: (id: string) => void;
  isBatchMode?: boolean;
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string) => void;
  isDeleting?: boolean;
}

const FileTreeItem: React.FC<FileTreeItemProps> = ({ 
  node, 
  level, 
  activeId, 
  expandedIds,
  onToggle,
  onSelect,
  onCreate,
  onRename,
  onDelete,
  isBatchMode,
  selectedIds,
  onToggleSelect,
  isDeleting
}) => {
  const isOpen = expandedIds.has(node.id);
  const isActive = activeId === node.id;
  const isFolder = node.type === 'folder';

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFolder) {
      onToggle(node.id);
    } else {
      const result = onSelect(node);
      if (result instanceof Promise) {
        await result;
      }
    }
  };

  return (
    <div>
      <div 
        onClick={handleClick}
        className={`group flex items-center gap-2 py-1.5 px-2 rounded-md cursor-pointer transition-colors text-sm relative ${
          isActive ? 'bg-primary-100 text-primary-700 font-medium' : 'text-gray-600 hover:bg-gray-100'
        }`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        {/* Batch Mode Checkbox */}
        {isBatchMode && (
          <div onClick={(e) => e.stopPropagation()} className="flex-shrink-0">
             <input 
               type="checkbox" 
               checked={selectedIds?.has(node.id)}
               onChange={(e) => { e.stopPropagation(); onToggleSelect?.(node.id); }}
               className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
             />
          </div>
        )}

        <span className="text-gray-400 flex-shrink-0">
          {isFolder && (
            isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
          )}
          {!isFolder && <span className="w-4" />} 
        </span>
        <span className={`text-opacity-80 flex-shrink-0 ${isFolder ? 'text-blue-500' : 'text-gray-500'}`}>
          {isFolder ? <Folder className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
        </span>
        <span className="truncate flex-1 mr-12">{node.name}</span>
        
        {/* Hover Actions (Disabled in Batch Mode) */}
        {!isBatchMode && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-1 bg-white/90 shadow-sm rounded-md px-1 py-0.5 z-10">
            {isFolder && (
              <>
                <button 
                  onClick={(e) => { e.stopPropagation(); onCreate(node.id, 'folder'); }}
                  className="p-1 hover:bg-gray-200 rounded text-gray-500 hover:text-blue-600"
                  title="New Folder"
                >
                  <FolderPlus className="h-3 w-3" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onCreate(node.id, 'markdown'); }}
                  className="p-1 hover:bg-gray-200 rounded text-gray-500 hover:text-blue-600"
                  title="New File"
                >
                  <FilePlus className="h-3 w-3" />
                </button>
              </>
            )}
            <button 
              onClick={(e) => { e.stopPropagation(); onRename(node.id, node.name); }}
              className="p-1 hover:bg-gray-200 rounded text-gray-500 hover:text-orange-600"
              title="Rename"
            >
              <Edit2 className="h-3 w-3" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(node.id); }}
              className="p-1 hover:bg-gray-200 rounded text-gray-500 hover:text-red-600 disabled:text-gray-300 disabled:cursor-not-allowed"
              title="Delete"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <CircularProgress size={12} thickness={3} />
              ) : (
                <Trash2 className="h-3 w-3" />
              )}
            </button>
          </div>
        )}
      </div>
      
      {isFolder && isOpen && node.children?.map(child => (
        <FileTreeItem 
          key={child.id} 
          node={child} 
          level={level + 1} 
          activeId={activeId} 
          expandedIds={expandedIds}
          onToggle={onToggle}
          onSelect={onSelect}
          onCreate={onCreate}
          onRename={onRename}
          onDelete={onDelete}
          isBatchMode={isBatchMode}
          selectedIds={selectedIds}
          onToggleSelect={onToggleSelect}
        />
      ))}
    </div>
  );
};

// --- COMPONENT: Markdown Toolbar ---
const MarkdownToolbar: React.FC<{ onInsert: (prefix: string, suffix: string) => void }> = ({ onInsert }) => {
  const { t } = useLanguage();
  
  const tools = [
    { icon: <Bold className="h-4 w-4" />, prefix: '**', suffix: '**', label: t.editor.toolbar.bold },
    { icon: <Italic className="h-4 w-4" />, prefix: '*', suffix: '*', label: t.editor.toolbar.italic },
    { icon: <Heading1 className="h-4 w-4" />, prefix: '# ', suffix: '', label: t.editor.toolbar.h1 },
    { icon: <Heading2 className="h-4 w-4" />, prefix: '## ', suffix: '', label: t.editor.toolbar.h2 },
    { icon: <Heading3 className="h-4 w-4" />, prefix: '### ', suffix: '', label: t.editor.toolbar.h3 },
    { divider: true },
    { icon: <List className="h-4 w-4" />, prefix: '- ', suffix: '', label: t.editor.toolbar.list },
    { icon: <CheckSquare className="h-4 w-4" />, prefix: '- [ ] ', suffix: '', label: t.editor.toolbar.checklist },
    { icon: <Quote className="h-4 w-4" />, prefix: '> ', suffix: '', label: t.editor.toolbar.quote },
    { icon: <Code className="h-4 w-4" />, prefix: '```\n', suffix: '\n```', label: t.editor.toolbar.code },
    { divider: true },
    { icon: <LinkIcon className="h-4 w-4" />, prefix: '[', suffix: '](url)', label: t.editor.toolbar.link },
    { icon: <ImageIcon className="h-4 w-4" />, prefix: '![alt](', suffix: ')', label: t.editor.toolbar.image },
    { icon: <Table className="h-4 w-4" />, prefix: '| Col 1 | Col 2 |\n|---|---|\n| Val 1 | Val 2 |', suffix: '', label: t.editor.toolbar.table },
  ];

  return (
    <div className="flex items-center gap-1 p-2 border-b border-gray-200 bg-gray-50 overflow-x-auto">
      {tools.map((tool, index) => (
        tool.divider ? (
          <div key={index} className="w-px h-5 bg-gray-300 mx-1" />
        ) : (
          <button
            key={index}
            onClick={() => onInsert(tool.prefix!, tool.suffix!)}
            className="p-1.5 text-gray-600 hover:text-primary-600 hover:bg-white rounded transition-colors"
            title={tool.label}
          >
            {tool.icon}
          </button>
        )
      ))}
    </div>
  );
};


// --- COMPONENT: AI Panel ---
const AIPanel: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  currentContent: string;
  onUpdateContent: (newContent: string) => void;
}> = ({ isOpen, onClose, currentContent, onUpdateContent }) => {
  const [mode, setMode] = useState<AIMode>('viewer');
  const [input, setInput] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>([
    { id: '1', role: 'ai', content: 'Hello! I am your AI assistant. How can I help you with this document today?', timestamp: new Date() }
  ]);

  if (!isOpen) return null;

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: AIMessage = { id: Date.now().toString(), role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Mock AI Response
    setTimeout(() => {
      let aiResponseText = '';
      if (mode === 'viewer') {
        aiResponseText = "I've analyzed the document. It appears to be a well-structured markdown file discussing project requirements. What specific details do you need?";
      } else {
        aiResponseText = "I've updated the document to include a new section on 'Future Goals' as requested.";
        // Mock Editor Agent Action
        onUpdateContent(currentContent + '\n\n## Future Goals\n- Expand to mobile\n- Add dark mode');
      }

      const aiMsg: AIMessage = { id: (Date.now() + 1).toString(), role: 'ai', content: aiResponseText, timestamp: new Date() };
      setMessages(prev => [...prev, aiMsg]);
    }, 1000);
  };

  const loadHistory = (session: typeof MOCK_AI_HISTORY[0]) => {
    setMode(session.mode);
    setMessages([
      { id: '1', role: 'user', content: session.preview, timestamp: new Date() },
      { id: '2', role: 'ai', content: 'Here is the response from that session context...', timestamp: new Date() }
    ]);
    setShowHistory(false);
  };

  return (
    <div className="w-80 border-l border-gray-200 bg-white flex flex-col h-full shadow-xl z-20 absolute right-0 top-0 bottom-0 md:relative">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-purple-600" />
          <span className="font-semibold text-gray-800">AI Assistant</span>
        </div>
        <div className="flex items-center gap-1">
            <button
                onClick={() => setShowHistory(!showHistory)}
                className={`p-1.5 rounded-md transition-colors ${showHistory ? 'bg-purple-100 text-purple-700' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
                title="History"
            >
                <History className="h-4 w-4" />
            </button>
            <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md">
                <X className="h-4 w-4" />
            </button>
        </div>
      </div>

      {showHistory ? (
        <div className="flex-1 overflow-y-auto bg-gray-50/50">
             <div className="p-4">
                 <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Chat History</h3>
                 <div className="space-y-3">
                     {MOCK_AI_HISTORY.map(session => (
                         <div
                             key={session.id}
                             onClick={() => loadHistory(session)}
                             className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:border-purple-300 hover:shadow-md transition-all cursor-pointer group"
                         >
                             <div className="flex justify-between items-center mb-1">
                                 <span className="font-medium text-sm text-gray-900 truncate">{session.title}</span>
                                 <span className="text-[10px] text-gray-400">{session.date}</span>
                             </div>
                             <p className="text-xs text-gray-500 line-clamp-2 mb-2">{session.preview}</p>
                             <div className="flex items-center gap-2">
                                 <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                                     session.mode === 'viewer' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                                 }`}>
                                     {session.mode === 'viewer' ? 'Viewer' : 'Editor'}
                                 </span>
                             </div>
                         </div>
                     ))}
                 </div>
                 <button
                    onClick={() => setShowHistory(false)}
                    className="w-full mt-6 py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-purple-300 hover:text-purple-600 transition-colors flex items-center justify-center gap-2"
                 >
                     <Plus className="h-4 w-4" /> Start New Chat
                 </button>
             </div>
        </div>
      ) : (
        <>
        {/* Mode Switcher */}
        <div className="p-3 border-b border-gray-100 flex gap-2">
            <button 
            onClick={() => setMode('viewer')}
            className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-medium rounded-md transition-colors ${
                mode === 'viewer' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
            >
            <Sparkles className="h-3 w-3" /> Viewer
            </button>
            <button 
            onClick={() => setMode('editor')}
            className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-medium rounded-md transition-colors ${
                mode === 'editor' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
            >
            <PenTool className="h-3 w-3" /> Editor
            </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
            {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                msg.role === 'user' 
                    ? 'bg-primary-600 text-white rounded-br-none' 
                    : 'bg-white border border-gray-200 text-gray-700 rounded-bl-none shadow-sm'
                }`}>
                {msg.content}
                </div>
            </div>
            ))}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 bg-white">
            <div className="relative">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={mode === 'viewer' ? "Ask about this doc..." : "Instruct AI to edit..."}
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            />
            <button 
                onClick={handleSend}
                className="absolute right-2 top-1.5 p-1 text-purple-600 hover:text-purple-700 rounded-full hover:bg-purple-50"
            >
                <Send className="h-4 w-4" />
            </button>
            </div>
            <p className="text-[10px] text-gray-400 text-center mt-2">
            {mode === 'editor' ? 'AI will modify the document directly.' : 'AI will answer questions based on context.'}
            </p>
        </div>
        </>
      )}
    </div>
  );
};

// --- COMPONENT: Share Modal ---
const ShareModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  fileName: string; 
}> = ({ isOpen, onClose, fileName }) => {
  const { t } = useLanguage();
  const [link, setLink] = useState('');
  const [copied, setCopied] = useState(false);
  
  // Settings State
  const [expiration, setExpiration] = useState('');
  const [hasPassword, setHasPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [permission, setPermission] = useState<'view' | 'edit'>('view');

  useEffect(() => {
    if (isOpen) {
      // Simulate unique link generation
      setLink(`https://litewiki.app/share/${Math.random().toString(36).substring(7)}`);
      setCopied(false);
      // Reset settings
      setExpiration('');
      setHasPassword(false);
      setPassword('');
      setPermission('view');
    }
  }, [isOpen]);

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-primary-50 to-white">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-white rounded-lg text-primary-600 shadow-sm border border-primary-100">
                <Share2 className="h-5 w-5" />
             </div>
             <div>
                <h3 className="font-bold text-gray-900">{t.editor.share.title}</h3>
                <p className="text-xs text-gray-500">{fileName}</p>
             </div>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Link Section */}
          <div>
             <div className="flex gap-2">
                <div className="flex-1 relative">
                   <input 
                     type="text" 
                     readOnly 
                     value={link} 
                     className="w-full pl-3 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none"
                   />
                   <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <LinkIcon className="h-4 w-4" />
                   </div>
                </div>
                <Button onClick={handleCopy} className={`min-w-[100px] transition-all ${copied ? 'bg-green-600 hover:bg-green-700' : ''}`}>
                   {copied ? (
                     <span className="flex items-center gap-1"><Check className="h-4 w-4" /> {t.editor.share.linkCopied}</span>
                   ) : (
                     <span className="flex items-center gap-1"><Copy className="h-4 w-4" /> {t.editor.share.copyLink}</span>
                   )}
                </Button>
             </div>
          </div>

          <div className="border-t border-gray-100 my-2"></div>

          {/* Settings Section */}
          <div>
             <h4 className="text-sm font-bold text-gray-900 mb-4">{t.editor.share.settings}</h4>
             <div className="space-y-4">
                
                {/* Expiration */}
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {t.editor.share.expiration}
                   </div>
                   <input 
                      type="date" 
                      value={expiration}
                      onChange={(e) => setExpiration(e.target.value)}
                      className="text-sm border border-gray-300 rounded px-2 py-1 outline-none focus:border-primary-500"
                   />
                </div>

                {/* Password Protection */}
                <div className="space-y-2">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                         <Lock className="h-4 w-4 text-gray-400" />
                         {t.editor.share.passwordProtection}
                      </div>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input 
                           type="checkbox" 
                           name="toggle" 
                           id="toggle" 
                           checked={hasPassword}
                           onChange={() => setHasPassword(!hasPassword)}
                           className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer border-gray-300 checked:right-0 checked:border-primary-600"
                           style={{ right: hasPassword ? '0' : 'auto', left: hasPassword ? 'auto' : '0' }}
                        />
                        <label 
                           htmlFor="toggle" 
                           className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer ${hasPassword ? 'bg-primary-600' : 'bg-gray-300'}`}
                        ></label>
                      </div>
                   </div>
                   {hasPassword && (
                      <input 
                         type="text" 
                         value={password}
                         onChange={(e) => setPassword(e.target.value)}
                         placeholder={t.editor.share.passwordPlaceholder}
                         className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-primary-500 animate-fade-in"
                      />
                   )}
                </div>

                {/* Permissions */}
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Shield className="h-4 w-4 text-gray-400" />
                      {t.editor.share.permissions}
                   </div>
                   <select 
                      value={permission}
                      onChange={(e) => setPermission(e.target.value as 'view' | 'edit')}
                      className="text-sm border border-gray-300 rounded px-2 py-1 outline-none focus:border-primary-500 bg-white"
                   >
                      <option value="view">{t.editor.share.permView}</option>
                      <option value="edit">{t.editor.share.permEdit}</option>
                   </select>
                </div>
             </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 bg-gray-50 text-right">
           <Button onClick={onClose}>Done</Button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE: Editor ---
export const Editor: React.FC = () => {
  const [files, setFiles] = useState<FileNode[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [activeFileId, setActiveFileId] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [savedContent, setSavedContent] = useState<string>(''); // Track saved state
  const [fileName, setFileName] = useState<string>('');
  const [isAiOpen, setIsAiOpen] = useState(false);
  const { t } = useLanguage();
  const userState = useUserStore();
  
  // Comments State
  const [newComment, setNewComment] = useState('');
  
  // Batch Mode State
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  // NEW: Upload State
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Share Modal State
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  
  // Knowledge Base State
  const [isInKnowledgeBase, setIsInKnowledgeBase] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Confirm Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type: 'warning' | 'info' | 'success' | 'error';
    requireInput?: boolean;
    inputLabel?: string;
    inputPlaceholder?: string;
    inputValue?: string;
    onConfirm?: (inputValue?: string) => void;
  }>({
    open: false,
    title: '',
    message: '',
    type: 'info',
  });

  // Helper function for confirm dialogs
  const showConfirmDialog = (config: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'warning' | 'info' | 'success' | 'error';
    requireInput?: boolean;
    inputLabel?: string;
    inputPlaceholder?: string;
    inputValue?: string;
    onConfirm?: (inputValue?: string) => void;
  }) => {
    setConfirmDialog({
      open: true,
      type: 'info',
      ...config,
    });
  };

  // Helper function for input dialogs (creating/renaming)
  const showInputDialog = (config: {
    title: string;
    message: string;
    inputLabel?: string;
    inputPlaceholder?: string;
    inputValue?: string;
    onConfirm: (inputValue: string) => void;
  }) => {
    setConfirmDialog({
      open: true,
      title: config.title,
      message: config.message,
      type: 'info',
      requireInput: true,
      inputLabel: config.inputLabel || '名称',
      inputPlaceholder: config.inputPlaceholder || '',
      inputValue: config.inputValue || '',
      confirmText: '确定',
      cancelText: '取消',
      onConfirm: config.onConfirm,
    });
  };

  // --- API Functions ---

  const createNewDocument = async (documentData: CreateDocumentRequest): Promise<Document> => {
    const response = await axios.post<Document>(
      '/api/v1/documents',
      documentData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': userState.bearerToken || localStorage.getItem('token') || ''
        }
      }
    );

    return response.data;
  };

  const modifyDocument = async (documentData: ModifyDocumentRequest, id: string): Promise<Document> => {
    const response = await axios.put<Document>(
      `/api/v1/documents/${id}`,
      documentData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': userState.bearerToken || localStorage.getItem('token') || ''
        }
      }
    );

    return response.data;
  };

  // --- React Query: Documents List Query ---
  const { data: documentsList, isLoading: isLoadingDocuments, error: documentsError } = useQuery({
    queryKey: ['documentsList'],
    queryFn: getDocumentsList,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });

  // --- React Query: Document by ID Query ---
  const { data: currentDocument, refetch: refetchDocument } = useQuery({
    queryKey: ['document', activeFileId],
    queryFn: () => getDocumentById(activeFileId),
    enabled: !!activeFileId, // Only run when activeFileId exists
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  // --- React Query: Comments Query ---
  const { data: comments = [], isLoading: isLoadingComments, error: commentsError } = useQuery({
    queryKey: ['documentComments', activeFileId],
    queryFn: () => getDocumentComments(activeFileId),
    enabled: !!activeFileId, // Only run when activeFileId exists
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });

  // --- Effect: Fetch and update file nodes on component mount and unmount ---
  useEffect(() => {
    // Function to fetch documents and update global state
    const fetchAndUpdateFileNodes = async () => {
      try {
        const documentsList = await getDocumentsList();
        
        if (documentsList && Array.isArray(documentsList)) {
          // Convert documents to file nodes
          const serverFileNodes: FileNode[] = documentsList.map((doc: Document) => ({
            id: doc.id,
            name: doc.name,
            type: doc.type === 'text/markdown' ? 'markdown' : 'text',
            content: doc.content || '',
            currentVersion: 'V1.0',
            versions: [INITIAL_VERSIONS[2]], // Use mock version data for now
            inKnowledgeBase: doc.inKnowledgeBase || false
          }));

          // Update global state with the latest file nodes
          useUserStore.getState().setFileNodes(serverFileNodes);
        }
      } catch (error) {
        console.error('Failed to fetch documents on component mount:', error);
      }
    };

    // Fetch documents when component mounts
    fetchAndUpdateFileNodes();

    // Clean up function when component unmounts
    return () => {
      // Fetch documents again when component unmounts to ensure global state is up-to-date
      fetchAndUpdateFileNodes();
    };
  }, []); // Empty dependency array ensures this runs only on mount and unmount

  // --- Effect: Sync documents list to files state ---
  useEffect(() => {
    if (documentsList && Array.isArray(documentsList)) {
      // Convert documents to file nodes
      const serverFileNodes: FileNode[] = documentsList.map((doc: Document) => ({
        id: doc.id,
        name: doc.name,
        type: doc.type === 'text/markdown' ? 'markdown' : 'text',
        content: doc.content || '',
        currentVersion: 'V1.0',
        versions: [INITIAL_VERSIONS[2]], // Use mock version data for now
        inKnowledgeBase: doc.inKnowledgeBase || false
      }));

      // Merge server data with existing files to preserve uploaded files
      const mergedFiles = mergeFileNodes(files, serverFileNodes);
      setFiles(mergedFiles);
      userState.setFileNodes(mergedFiles);
    }
    
  }, [documentsList, activeFileId]);

  // --- Effect: Load document content when activeFileId changes ---
  useEffect(() => {
    if (currentDocument && activeFileId) {
      // Only update if the content is different to avoid unnecessary re-renders
      if (content !== currentDocument.content) {
        setContent(currentDocument.content || '');
      }
      // Always update savedContent to ensure it matches the server content
      setSavedContent(currentDocument.content || '');
      if (fileName !== currentDocument.name) {
        setFileName(currentDocument.name);
      }
    }
  }, [currentDocument, activeFileId]);

  // --- React Query: Document Creation Mutation ---
   const createDocumentMutation = useMutation({
     mutationFn: createNewDocument,
     onSuccess: (newDoc: Document) => {
       // Convert Document to FileNode and add to files list
       const fileNode: FileNode = {
         id: newDoc.id,
         name: newDoc.name,
         type: newDoc.type === 'text/markdown' ? 'markdown' : 'text',
         content: newDoc.content || '',
         currentVersion: 'V1.0',
         versions: [INITIAL_VERSIONS[2]], // Use the mock version data for now
         inKnowledgeBase: newDoc.inKnowledgeBase || false
       };
       const updatedFiles = [...files, fileNode];
       setFiles(updatedFiles);
       
       // Update zustand userState with the latest fileNodes
       userState.setFileNodes(updatedFiles);
       
       // Invalidate and refetch documents list to sync with server
       queryClient.invalidateQueries({ queryKey: ['documentsList'] });
       
       setActiveFileId(newDoc.id);
       setFileName(newDoc.name);
       setContent(newDoc.content || '');
       setSavedContent(newDoc.content || '');
     },
     onError: (error: any) => {
       console.error('Failed to create document:', error);
       alert(`Failed to create document: ${error?.message || 'Unknown error'}`);
     }
   });

   // --- React Query: Document Modification Mutation ---
   const modifyDocumentMutation = useMutation({
     mutationFn: ({ documentData, id }: { documentData: ModifyDocumentRequest, id: string }) => 
       modifyDocument(documentData, id),
     onSuccess: (updatedDoc: Document) => {
         // Update the FileNode in the files list
         const updatedFiles = files.map(file => 
           file.id === updatedDoc.id 
             ? { ...file, content: updatedDoc.content || '' }
             : file
         );
         setFiles(updatedFiles);
         
         // Update zustand userState with the latest fileNodes
         userState.setFileNodes(updatedFiles);
         
         // Update local state and reset dirty state
         setSavedContent(updatedDoc.content || '');
         console.log('Document saved successfully');
       },
     onError: (error: any) => {
       console.error('Failed to save document:', error);
       alert(`Failed to save document: ${error?.message || 'Unknown error'}`);
     }
   });

   // --- React Query: Document Deletion Mutation ---
   const deleteDocumentMutation = useMutation({
     mutationFn: deleteFile,
     onSuccess: (response) => {
       console.log('Document moved to recycle bin successfully:', response);
       // Invalidate and refetch documents list to update the UI
       queryClient.invalidateQueries({ queryKey: ['documentsList'] });
     },
     onError: (error: any) => {
       console.error('Failed to move document to recycle bin:', error);
       alert(`Failed to delete document: ${error?.response?.data?.message || error?.message || 'Unknown error'}`);
     }
   });

   // --- React Query: Add/Remove Document to/from Knowledge Base Mutation ---
   const toggleKnowledgeBaseMutation = useMutation({
     mutationFn: ({ docId, isInKb }: { docId: string; isInKb: boolean }) => {
       return isInKb 
         ? removeDocumentFromKnowledgeBase(docId)
         : addDocumentToKnowledgeBase(docId);
     },
     onSuccess: (response, variables) => {
       const action = variables.isInKb ? 'removed from' : 'added to';
       console.log(`Document ${action} knowledge base successfully:`, response);
       
       // Update local state
       setIsInKnowledgeBase(!variables.isInKb);
       
       // Update file in files list
       const updatedFiles = files.map(file => 
         file.id === variables.docId 
           ? { ...file, inKnowledgeBase: !variables.isInKb }
           : file
       );
       setFiles(updatedFiles);
       
       // Update zustand userState with the latest fileNodes
       userState.setFileNodes(updatedFiles);
       
       // Invalidate and refetch documents list to sync with server
       queryClient.invalidateQueries({ queryKey: ['documentsList'] });
       
       // Show toast notification
       setToastMessage(`文档已${variables.isInKb ? '从知识库移除' : '添加到知识库'}`);
       setShowToast(true);
       setTimeout(() => setShowToast(false), 3000);
     },
     onError: (error: any, variables) => {
       const action = variables.isInKb ? 'remove from' : 'add to';
       console.error(`Failed to ${action} knowledge base:`, error);
       alert(`Failed to ${action} knowledge base: ${error?.response?.data?.message || error?.message || 'Unknown error'}`);
     }
   });

   // --- React Query: Post Comment Mutation ---
   const postCommentMutation = useMutation({
     mutationFn: ({ docId, content }: { docId: string; content: string }) => {
       return postDocumentComment(docId, { content });
     },
     onSuccess: (response, variables) => {
       console.log('Comment posted successfully:', response);
       
       // Invalidate and refetch comments to sync with server
       queryClient.invalidateQueries({ queryKey: ['documentComments', activeFileId] });
       
       // Clear the input field
       setNewComment('');
       
       // Show success message
       setToastMessage('评论发布成功');
       setShowToast(true);
       setTimeout(() => setShowToast(false), 3000);
     },
     onError: (error: any) => {
       console.error('Failed to post comment:', error);
       alert(`发布评论失败: ${error?.response?.data?.message || error?.message || 'Unknown error'}`);
     }
   });

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

   // --- Save Document Handler ---
    const handleSaveDocument = useCallback(async (value: string) => {
      if (!activeFileId || !fileName) {
        console.warn('No active file to save');
        return;
      }

      const documentData: ModifyDocumentRequest = {
        name: fileName,
        content: value,
        isPublic: null,
        folderId: null
      };

      modifyDocumentMutation.mutate({ documentData, id: activeFileId });
    }, [activeFileId, fileName, modifyDocumentMutation]);

    // --- Reset dirty state after successful save ---
    const resetDirtyState = useCallback(() => {
      setSavedContent(content);
    }, [content]);
    
    // --- Knowledge Base Toggle Handler (with debounce) ---
    const handleToggleKnowledgeBase = useCallback(
      debounce(() => {
        if (!activeFileId) return;
        
        toggleKnowledgeBaseMutation.mutate({
          docId: activeFileId,
          isInKb: isInKnowledgeBase
        });
      }, 500),
      [activeFileId, isInKnowledgeBase, toggleKnowledgeBaseMutation]
    );
  
  const isDirty = content !== savedContent;
  const activeNode = findNodeById(files, activeFileId);
  
  // --- Update knowledge base state when active file changes ---
  useEffect(() => {
    if (activeNode) {
      setIsInKnowledgeBase(activeNode.inKnowledgeBase || false);
    } else {
      setIsInKnowledgeBase(false);
    }
  }, [activeNode, activeFileId]);

  // --- 1. Prevent Browser Close/Refresh ---
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = ''; // Trigger browser built-in dialog
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // --- 2. Prevent React Router Navigation (Sidebar/Back button) ---
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty && currentLocation.pathname !== nextLocation.pathname
  );

  useEffect(() => {
    if (blocker.state === "blocked") {
      showConfirmDialog({
        title: "离开页面",
        message: "您有未保存的更改，确定要离开吗？",
        type: "warning",
        confirmText: "离开",
        cancelText: "取消",
        onConfirm: () => {
          blocker.proceed();
        }
      });
    }
  }, [blocker]);


  // --- Handlers: Selection & Expansion ---
  const handleFileSelect = async (node: FileNode) => {
    // --- Prevent Internal File Switching ---
    if (activeFileId && isDirty) {
      showConfirmDialog({
        title: "文件未保存",
        message: `'${fileName}' 有未保存的更改，确定要放弃这些更改吗？`,
        type: "warning",
        confirmText: "放弃",
        cancelText: "取消",
        onConfirm: async () => {
          await loadDocumentContent(node.id);
        }
      });
      return;
    }

    if (!activeFileId || !isDirty) {
      await loadDocumentContent(node.id);
    }
  };

  // Helper function to load document content
  const loadDocumentContent = async (documentId: string) => {
    try {
      setActiveFileId(documentId);
      // Manually fetch document content for immediate display
      const docData = await getDocumentById(documentId);
      setFileName(docData.name);
      setContent(docData.content || '');
      setSavedContent(docData.content || '');
      
      // Also update the query cache to ensure consistency
      queryClient.setQueryData(['document', documentId], docData);
    } catch (error) {
      console.error('Failed to load document content:', error);
      // Fallback to local content if API fails
      const node = findNodeById(files, documentId);
      if (node) {
        setFileName(node.name);
        setContent(node.content || '');
        setSavedContent(node.content || '');
        
        // Update the query cache with local data
        queryClient.setQueryData(['document', documentId], {
          id: node.id,
          name: node.name,
          content: node.content || '',
          type: node.type === 'markdown' ? 'text/markdown' : 'text/plain'
        });
      }
    }
  };

  const handleToggleFolder = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleUpdateContent = (newContent: string) => {
    setContent(newContent);
    // Also update the content in the file tree state
    const updateContentRecursive = (nodes: FileNode[]): FileNode[] => {
      return nodes.map(node => {
        if (node.id === activeFileId) {
          return { ...node, content: newContent };
        }
        if (node.children) {
          return { ...node, children: updateContentRecursive(node.children) };
        }
        return node;
      });
    };
    setFiles(updateContentRecursive(files));
  };

  const handleSave = () => {
    // Use the debounced save function to actually save to the server
    handleSaveDocument(content);
  };

  const handleDownload = () => {
    if (!activeFileId || !fileName || !content) {
      console.warn('No active file or content to download');
      return;
    }

    try {
      // Create a Blob with the markdown content
      const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
      
      // Create a temporary URL for the blob
      const url = URL.createObjectURL(blob);
      
      // Create a temporary anchor element and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}.md`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log(`Downloaded file: ${fileName}.md`);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  // --- Handlers: Markdown Insertion ---
  const insertMarkdown = (prefix: string, suffix: string) => {
    const textarea = textAreaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    const newText = text.substring(0, start) + prefix + selectedText + suffix + text.substring(end);
    
    handleUpdateContent(newText);
    
    // Restore focus and update cursor position
    setTimeout(() => {
        textarea.focus();
        const newCursorPos = start + prefix.length + selectedText.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  // --- Handlers: Comments ---
  const handlePostComment = () => {
    if (!newComment.trim() || !activeFileId) return;
    
    postCommentMutation.mutate({
      docId: activeFileId,
      content: newComment.trim()
    });
  };

  const handleAttachFile = () => {
    alert("File attachment simulation: 'screenshot.png' attached.");
  };

  // --- Handlers: File System CRUD ---
  const handleCreateNode = (parentId: string | null, type: FileType) => {
    showInputDialog({
      title: `创建新${type === 'folder' ? '文件夹' : '文件'}`,
      message: `请输入新${type === 'folder' ? '文件夹' : '文件'}的名称:`,
      inputLabel: '名称',
      inputPlaceholder: type === 'folder' ? '例如：文档' : '例如：我的文档',
      onConfirm: (name) => {
        if (!name.trim()) return;

        if (type === 'folder') {
          // Handle folder creation (keep existing logic)
          const newNode: FileNode = {
            id: Date.now().toString(),
            name: name.trim(),
            type,
            content: undefined,
            children: [],
            currentVersion: undefined,
            versions: undefined
          };

          const updatedFiles = createNodeRecursive(files, parentId, newNode);
          setFiles(updatedFiles);
          
          // Update zustand userState with the latest fileNodes
          userState.setFileNodes(updatedFiles);
          
          if (parentId) {
            setExpandedIds(prev => new Set(prev).add(parentId));
          }
        } else {
          // Handle document creation with API call
          const documentData: CreateDocumentRequest = {
            name: name.trim(),
            content: '',
            type: type === 'markdown' ? 'text/markdown' : 'text/plain',
            folderId: parentId,
            teamId: null
          };
          createDocumentMutation.mutate(documentData);
        }
      }
    });
  };

  const handleRenameNode = (id: string, currentName: string) => {
    showInputDialog({
      title: '重命名',
      message: '请输入新的名称:',
      inputLabel: '名称',
      inputPlaceholder: '例如：新的文件名',
      inputValue: currentName,
      onConfirm: (newName) => {
        if (!newName.trim() || newName.trim() === currentName) return;

        const updatedFiles = renameNodeRecursive(files, id, newName.trim());
        setFiles(updatedFiles);
        
        // Update zustand userState with the latest fileNodes
        userState.setFileNodes(updatedFiles);
        
        if (id === activeFileId) setFileName(newName.trim());
      }
    });
  };

  const handleDeleteNode = (id: string) => {
    // Check if the confirmation needs to warn about unsaved changes
    // Only if the file being deleted IS the active file.
    // However, if we delete a folder containing the active file, that's also an issue.
    // For simplicity, we ask for confirmation, then handle the cleanup.
    
    showConfirmDialog({
      title: "删除确认",
      message: t.common.confirmDelete,
      type: "warning",
      confirmText: "删除",
      cancelText: "取消",
      onConfirm: () => {
        // Call the delete API to move the document to recycle bin
        deleteDocumentMutation.mutate(id, {
          onSuccess: () => {
            // After successful API call, update local state
            const newFiles = deleteNodeRecursive(files, id);
            setFiles(newFiles);
            
            // Update zustand userState with the latest fileNodes
            userState.setFileNodes(newFiles);
            
            // Check if active file still exists in the new tree
            const isActiveFileStillPresent = activeFileId && findNodeById(newFiles, activeFileId);
            
            if (activeFileId && !isActiveFileStillPresent) {
              // Active file was deleted (or its parent was deleted)
              setActiveFileId('');
              setFileName('');
              setContent('');
              setSavedContent('');
            }
          }
        });
      }
    });
  };

  // Handle delete from the editor toolbar
  const handleDelete = () => {
    if (!activeFileId) return;
    
    showConfirmDialog({
      title: "删除确认",
      message: `确定要将文件 "${fileName}" 移动到回收站吗？`,
      type: "warning",
      confirmText: "删除",
      cancelText: "取消",
      onConfirm: () => {
        // Call the delete API to move the document to recycle bin
        deleteDocumentMutation.mutate(activeFileId, {
          onSuccess: () => {
            // After successful API call, update local state
            const newFiles = deleteNodeRecursive(files, activeFileId);
            setFiles(newFiles);
            
            // Reset editor state since the active file was deleted
            setActiveFileId('');
            setFileName('');
            setContent('');
            setSavedContent('');
          }
        });
      }
    });
  };

  // --- Handlers: Batch Operations ---
  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleBatchDelete = () => {
    const confirmMessage = t.common.confirmBatchDelete.replace('{count}', selectedIds.size.toString());
    showConfirmDialog({
      title: "批量删除确认",
      message: confirmMessage,
      type: "warning",
      confirmText: "删除",
      cancelText: "取消",
      onConfirm: () => {
        // Create an array of promises for all delete operations
        const deletePromises = Array.from(selectedIds).map(id => 
          deleteFile(id as string).catch(error => {
            console.error(`Failed to delete document ${id}:`, error);
            return { id: id as string, error: true, message: error?.response?.data?.message || error?.message || 'Unknown error' };
          })
        );
        
        // Execute all delete operations
        Promise.all(deletePromises).then(results => {
          // Check if any operations failed
          const failedOperations = results.filter((result: any) => result && result.error);
          
          if (failedOperations.length > 0) {
            console.error(`${failedOperations.length} documents failed to delete`);
            alert(`${failedOperations.length} 个文档删除失败，请重试`);
          } else {
            console.log('All documents moved to recycle bin successfully');
            // Invalidate and refetch documents list to update the UI
            queryClient.invalidateQueries({ queryKey: ['documentsList'] });
            
            // Check if active file is being deleted
            if (selectedIds.has(activeFileId)) {
              setActiveFileId('');
              setFileName('');
              setContent('');
              setSavedContent('');
            }
            
            // Update local state
            const updatedFiles = batchDeleteRecursive(files, selectedIds);
            setFiles(updatedFiles);
            
            // Update zustand userState with the latest fileNodes
            userState.setFileNodes(updatedFiles);
            
            setSelectedIds(new Set());
            setIsBatchMode(false);
          }
        });
      }
    });
  };
  
  // React Query mutation for file upload
  const uploadFileMutation = useMutation({
    mutationFn: uploadFile,
    onSuccess: async (uploadedDoc: Document) => {
      try {
        // Get the complete document content immediately after upload
        const fullDoc = await getDocumentById(uploadedDoc.id);
        
        // Create file node in the same format as sync logic for consistency
        const newFileNode: FileNode = {
          id: fullDoc.id,
          name: fullDoc.name,
          type: fullDoc.type === 'text/markdown' ? 'markdown' : 'text',
          content: fullDoc.content || '',
          currentVersion: 'V1.0',
          versions: [INITIAL_VERSIONS[2]], // Use same mock version data as sync logic
          inKnowledgeBase: fullDoc.inKnowledgeBase || false
        };
        
        // Add the new file node to local state immediately to prevent disappearing
        setFiles(prev => {
          // Check if file already exists to avoid duplicates
          const exists = prev.some(file => file.id === fullDoc.id);
          let updatedFiles;
          
          if (exists) {
            // Update existing file with new content
            updatedFiles = prev.map(file => 
              file.id === fullDoc.id 
                ? { ...file, content: fullDoc.content || '' }
                : file
            );
          } else {
            // Add new file to the list
            updatedFiles = [...prev, newFileNode];
          }
          
          // Update user store with the same updated files
          userState.setFileNodes(updatedFiles);
          return updatedFiles;
        });
        
        // Invalidate and refetch documents list to update the UI
        queryClient.invalidateQueries({ queryKey: ['documentsList'] });
        setUploadProgress(0);
        setIsUploading(false);
        
        // Auto-select the newly uploaded file
        // We'll set the activeFileId and let the React Query effect handle the content loading
        setActiveFileId(fullDoc.id);
        setFileName(fullDoc.name);
        
        // Pre-fetch the document to ensure it's cached
        queryClient.prefetchQuery({
          queryKey: ['document', fullDoc.id],
          queryFn: () => Promise.resolve(fullDoc),
        });
        
        // Show success notification
        setUploadNotification({
          show: true,
          type: 'success',
          message: `文件 "${fullDoc.name}" 上传成功`
        });
        
        // Auto hide notification after 3 seconds
        setTimeout(() => {
          setUploadNotification(prev => ({ ...prev, show: false }));
        }, 3000);
        
        console.log('File uploaded successfully with content:', newFileNode);
      } catch (error) {
        console.error('Failed to get document content after upload:', error);
        
        // Create file node without content as fallback, using same format as sync logic
        const fallbackFileNode: FileNode = {
          id: uploadedDoc.id,
          name: uploadedDoc.name,
          type: uploadedDoc.type === 'text/markdown' ? 'markdown' : 'text',
          content: uploadedDoc.content || '',
          currentVersion: 'V1.0',
          versions: [INITIAL_VERSIONS[2]]
        };
        
        // Add fallback file node to prevent complete disappearance
        setFiles(prev => {
          const exists = prev.some(file => file.id === uploadedDoc.id);
          if (!exists) {
            return [...prev, fallbackFileNode];
          }
          return prev;
        });
        
        // Invalidate and refetch documents list even if content fetch failed
        queryClient.invalidateQueries({ queryKey: ['documentsList'] });
        setUploadProgress(0);
        setIsUploading(false);
        
        setUploadNotification({
          show: true,
          type: 'success',
          message: `文件 "${uploadedDoc.name}" 上传成功，但无法获取内容`
        });
      }
    },
    onError: (error: any) => {
      console.error('File upload failed:', error);
      setUploadProgress(0);
      setIsUploading(false);
      
      setUploadNotification({
        show: true,
        type: 'error',
        message: error?.response?.data?.message || '文件上传失败，请重试'
      });
      
      setTimeout(() => {
        setUploadNotification(prev => ({ ...prev, show: false }));
      }, 5000);
    }
  });

  // Upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadNotification, setUploadNotification] = useState<{
    show: boolean;
    type: 'success' | 'error';
    message: string;
  }>({ show: false, type: 'success', message: '' });

  // Show upload notification helper
  const showUploadNotification = useCallback((type: 'success' | 'error', message: string) => {
    setUploadNotification({ show: true, type, message });
  }, []);

  // --- Handlers: File Upload ---
  const handleFileUpload = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    
    const file = fileList[0]; // For now, handle single file upload
    setIsUploading(true);
    setUploadProgress(10); // Start progress
    
    // Simulate progress (in real scenario, you might want to track actual upload progress)
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => Math.min(prev + 10, 90));
    }, 200);
    
    uploadFileMutation.mutate(file, {
      onSettled: () => {
        clearInterval(progressInterval);
        setUploadProgress(100);
      }
    });
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* LEFT: File Explorer */}
      <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wider">Explorer</h2>
          <div className="flex gap-1">
             <button 
               onClick={() => handleCreateNode(null, 'folder')}
               className="p-1 hover:bg-gray-200 rounded text-gray-500" title="New Folder"
             >
               <FolderPlus className="h-4 w-4" />
             </button>
             <button 
               onClick={() => handleCreateNode(null, 'markdown')}
               className="p-1 hover:bg-gray-200 rounded text-gray-500" title="New File"
             >
               <FilePlus className="h-4 w-4" />
             </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {/* Loading State for Documents List */}
          {isLoadingDocuments && (
            <div className="text-center mt-10 text-xs text-gray-400 px-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-primary-600 rounded-full animate-spin"></div>
                Loading documents...
              </div>
              <div className="text-[10px] text-gray-300">Fetching from server</div>
            </div>
          )}

          {/* Error State for Documents List */}
          {documentsError && !isLoadingDocuments && (
            <div className="text-center mt-10 text-xs text-red-400 px-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <AlertOctagon className="h-4 w-4 text-red-500" />
                  <span className="font-medium text-red-700">Failed to load documents</span>
                </div>
                <p className="text-[10px] text-red-600 mb-2">
                  {documentsError instanceof Error ? documentsError.message : 'Unknown error occurred'}
                </p>
                <button 
                  onClick={() => window.location.reload()}
                  className="text-[10px] text-red-600 hover:text-red-700 underline"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Files List */}
          {!isLoadingDocuments && !documentsError && files.map(node => (
            <FileTreeItem 
              key={node.id} 
              node={node} 
              level={0} 
              activeId={activeFileId} 
              expandedIds={expandedIds}
              onToggle={handleToggleFolder}
              onSelect={handleFileSelect}
              onCreate={handleCreateNode}
              onRename={handleRenameNode}
              onDelete={handleDeleteNode}
              isBatchMode={isBatchMode}
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
              isDeleting={deleteDocumentMutation.isPending}
            />
          ))}
          
          {/* Empty State */}
          {!isLoadingDocuments && !documentsError && files.length === 0 && !createDocumentMutation.isPending && (
            <div className="text-center mt-10 text-xs text-gray-400 px-4">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-30" />
              No files yet.<br/>
              <span className="text-[10px] text-gray-300">Use the + icons to create one.</span>
            </div>
          )}

          {/* Creating Document State */}
          {createDocumentMutation.isPending && (
            <div className="text-center mt-10 text-xs text-blue-400 px-4">
              <div className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 border border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                Creating document...
              </div>
            </div>
          )}
        </div>
        
        {/* Upload Dropzone */}
        <div className="px-4 pb-2">
          <div 
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
            onDrop={onDrop}
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={`h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-200 relative ${
              isDragging 
                ? 'border-primary-500 bg-primary-50 scale-[1.02]' 
                : isUploading
                  ? 'border-gray-300 bg-gray-100 cursor-not-allowed'
                  : 'border-blue-300 bg-white hover:border-primary-400 hover:bg-blue-50/50 hover:shadow-sm'
            }`}
          >
            {isUploading ? (
              <div className="flex flex-col items-center justify-center gap-3">
                <CircularProgress size={32} thickness={4} />
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-700">正在上传文件...</div>
                  <div className="text-xs text-gray-500">{uploadProgress}%</div>
                </div>
              </div>
            ) : (
              <>
                <UploadCloud className="h-8 w-8 text-primary-500 mb-2" />
                <span className="text-primary-500 font-medium text-lg">Upload 上传文件</span>
                <span className="text-xs text-gray-400 mt-1">点击或拖拽文件到此处</span>
              </>
            )}
            
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              multiple={false}
              accept="*/*"
              onChange={(e) => handleFileUpload(e.target.files)}
              disabled={isUploading}
            />
          </div>
          
          {/* Upload Notification */}
          {uploadNotification.show && (
            <div className={`mt-3 p-3 rounded-lg border ${
              uploadNotification.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {uploadNotification.type === 'success' ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertOctagon className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm font-medium">{uploadNotification.message}</span>
                </div>
                <button
                  onClick={() => setUploadNotification(prev => ({ ...prev, show: false }))}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Batch Operation Sidebar Footer */}
        <div className="p-4 border-t border-gray-200 bg-white">
          {!isBatchMode ? (
            <button 
              onClick={() => setIsBatchMode(true)}
              className="w-full py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <ListChecks className="h-4 w-4" />
              {t.common.batchOperation}
            </button>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>{selectedIds.size} {t.common.itemsSelected}</span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={handleBatchDelete}
                  disabled={selectedIds.size === 0 || deleteDocumentMutation.isPending}
                  className="flex-1 py-1.5 px-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-medium flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {deleteDocumentMutation.isPending ? (
                    <CircularProgress size={14} thickness={3} />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" />
                  )}
                  {t.common.delete}
                </button>
                <button 
                  onClick={() => { setIsBatchMode(false); setSelectedIds(new Set()); }}
                  className="flex-1 py-1.5 px-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-xs font-medium transition-colors"
                >
                  {t.common.cancel}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CENTER: Editor Area */}
      <div className=" flex flex-col flex-1 min-w-0 bg-white relative">
        {/* Editor Toolbar */}
        <div className="h-12 border-b border-gray-200 flex items-center justify-between px-4 bg-white shrink-0">
          <div className="flex items-center gap-2">
            <h1 className="font-medium text-gray-900 flex items-center gap-2">
              {fileName || 'No File Selected'}
              {activeNode && (
                <VersionBadge currentVersion={activeNode.currentVersion} versions={activeNode.versions} />
              )}
              {isDirty && <span className="text-xs text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-full">* Unsaved</span>}
            </h1>
          </div>
          {fileName && (
            <div className="flex items-center gap-2">
              <button 
                onClick={handleSave}
                className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${
                  isDirty 
                    ? 'text-primary-600 bg-primary-50 hover:bg-primary-100 font-medium' 
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`} 
                title={isDirty ? "Save changes" : "Saved"}
              >
                <Save className="h-4 w-4" />
                {isDirty && <span className="text-xs">Save</span>}
              </button>
              <button 
                onClick={() => setIsShareModalOpen(true)}
                className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" 
                title={t.editor.share.title}
              >
                <Share2 className="h-4 w-4" />
              </button>
              <button 
                onClick={handleToggleKnowledgeBase}
                className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${
                  toggleKnowledgeBaseMutation.isPending 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : isInKnowledgeBase
                      ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                      : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
                }`} 
                title={isInKnowledgeBase ? "从知识库移除" : "添加到知识库"}
                disabled={!activeFileId || toggleKnowledgeBaseMutation.isPending}
              >
                {toggleKnowledgeBaseMutation.isPending ? (
                  <CircularProgress size={16} thickness={4} />
                ) : (
                  <Database className="h-4 w-4" />
                )}
              </button>
              <button 
                onClick={handleDownload}
                className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors" 
                title="Export"
                disabled={!activeFileId}
              >
                <Download className="h-4 w-4" />
              </button>
              <button 
                onClick={handleDelete}
                className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${
                  deleteDocumentMutation.isPending 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-red-500 hover:text-red-900 hover:bg-red-50'
                }`} 
                title="Delete"
                disabled={!activeFileId || deleteDocumentMutation.isPending}
              >
                {deleteDocumentMutation.isPending ? (
                  <CircularProgress size={16} thickness={4} />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </button>
              <div className="h-4 w-px bg-gray-300 mx-1" />
              {/* Save Status */}
              <div className="flex items-center gap-2 px-3 py-1.5 text-sm">
                {modifyDocumentMutation.isPending ? (
                  <div className="flex items-center gap-2 text-blue-600">
                    <div className="w-3 h-3 border border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </div>
                ) : isDirty ? (
                  <div className="flex items-center gap-2 text-orange-600">
                    <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                    Unsaved changes
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-green-600">
                    <Check className="h-3 w-3" />
                    All changes saved
                  </div>
                )}
              </div>
              <div className="h-4 w-px bg-gray-300 mx-1" />
              <button 
                onClick={() => setIsAiOpen(!isAiOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isAiOpen ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Sparkles className="h-4 w-4" />
                AI Assistant
              </button>
            </div>
          )}
        </div>

        {/* Editor Split View */}
        {activeFileId ? (
          <div className="flex-1 flex overflow-hidden">
            <MdEditor 
              value={content}
              onChange={(value) => handleUpdateContent(value)}
              onSave={handleSaveDocument}
              style={{ height: '100%' }}
              defToolbars={[<ExportPDF key="导出PDF" value={content}/>]}
              />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 flex-col gap-4">
            <FileText className="h-16 w-16 opacity-20" />
            <p>Select a file to start editing</p>
          </div>
        )}

        {/* Bottom: Comments (Enhanced) */}
        {activeFileId && (
          <div className="h-56 border-t border-gray-200 bg-gray-50 flex flex-col shrink-0">
             <div className="px-4 py-2 border-b border-gray-200 flex items-center gap-2 bg-white sticky top-0">
                <MessageSquare className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-semibold text-gray-700">{t.editor.comments.title}</span>
                <span className="bg-gray-200 text-gray-600 text-[10px] px-1.5 rounded-full">{comments.length}</span>
             </div>
             
             {/* Comments List */}
             <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {isLoadingComments ? (
                  <div className="flex justify-center items-center h-20">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                  </div>
                ) : commentsError ? (
                  <div className="text-center text-red-500 text-sm">
                    加载评论失败，请稍后重试
                  </div>
                ) : comments.length === 0 ? (
                  <div className="text-center text-gray-500 text-sm">
                    暂无评论，来发表第一条评论吧
                  </div>
                ) : (
                  comments.map(comment => (
                    <div key={comment.id} className="flex gap-3 animate-fade-in-up">
                       <div className="flex-shrink-0">
                         {comment.user.avatar ? (
                           <img src={comment.user.avatar} alt={comment.user.name} className="h-8 w-8 rounded-full bg-gray-100" />
                         ) : (
                           <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold">
                             {comment.user.name.charAt(0)}
                           </div>
                         )}
                       </div>
                       <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 text-sm max-w-2xl">
                          <div className="flex justify-between items-baseline mb-1">
                            <span className="font-semibold text-gray-900 mr-2">{comment.user.name}</span>
                            <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-gray-600 mb-2">{comment.content}</p>
                       </div>
                    </div>
                  ))
                )}
             </div>

             {/* Comment Input */}
             <div className="p-3 bg-white border-t border-gray-200">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder={t.editor.comments.placeholder}
                      className="w-full pl-3 pr-20 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      onKeyDown={(e) => e.key === 'Enter' && handlePostComment()}
                    />
                    <div className="absolute right-2 top-1.5 flex gap-1">
                      <button onClick={handleAttachFile} className="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100" title={t.editor.comments.attach}>
                        <Paperclip className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => setNewComment(prev => prev + '👍')} className="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100" title={t.editor.comments.emoji}>
                        <Smile className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={handlePostComment} 
                    disabled={!newComment.trim() || postCommentMutation.isPending}
                  >
                    {postCommentMutation.isPending ? '发布中...' : t.editor.comments.post}
                  </Button>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* RIGHT: AI Panel */}
      <AIPanel 
        isOpen={isAiOpen} 
        onClose={() => setIsAiOpen(false)} 
        currentContent={content}
        onUpdateContent={handleUpdateContent}
      />
      
      {/* Share Modal */}
      <ShareModal 
         isOpen={isShareModalOpen}
         onClose={() => setIsShareModalOpen(false)}
         fileName={fileName}
      />

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-8 right-8 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in">
          {toastMessage}
        </div>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog(prev => ({ ...prev, open: false }))}
        onConfirm={() => {
          if (confirmDialog.onConfirm) {
            confirmDialog.onConfirm(confirmDialog.inputValue);
          }
          setConfirmDialog(prev => ({ ...prev, open: false }));
        }}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        cancelText={confirmDialog.cancelText}
        type={confirmDialog.type}
        requireInput={confirmDialog.requireInput}
        inputLabel={confirmDialog.inputLabel}
        inputPlaceholder={confirmDialog.inputPlaceholder}
        inputValue={confirmDialog.inputValue}
        onInputChange={(value) => setConfirmDialog(prev => ({ ...prev, inputValue: value }))}
      />
    </div>
  );
};
