
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
  File
} from 'lucide-react';
import { useLanguage } from '../../lib/i18n';

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

// --- SUBCOMPONENT: Storage Donut Chart ---
const StorageChart = ({ used, limit }: { used: number; limit: number }) => {
  const percent = Math.min((used / limit) * 100, 100);
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  
  return (
    <div className="relative flex items-center justify-center py-2">
      <svg className="transform -rotate-90 w-32 h-32">
        {/* Track */}
        <circle cx="64" cy="64" r={radius} stroke="#f3f4f6" strokeWidth="8" fill="transparent" />
        {/* Indicator */}
        <circle 
          cx="64" cy="64" r={radius} 
          stroke={percent > 90 ? '#ef4444' : '#4f46e5'} 
          strokeWidth="8" 
          fill="transparent" 
          strokeDasharray={circumference} 
          strokeDashoffset={offset} 
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-xl font-bold text-slate-900">{Math.round(percent)}%</div>
        <div className="text-[10px] text-gray-500 uppercase tracking-wider">Used</div>
      </div>
    </div>
  );
};

// --- SUBCOMPONENT: File Type Distribution ---
const DistributionChart = ({ data }: { data: { type: string; count: number; color: string }[] }) => {
  const total = data.reduce((acc, curr) => acc + curr.count, 0);
  
  return (
    <div className="space-y-3 mt-2">
      <div className="flex h-2 rounded-full overflow-hidden bg-gray-100 w-full">
        {data.map((item, i) => (
          <div 
            key={i}
            style={{ width: `${(item.count / total) * 100}%`, backgroundColor: item.color }}
            className="h-full transition-all duration-500"
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {data.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
            <span className="text-xs text-gray-600 flex-1 truncate">{item.type}</span>
            <span className="text-xs font-bold text-gray-900">{Math.round((item.count/total)*100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

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

  // Mock Stats Data
  const stats = {
    totalVectors: '1.2M',
    storageUsed: 450, // MB
    storageLimit: 1024, // MB
    lastUpdated: '2 hours ago',
    filesCount: 124,
    fileDistribution: [
      { type: 'PDF', count: 45, color: '#ef4444' }, // Red
      { type: 'Markdown', count: 55, color: '#3b82f6' }, // Blue
      { type: 'Docs', count: 15, color: '#2563eb' }, // Darker Blue
      { type: 'Other', count: 9, color: '#9ca3af' }, // Gray
    ]
  };

  const indexedFiles: IndexedFile[] = [
    { id: '1', name: 'Project_Alpha_Specs.pdf', type: 'PDF', size: '2.4MB', updated: '2h ago', status: 'indexed' },
    { id: '2', name: 'Meeting_Notes_Q3.md', type: 'Markdown', size: '15KB', updated: '5h ago', status: 'indexed' },
    { id: '3', name: 'API_Documentation_v2.docx', type: 'Word', size: '1.1MB', updated: '1d ago', status: 'processing' },
    { id: '4', name: 'Engineering_Guidelines.md', type: 'Markdown', size: '8KB', updated: '2d ago', status: 'indexed' },
  ];

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

      {/* RIGHT: Sidebar Statistics */}
      <div className="w-80 bg-gray-50 border-l border-gray-200 flex-col gap-6 hidden xl:flex overflow-hidden">
        
        {/* Top Stats Area */}
        <div className="p-6 pb-0 overflow-y-auto scrollbar-hide">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <PieChart className="h-4 w-4 text-primary-600" />
            {t.knowledge.statsTitle}
          </h3>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-6">
            {/* Storage Chart */}
            <div>
              <StorageChart used={stats.storageUsed} limit={stats.storageLimit} />
              <div className="flex justify-between text-xs text-gray-500 mt-2 px-2">
                <span>0 GB</span>
                <span>{stats.storageUsed}MB Used</span>
                <span>1 GB</span>
              </div>
            </div>

            {/* File Distribution */}
            <div className="border-t border-gray-100 pt-4">
              <span className="text-xs font-semibold text-gray-500 uppercase">Content Types</span>
              <DistributionChart data={stats.fileDistribution} />
            </div>

            {/* General Metrics */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-center">
                <div className="text-lg font-bold text-slate-900">{stats.filesCount}</div>
                <div className="text-[10px] text-gray-500 uppercase">{t.knowledge.filesIndexed}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-center">
                <div className="text-lg font-bold text-slate-900">{stats.totalVectors}</div>
                <div className="text-[10px] text-gray-500 uppercase">{t.knowledge.vectorCount}</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400">
              <Clock className="h-3 w-3" />
              {t.knowledge.lastUpdated}: {stats.lastUpdated}
            </div>
          </div>
        </div>

        {/* File List */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="px-6 py-3 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-gray-500" />
              {t.knowledge.indexedFilesTitle}
            </h3>
            <button className="p-1.5 bg-white border border-gray-200 hover:border-primary-200 hover:text-primary-600 rounded-md text-gray-500 transition-all shadow-sm" title={t.knowledge.uploadNew}>
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-2">
            {indexedFiles.map(file => (
              <div key={file.id} className="p-3 bg-white hover:bg-blue-50/50 rounded-xl border border-gray-200 hover:border-blue-100 flex items-center gap-3 transition-all group cursor-pointer shadow-sm">
                <div className={`p-2 rounded-lg shrink-0 ${file.type === 'PDF' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                  {file.type === 'PDF' ? <FileText className="h-4 w-4" /> : <File className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-medium text-gray-900 truncate pr-2" title={file.name}>{file.name}</h4>
                    {file.status === 'processing' && (
                      <span className="flex h-2 w-2 relative shrink-0 mt-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-400 flex justify-between mt-0.5">
                    <span>{file.size}</span>
                    <span className="group-hover:text-gray-600 transition-colors">{file.updated}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
