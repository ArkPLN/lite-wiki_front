
import React, { useState } from 'react';
import { 
  Folder, FileText, ChevronRight, ChevronDown, Lock, Unlock, AlertCircle, Save, 
  CheckCircle2, Archive, AlertOctagon, History, ListChecks, Trash2
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FileNode, FileVersion, VersionState } from '../../../types';
import { MOCK_USER } from '../../../constants';
import { useLanguage } from '../../../lib/i18n';

// --- MOCK DATA ---
const INITIAL_VERSIONS: FileVersion[] = [
  { id: 'v3', version: 'V2.4', state: 'working', updatedAt: '2 hours ago', author: 'Sarah Chen' },
  { id: 'v2', version: 'V2.3', state: 'locked', updatedAt: 'Yesterday', author: 'Mike Design' },
  { id: 'v1', version: 'V1.0', state: 'archived', updatedAt: '1 month ago', author: 'Alex Developer' },
];

const INITIAL_TEAM_FILES: FileNode[] = [
  {
    id: 't-1', name: 'Engineering Standards', type: 'folder',
    children: [
      { 
        id: 't-1-1', 
        name: 'Coding Guidelines.md', 
        type: 'markdown', 
        content: '# Coding Guidelines\n\n1. Use TypeScript\n2. Write Tests\n3. Document everything.',
        currentVersion: 'V2.4',
        versions: INITIAL_VERSIONS
      },
      { id: 't-1-2', name: 'Deployment Process.md', type: 'markdown', content: '# Deployment\n\nWe use CI/CD pipelines.', currentVersion: 'V1.1', versions: [INITIAL_VERSIONS[2]] },
    ]
  },
  { id: 't-2', name: 'Onboarding.md', type: 'markdown', content: '# Welcome to the Team!\n\nHere is what you need to know...', currentVersion: 'V3.0', versions: INITIAL_VERSIONS }
];

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

// Batch delete recursive
const batchDeleteRecursive = (nodes: FileNode[], idsToDelete: Set<string>): FileNode[] => {
  return nodes
    .filter(node => !idsToDelete.has(node.id))
    .map(node => ({
      ...node,
      children: node.children ? batchDeleteRecursive(node.children, idsToDelete) : undefined
    }));
};

// --- COMPONENT: Version Badge (Reused logic) ---
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

