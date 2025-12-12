
import React, { useState } from 'react';
import { Clock, FileText, Folder, MoreHorizontal, Plus, X, Edit2, Search } from 'lucide-react';
import { useLanguage } from '../../lib/i18n';
import { Button } from '../../components/ui/Button';
import { DashboardItem, FileNode } from '../../types';
import { FilePickerModal, EditItemModal } from '../../components/dashboard/SharedModals';
import { SearchFilterBar, SearchParams } from '../../components/dashboard/SearchFilterBar';
import useUserStore from '../../store';

// Helper to generate dates for demo
const getPastDate = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split('T')[0];
};

// Mock Data
const MOCK_RECENT: DashboardItem[] = [
  { id: '1', name: 'Weekly Sync Notes - Q1', type: 'markdown', location: '/Meeting Notes', date: '2 hours ago', isoDate: getPastDate(0), tags: ['Meeting'] },
  { id: '2', name: 'Project Requirements', type: 'markdown', location: '/Projects/Alpha', date: '5 hours ago', isoDate: getPastDate(0), tags: [] },
  { id: '3', name: 'Architecture Diagrams', type: 'folder', location: '/Projects/Alpha/Assets', date: 'Yesterday', isoDate: getPastDate(1), tags: ['Arch', 'Design'] },
  { id: '4', name: 'Team Roster', type: 'text', location: '/General', date: '2 days ago', isoDate: getPastDate(2), tags: ['HR'] },
  { id: '5', name: 'Budget Planning', type: 'markdown', location: '/Finance', date: '3 days ago', isoDate: getPastDate(3), tags: ['Finance'] },
];

export const Recent: React.FC = () => {
  const { t } = useLanguage();
  const [items, setItems] = useState<DashboardItem[]>(MOCK_RECENT);
  const { fileNodes } = useUserStore();
  
  // Search State
  const [searchParams, setSearchParams] = useState<SearchParams>({ query: '', date: '', tag: '', mode: 'blur' });

  // Modal States
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DashboardItem | null>(null);

  // Filtering Logic
  const filteredItems = items.filter(item => {
    // 1. Name Match
    let nameMatch = true;
    if (searchParams.query) {
      if (searchParams.mode === 'accurate') {
        nameMatch = item.name.toLowerCase() === searchParams.query.toLowerCase();
      } else {
        nameMatch = item.name.toLowerCase().includes(searchParams.query.toLowerCase());
      }
    }

    // 2. Date Match
    let dateMatch = true;
    if (searchParams.date) {
      dateMatch = item.isoDate === searchParams.date;
    }

    // 3. Tag Match
    let tagMatch = true;
    if (searchParams.tag) {
      tagMatch = item.tags.includes(searchParams.tag);
    }

    return nameMatch && dateMatch && tagMatch;
  });

  // Get unique tags for dropdown
  const allTags = Array.from(new Set(items.flatMap(i => i.tags)));

  const handleAdd = (node: FileNode, path: string) => {
    const newItem: DashboardItem = {
      id: Date.now().toString(),
      name: node.name,
      type: node.type,
      location: path,
      date: 'Just now',
      isoDate: getPastDate(0),
      tags: []
    };
    setItems(prev => [newItem, ...prev]);
  };

  const handleRemove = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const openEdit = (item: DashboardItem) => {
    setEditingItem(item);
    setIsEditOpen(true);
  };

  const handleSaveEdit = (id: string, newName: string, newTags: string[]) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, name: newName, tags: newTags } : item));
  };

  return (
    <div className="p-8 max-w-7xl mx-auto h-full overflow-y-auto animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Clock className="h-6 w-6 text-primary-600" />
            {t.library.recentTitle}
          </h1>
          <p className="text-gray-500 mt-1">{t.library.recentDesc}</p>
        </div>
        <Button className="flex items-center gap-2" onClick={() => setIsPickerOpen(true)}>
          <Plus className="h-4 w-4" />
          {t.library.addRecent}
        </Button>
      </div>

      {items.length > 0 && (
         <SearchFilterBar availableTags={allTags} onSearch={setSearchParams} />
      )}

      {items.length > 0 ? (
        filteredItems.length > 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <div className="col-span-5">{t.dashboard.documents}</div>
                <div className="col-span-4">{t.library.location}</div>
                <div className="col-span-2 text-right">{t.library.lastAccessed}</div>
                <div className="col-span-1"></div>
            </div>

            {/* List */}
            <div className="divide-y divide-gray-100">
                {filteredItems.map(item => (
                <div key={item.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 transition-colors group cursor-pointer">
                    <div className="col-span-5 flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${item.type === 'folder' ? 'bg-blue-100 text-blue-600' : 'bg-indigo-100 text-indigo-600'}`}>
                        {item.type === 'folder' ? <Folder className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors truncate">{item.name}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                            <p className="text-xs text-gray-400 capitalize">{item.type}</p>
                            {item.tags.length > 0 && (
                                <div className="flex gap-1">
                                    {item.tags.slice(0, 2).map((tag, idx) => (
                                        <span key={idx} className="px-1 py-0 bg-gray-100 text-gray-400 text-[9px] rounded border border-gray-200">{tag}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                        </div>
                    </div>
                    <div className="col-span-4 text-sm text-gray-500 font-mono text-xs truncate">
                    {item.location}
                    </div>
                    <div className="col-span-2 text-right flex items-center justify-end gap-2">
                    <span className="text-sm text-gray-500">{item.date}</span>
                    </div>
                    <div className="col-span-1 flex justify-end gap-1">
                        <button 
                            onClick={(e) => { e.stopPropagation(); openEdit(item); }}
                            className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            title={t.common.edit}
                        >
                            <Edit2 className="h-4 w-4" />
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); handleRemove(item.id); }}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                            title={t.library.removeItem}
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
                ))}
            </div>
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl border border-gray-200">
                <Search className="h-10 w-10 text-gray-300 mb-3" />
                <h3 className="text-gray-900 font-medium mb-1">{t.dashboard.search.noResults}</h3>
                <p className="text-gray-500 text-sm">{t.dashboard.search.noResultsDesc}</p>
            </div>
        )
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl border border-gray-200 border-dashed">
          <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Clock className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">{t.library.noRecent}</h3>
          <p className="text-gray-500 max-w-sm">{t.library.noRecentDesc}</p>
        </div>
      )}

      {/* Modals */}
      {fileNodes && (
        <FilePickerModal 
          isOpen={isPickerOpen} 
          onClose={() => setIsPickerOpen(false)} 
          onSelect={handleAdd} 
          fileNodes={fileNodes}
        />
      )}
      {editingItem && (
        <EditItemModal 
            isOpen={isEditOpen} 
            onClose={() => setIsEditOpen(false)} 
            item={editingItem} 
            onSave={handleSaveEdit} 
        />
      )}
    </div>
  );
};
