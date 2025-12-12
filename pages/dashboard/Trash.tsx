
import React, { useState, useCallback } from 'react';
import { Trash2, RefreshCw, FileText, Folder, AlertTriangle, X, Plus, Edit2, Search } from 'lucide-react';
import { useLanguage } from '../../lib/i18n';
import { Button } from '../../components/ui/Button';
import { DashboardItem, FileNode } from '../../types';
import { FilePickerModal, EditItemModal } from '../../components/dashboard/SharedModals';
import { SearchFilterBar, SearchParams } from '../../components/dashboard/SearchFilterBar';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRecycleBin, restoreFromRecycleBinById, removeFromRecycleBinById, emptyRecycleBin } from '../../reqapi/recycle';
import { documentToDashboardItem } from '../../utils/documentUtils';
import { debounce } from '../../utils/debounce';
import useUserStore from '@/store';

export const Trash: React.FC = () => {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const fileNodes = useUserStore(state => state.fileNodes);
  
  // Search State
  const [searchParams, setSearchParams] = useState<SearchParams>({ query: '', date: '', tag: '', mode: 'blur' });

  // Modal States
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DashboardItem | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  // 获取回收站数据
  const { data: recycleBinData = [], isLoading, error, refetch } = useQuery({
    queryKey: ['recycleBin'],
    queryFn: getRecycleBin,
    staleTime: 5 * 60 * 1000, // 5分钟
  });

  // 转换数据为DashboardItem格式
  const items: DashboardItem[] = recycleBinData.map(doc => documentToDashboardItem(doc, fileNodes));

  // 恢复文档的mutation
  const restoreMutation = useMutation({
    mutationFn: restoreFromRecycleBinById,
    onSuccess: () => {
      // 成功后刷新数据
      queryClient.invalidateQueries({ queryKey: ['recycleBin'] });
      queryClient.invalidateQueries({ queryKey: ['fileNodes'] });
    },
  });

  // 永久删除文档的mutation
  const deleteMutation = useMutation({
    mutationFn: removeFromRecycleBinById,
    onSuccess: () => {
      // 成功后刷新数据
      queryClient.invalidateQueries({ queryKey: ['recycleBin'] });
      queryClient.invalidateQueries({ queryKey: ['fileNodes'] });
    },
  });

  // 清空回收站的mutation
  const emptyTrashMutation = useMutation({
    mutationFn: emptyRecycleBin,
    onSuccess: (data) => {
      // 成功后刷新数据
      queryClient.invalidateQueries({ queryKey: ['recycleBin'] });
      queryClient.invalidateQueries({ queryKey: ['fileNodes'] });
      // 显示成功消息
      alert(data.message);
    },
    onError: (error) => {
      console.error('Failed to empty recycle bin:', error);
      alert('清空回收站失败，请稍后再试');
    }
  });

  // 防抖的恢复函数
  const debouncedRestore = useCallback(
    debounce((id: string) => {
      restoreMutation.mutate(id);
    }, 500),
    [restoreMutation]
  );

  // 防抖的删除函数
  const debouncedDelete = useCallback(
    debounce((id: string) => {
      if (window.confirm('确定要永久删除此文件吗？此操作不可撤销。')) {
        deleteMutation.mutate(id);
      }
    }, 500),
    [deleteMutation]
  );

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

  // 获取唯一标签用于下拉菜单
  const allTags = Array.from(new Set(items.flatMap(i => i.tags)));

  const handleRestore = (id: string) => {
    debouncedRestore(id);
  };

  const handleDeleteForever = (id: string) => {
    debouncedDelete(id);
  };

  const handleEmptyTrash = () => {
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmEmptyTrash = () => {
    emptyTrashMutation.mutate();
  };

  const handleAdd = (node: FileNode, path: string) => {
    // 这个功能可能需要重新考虑，因为回收站不应该有"添加到回收站"的功能
    // 或者这个功能是指将文件移动到回收站
    console.log('Add to recycle bin:', node, path);
    // 关闭文件选择器弹窗
    setIsPickerOpen(false);
  };

  const openEdit = (item: DashboardItem) => {
    setEditingItem(item);
    setIsEditOpen(true);
  };

  const handleSaveEdit = (id: string, newName: string, newTags: string[]) => {
    // 这里应该调用API来更新文档信息
    // 然后刷新数据
    console.log('Save edit:', id, newName, newTags);
    queryClient.invalidateQueries({ queryKey: ['recycleBin'] });
  };

  // 显示加载状态
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // 显示错误状态
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">加载失败</h3>
        <p className="text-gray-500 mb-4">无法加载回收站数据，请稍后再试</p>
        <Button onClick={() => refetch()}>重试</Button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto h-full overflow-y-auto animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Trash2 className="h-6 w-6 text-red-500" />
            {t.library.trashTitle}
            </h1>
            <p className="text-gray-500 mt-1">{t.library.trashDesc}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="flex items-center gap-2" onClick={() => setIsPickerOpen(true)}>
            <Plus className="h-4 w-4" />
            {t.library.addToTrash}
          </Button>
          {items.length > 0 && (
              <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50" onClick={handleEmptyTrash}>
                  {t.library.emptyTrash}
              </Button>
          )}
        </div>
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
                <div className="col-span-3">{t.library.location}</div>
                <div className="col-span-2">{t.library.dateDeleted}</div>
                <div className="col-span-2 text-right">{t.team.actions}</div>
            </div>

            {/* List */}
            <div className="divide-y divide-gray-100">
                {filteredItems.map(item => (
                <div key={item.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 transition-colors group">
                    <div className="col-span-5 flex items-center gap-3">
                        <div className={`p-2 rounded-lg opacity-60 ${item.type === 'folder' ? 'bg-blue-100 text-blue-600' : 'bg-indigo-100 text-indigo-600'}`}>
                        {item.type === 'folder' ? <Folder className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                        </div>
                        <div className="min-w-0">
                        <h3 className="font-medium text-gray-700 line-through decoration-gray-400 decoration-1 truncate" title={item.name}>{item.name}</h3>
                        <div className="flex items-center gap-2">
                            <p className="text-xs text-red-500">{item.meta?.daysLeft} {t.library.daysRemaining}</p>
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
                    <div className="col-span-3 text-sm text-gray-500 font-mono text-xs truncate" title={item.location}>
                    {item.location}
                    </div>
                    <div className="col-span-2 text-sm text-gray-500">
                    {item.date}
                    </div>
                    <div className="col-span-2 text-right flex justify-end gap-2">
                    <button 
                            onClick={() => openEdit(item)}
                            className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            title={t.common.edit}
                        >
                            <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button 
                        onClick={() => handleRestore(item.id)}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium"
                        title={t.library.restore}
                    >
                        <RefreshCw className="h-3.5 w-3.5" />
                    </button>
                    <button 
                        onClick={() => handleDeleteForever(item.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title={t.library.deleteForever}
                    >
                        <X className="h-3.5 w-3.5" />
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
          <div className="h-16 w-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
            <Trash2 className="h-8 w-8 text-green-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">{t.library.noTrash}</h3>
          <p className="text-gray-500 max-w-sm">{t.library.noTrashDesc}</p>
        </div>
      )}

      {/* Modals */}
      <FilePickerModal 
        isOpen={isPickerOpen} 
        onClose={() => setIsPickerOpen(false)} 
        onSelect={handleAdd} 
        fileNodes={fileNodes}
      />
      {editingItem && (
        <EditItemModal 
            isOpen={isEditOpen} 
            onClose={() => setIsEditOpen(false)} 
            item={editingItem} 
            onSave={handleSaveEdit} 
        />
      )}
      
      {/* Confirmation Dialog for Emptying Trash */}
      <ConfirmDialog
        open={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={handleConfirmEmptyTrash}
        title="清空回收站"
        message={`确定要永久删除回收站中的所有文件吗？此操作不可撤销，将永久删除 ${items.length} 个文件。`}
        confirmText="确认清空"
        cancelText="取消"
        type="warning"
      />
    </div>
  );
};