// Simplified FileTreeItem for the Wiki
const FileTreeItem: React.FC<{ 
  node: FileNode; 
  level: number; 
  activeId: string; 
  expandedIds: Set<string>; 
  onToggle: (id: string) => void; 
  onSelect: (node: FileNode) => void; 
  isBatchMode?: boolean;
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string) => void;
}> = ({ node, level, activeId, expandedIds, onToggle, onSelect, isBatchMode, selectedIds, onToggleSelect }) => {
  const isOpen = expandedIds.has(node.id);
  const isFolder = node.type === 'folder';
  
  return (
    <div>
      <div 
        onClick={() => {
           if (isBatchMode && onToggleSelect) {
             // In batch mode, we could allow navigation, but let's stick to standard for now.
             // Usually clicking the item selects it.
           }
           isFolder ? onToggle(node.id) : onSelect(node)
        }}
        className={`flex items-center gap-2 py-1.5 px-2 rounded-md cursor-pointer transition-colors text-sm ${
          activeId === node.id ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-600 hover:bg-gray-100'
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

        <span className="text-gray-400">
          {isFolder && (isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)}
        </span>
        {isFolder ? <Folder className="h-4 w-4 text-blue-400" /> : <FileText className="h-4 w-4" />}
        <span className="truncate">{node.name}</span>
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
            isBatchMode={isBatchMode}
            selectedIds={selectedIds}
            onToggleSelect={onToggleSelect}
        />
      ))}
    </div>
  );
};

export const TeamWiki: React.FC = () => {
  // File State
  const [files, setFiles] = useState<FileNode[]>(INITIAL_TEAM_FILES);
  const [activeFileId, setActiveFileId] = useState<string>('t-1-1');
  const [content, setContent] = useState<string>(INITIAL_TEAM_FILES[0].children![0].content || '');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['t-1']));
  const { t } = useLanguage();

  // Batch Mode State
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const activeNode = findNodeById(files, activeFileId);

  // Locking State
  const [lockState, setLockState] = useState<{
    isLocked: boolean;
    lockedBy: string | null; // User ID
    lockedByName: string | null;
  }>({
    isLocked: true, // Initially locked by someone else for demo purposes, or just locked in general
    lockedBy: 'u-999',
    lockedByName: 'Sarah Chen'
  });

  const handleToggleFolder = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSelectFile = (node: FileNode) => {
    setActiveFileId(node.id);
    setContent(node.content || '');
    // Reset lock state simulation when switching files
    setLockState({
      isLocked: false,
      lockedBy: null,
      lockedByName: null
    });
  };

  const requestLock = () => {
    // Simulate API call to lock file
    setLockState({
      isLocked: true,
      lockedBy: MOCK_USER.id,
      lockedByName: MOCK_USER.name
    });
  };

  const releaseLock = () => {
    setLockState({
      isLocked: false,
      lockedBy: null,
      lockedByName: null
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
    if (!window.confirm(confirmMessage)) return;

    // Check if active file is being deleted
    if (selectedIds.has(activeFileId)) {
        setActiveFileId('');
        setContent('');
        // Reset lock if needed
    }

    setFiles(prev => batchDeleteRecursive(prev, selectedIds));
    setSelectedIds(new Set());
    setIsBatchMode(false);
  };

  const isLockedByMe = lockState.isLocked && lockState.lockedBy === MOCK_USER.id;
  const isLockedByOther = lockState.isLocked && lockState.lockedBy !== MOCK_USER.id;
  const isReadOnly = !isLockedByMe;

  return (
    <div className="flex h-full bg-white animate-fade-in">
      {/* Sidebar - File Tree */}
      <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
           <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t.team.teamDocs}</h2>
        </div>
        <div className="p-2 overflow-y-auto flex-1">
          {files.map(node => (
             <FileTreeItem 
               key={node.id} 
               node={node} 
               level={0} 
               activeId={activeFileId} 
               expandedIds={expandedIds} 
               onToggle={handleToggleFolder} 
               onSelect={handleSelectFile} 
               isBatchMode={isBatchMode}
               selectedIds={selectedIds}
               onToggleSelect={handleToggleSelect}
             />
          ))}
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
                  disabled={selectedIds.size === 0}
                  className="flex-1 py-1.5 px-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-medium flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
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

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Toolbar */}
        <div className="h-14 border-b border-gray-200 flex items-center justify-between px-6 bg-white shadow-sm z-10">
          <div className="flex items-center gap-2">
             <FileText className="h-5 w-5 text-gray-400" />
             <span className="font-semibold text-gray-800">
               {activeNode ? activeNode.name : 'Selected Document'}
             </span>
             {activeNode && (
               <VersionBadge currentVersion={activeNode.currentVersion} versions={activeNode.versions} />
             )}
          </div>

          <div className="flex items-center gap-3">
             {isLockedByOther ? (
               <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-md text-sm border border-amber-200">
                 <Lock className="h-4 w-4" />
                 <span>{t.team.lockedBy} {lockState.lockedByName}</span>
               </div>
             ) : isLockedByMe ? (
               <div className="flex items-center gap-2">
                 <span className="text-xs text-green-600 font-medium px-2 py-1 bg-green-50 rounded">{t.team.editingMode}</span>
                 <button 
                   onClick={releaseLock}
                   className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm transition-colors"
                 >
                   <Unlock className="h-4 w-4" /> {t.team.releaseLock}
                 </button>
                 <button className="flex items-center gap-2 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-md text-sm shadow-sm transition-colors">
                   <Save className="h-4 w-4" /> {t.team.save}
                 </button>
               </div>
             ) : (
               <button 
                 onClick={requestLock}
                 className="flex items-center gap-2 px-3 py-1.5 bg-white border border-primary-600 text-primary-600 hover:bg-primary-50 rounded-md text-sm transition-colors font-medium"
               >
                 <Lock className="h-4 w-4" /> {t.team.editDocument}
               </button>
             )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
           {/* Editor Input */}
           <div className={`w-1/2 h-full border-r border-gray-200 flex flex-col transition-opacity ${isReadOnly ? 'opacity-50 pointer-events-none bg-gray-50' : 'bg-white'}`}>
              <div className="bg-gray-50 px-4 py-1.5 text-xs font-semibold text-gray-500 uppercase border-b border-gray-200 flex justify-between">
                <span>{t.team.markdownInput}</span>
                {isReadOnly && <span className="text-amber-600 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {t.team.readOnly}</span>}
              </div>
              <textarea 
                 className="flex-1 p-6 resize-none focus:outline-none font-mono text-sm leading-relaxed text-slate-800"
                 value={content}
                 onChange={(e) => setContent(e.target.value)}
                 disabled={isReadOnly}
              />
           </div>

           {/* Preview */}
           <div className="w-1/2 h-full bg-white flex flex-col">
              <div className="bg-gray-50 px-4 py-1.5 text-xs font-semibold text-gray-500 uppercase border-b border-gray-200">{t.team.livePreview}</div>
              <div className="flex-1 p-8 overflow-y-auto prose prose-indigo max-w-none prose-sm">
                 <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
