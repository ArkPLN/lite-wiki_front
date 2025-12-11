
import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  BrainCircuit, 
  Database, 
  FileText, 
  Globe, 
  Sparkles,
  HardDrive,
  Clock,
  Plus,
  PieChart,
  File,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';
import { useLanguage } from '../../lib/i18n';
import { FilePickerModal } from '../../components/dashboard/SharedModals';
import useUserStore from '../../store/index';
import { useKnowledgeBase, useAddDocumentToKnowledgeBase, useRemoveDocumentFromKnowledgeBase, useKnowledgeBaseDocs } from '../../hooks/useKnowledgeBase';
import { KnowledgeBaseDoc } from '../../types/kb/kb';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
}

interface IndexedFile {
  id: string;
  name: string;
  type: string;
  size: string;
  updated: string;
  status: 'indexed' | 'processing';
}

export const KnowledgeCenter: React.FC = () => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      content: 'Hello! I am your knowledge base assistant. I can help you find information within your documents or search the web for external context.',
      timestamp: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [selectedBase, setSelectedBase] = useState('team');
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const [deepThinkingEnabled, setDeepThinkingEnabled] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // FilePickerModal状态
  const [isFilePickerOpen, setIsFilePickerOpen] = useState(false);
  const { fileNodes } = useUserStore();
  
  // 使用React Query获取知识库数据
  const { data: knowledgeBaseData, isLoading: kbLoading, error: kbError } = useKnowledgeBase();
  const { data: knowledgeBaseDocs, isLoading: docsLoading, error: docsError } = useKnowledgeBaseDocs();
  const addDocumentMutation = useAddDocumentToKnowledgeBase();
  const removeDocumentMutation = useRemoveDocumentFromKnowledgeBase();
  
  // 处理文件选择
  const handleFileSelect = (node: any, path: string) => {
    // 只允许选择文件，不允许选择文件夹
    if (node.type === 'folder') {
      return;
    }
    
    // 使用实际的API调用添加文档到知识库
    addDocumentMutation.mutate(node.id, {
      onSuccess: () => {
        console.log('Document added to knowledge base successfully:', node.name);
        // 关闭文件选择器
        setIsFilePickerOpen(false);
      },
      onError: (error) => {
        console.error('Failed to add document to knowledge base:', error);
        // 可以在这里添加错误提示，但不关闭模态框，让用户可以重试
      }
    });
  };

  // 处理从知识库移除文档
  const handleRemoveDocument = (docId: string) => {
    // 添加确认对话框
    if (window.confirm('确定要从知识库中移除此文档吗？')) {
      removeDocumentMutation.mutate(docId, {
        onSuccess: () => {
          console.log('Document removed from knowledge base successfully');
        },
        onError: (error) => {
          console.error('Failed to remove document from knowledge base:', error);
          // 可以在这里添加错误提示
        }
      });
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: deepThinkingEnabled 
          ? "I have analyzed the repository deeply using multi-step reasoning. Based on 'Project Alpha Specs' and recent meeting notes, the requirement you asked about involves a three-phase rollout..." 
          : "Based on the team knowledge base, I found 3 relevant documents. The answer is that we typically deploy to staging every Tuesday.",
        timestamp: 'Just now'
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1500);
  };

  return (
    <div className="flex h-full bg-white animate-fade-in">
      {/* LEFT: Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="h-16 border-b border-gray-100 flex items-center justify-between px-6 bg-white shrink-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900">{t.knowledge.title}</h1>
              <p className="text-xs text-gray-500">{t.knowledge.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'ai' && (
                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 flex-shrink-0 mt-1 ring-4 ring-white shadow-sm">
                  <Bot className="h-5 w-5" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-primary-600 text-white rounded-br-none' 
                  : 'bg-white border border-gray-100 text-gray-700 rounded-bl-none'
              }`}>
                {msg.content}
              </div>
              {msg.role === 'user' && (
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0 mt-1 ring-4 ring-white shadow-sm">
                  <User className="h-5 w-5" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white border-t border-gray-100 shrink-0">
          <div className="max-w-4xl mx-auto space-y-3">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3">
              {/* KB Selector */}
              <div className="relative group">
                <Database className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500 group-hover:text-primary-600 transition-colors" />
                <select 
                  value={selectedBase}
                  onChange={(e) => setSelectedBase(e.target.value)}
                  className="pl-8 pr-8 py-1.5 text-xs font-medium bg-gray-50 border border-gray-200 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <option value="personal">{t.knowledge.personalBase}</option>
                  <option value="team">{t.knowledge.teamBase}</option>
                </select>
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none border-l border-gray-300 pl-2 ml-2">
                   <span className="text-[10px] text-gray-400">▼</span>
                </div>
              </div>

              {/* Toggles */}
              <button 
                onClick={() => setWebSearchEnabled(!webSearchEnabled)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                  webSearchEnabled 
                    ? 'bg-blue-50 text-blue-600 border-blue-200 shadow-sm' 
                    : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Globe className="h-3.5 w-3.5" />
                {t.knowledge.webSearch}
              </button>

              <button 
                onClick={() => setDeepThinkingEnabled(!deepThinkingEnabled)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                  deepThinkingEnabled 
                    ? 'bg-purple-50 text-purple-600 border-purple-200 shadow-sm' 
                    : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Sparkles className="h-3.5 w-3.5" />
                {t.knowledge.deepThinking}
              </button>
            </div>

            {/* Text Area */}
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={t.knowledge.chatPlaceholder}
                className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all resize-none text-sm min-h-[50px] max-h-[150px]"
                rows={1}
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim()}
                className="absolute right-2 bottom-2 p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Sidebar File List */}
      <div className="w-80 bg-gray-50 border-l border-gray-200 flex-col gap-6 hidden xl:flex overflow-hidden">
        {/* File List */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="px-6 py-3 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-gray-500" />
              {t.knowledge.indexedFilesTitle}
            </h3>
            <button 
              className="p-1.5 bg-white border border-gray-200 hover:border-primary-200 hover:text-primary-600 rounded-md text-gray-500 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed" 
              title={t.knowledge.uploadNew}
              onClick={() => setIsFilePickerOpen(true)}
              disabled={addDocumentMutation.isPending}
            >
              {addDocumentMutation.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Plus className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-2">
            {kbLoading || docsLoading ? (
              <div className="flex items-center justify-center h-32 text-gray-400">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Loading knowledge base...</span>
              </div>
            ) : kbError || docsError ? (
              <div className="flex flex-col items-center justify-center h-32 text-red-400">
                <XCircle className="h-8 w-8 mb-2" />
                <p className="text-sm">Failed to load knowledge base</p>
                <p className="text-xs mt-1">Please try again later</p>
              </div>
            ) : !knowledgeBaseDocs || knowledgeBaseDocs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                <File className="h-8 w-8 mb-2" />
                <p className="text-sm">No indexed files</p>
                <p className="text-xs mt-1">Click the + button to add documents</p>
              </div>
            ) : (
              knowledgeBaseDocs.map((doc) => (
                <div key={doc.id} className="bg-white p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <h4 className="font-medium text-sm text-gray-900 truncate">{doc.document.name}</h4>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>{doc.document.type}</span>
                        <span>Added by {doc.addedBy.name}</span>
                        <span>{new Date(doc.addedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="ml-2 flex-shrink-0">
                      <button
                        onClick={() => handleRemoveDocument(doc.document.id)}
                        disabled={removeDocumentMutation.isPending}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Remove from knowledge base"
                      >
                        {removeDocumentMutation.isPending && removeDocumentMutation.variables === doc.document.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <XCircle className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* FilePicker Modal */}
        {fileNodes && (
          <FilePickerModal 
            isOpen={isFilePickerOpen}
            onClose={() => setIsFilePickerOpen(false)}
            onSelect={handleFileSelect}
            fileNodes={fileNodes}
          />
        )}
      </div>
    </div>
  );
};
