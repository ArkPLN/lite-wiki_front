
import React, { useState, useCallback } from 'react';
import { Star, FileText, Folder, Search, MoreVertical, Plus, Edit2, X, Tag, CheckCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { Button } from '@/components/ui/Button';
import { DashboardItem, FileNode } from '@/types';
import { FilePickerModal, EditItemModal } from '@/components/dashboard/SharedModals';
import { SearchFilterBar, SearchParams } from '@/components/dashboard/SearchFilterBar';
import useUserStore from '@/store';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFavorites, postFavoriteById } from '@/reqapi/favor';
import { FavoriteResponse } from '@/types/docs/doc';
import { debounce } from '@/utils/debounce';



export const Favorites: React.FC = () => {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const { fileNodes } = useUserStore();
  
  // Search State
  const [searchParams, setSearchParams] = useState<SearchParams>({ query: '', date: '', tag: '', mode: 'blur' });
  
  // Modal States
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DashboardItem | null>(null);

  // Notification State
  const [notification, setNotification] = useState<{
    show: boolean;
    type: 'success' | 'error';
    message: string;
  }>({ show: false, type: 'success', message: '' });

  // Show notification helper
  const showNotification = useCallback((type: 'success' | 'error', message: string) => {
    setNotification({ show: true, type, message });
    // Auto hide after 3 seconds
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  }, []);

  // React Query for favorites data
  const {
    data: favoritesData = [],
    isLoading: isFavoritesLoading,
    error: favoritesError,
    refetch: refetchFavorites
  } = useQuery({
    queryKey: ['favorites'],
    queryFn: getFavorites,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Transform Document[] to DashboardItem[]
  const items: DashboardItem[] = favoritesData.map(doc => ({
    id: doc.id,
    name: doc.name,
    type: doc.type === 'text/markdown' ? 'markdown' : 'text',
    location: doc.folderId ? `/folder/${doc.folderId}` : '/',
    date: new Date(doc.updatedAt).toLocaleDateString(),
    isoDate: doc.updatedAt.split('T')[0],
    tags: doc.tags || [],
    meta: doc
  }));

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

  // Mutation for favorite/unfavorite actions
  const favoriteMutation = useMutation({
    mutationFn: postFavoriteById,
    onSuccess: (data: FavoriteResponse) => {
      // Refresh favorites list after successful favorite/unfavorite
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      
      // Show feedback based on response
      if (data.message === 'Document added to favorites') {
        showNotification('success', t.library.favoriteAdded || '已添加到收藏');
      } else {
        showNotification('success', t.library.favoriteRemoved || '已从收藏中移除');
      }
    },
    onError: (error: any) => {
      console.error('Favorite operation failed:', error);
      showNotification('error', error?.message || t.common.error || '操作失败');
    }
  });

  // Debounced favorite function to prevent rapid requests
  const debouncedFavorite = useCallback(
    debounce((documentId: string) => {
      favoriteMutation.mutate(documentId);
    }, 500),
    [favoriteMutation]
  );

  // Handle favorite/unfavorite for existing items
  const handleRemove = useCallback((id: string) => {
    debouncedFavorite(id);
  }, [debouncedFavorite]);

  // Handle adding new favorites from FilePickerModal
  const handleAdd = useCallback((node: FileNode, path: string) => {
    // Use the node's id to add to favorites
    if (node.id) {
      debouncedFavorite(node.id);
    }
  }, [debouncedFavorite]);

  const openEdit = useCallback((item: DashboardItem) => {
    setEditingItem(item);
    setIsEditOpen(true);
  }, []);

  const handleSaveEdit = useCallback((id: string, newName: string, newTags: string[]) => {
    // Since we're using React Query for data management, we should update the cache
    // For now, we'll just invalidate the query to refetch data
    queryClient.invalidateQueries({ queryKey: ['favorites'] });
  }, [queryClient]);

  return (
    <div className="p-8 max-w-7xl mx-auto h-full overflow-y-auto animate-fade-in">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 ${
          notification.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          )}
          <span className="font-medium">{notification.message}</span>
          <button
            onClick={() => setNotification(prev => ({ ...prev, show: false }))}
            className="ml-2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
            {t.library.favoritesTitle}
          </h1>
          <p className="text-gray-500 mt-1">{t.library.favoritesDesc}</p>
        </div>
        <Button 
          className="flex items-center gap-2" 
          onClick={() => setIsPickerOpen(true)}
          disabled={favoriteMutation.isPending}
        >
          {favoriteMutation.isPending ? (
            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          {t.library.addFavorite}
        </Button>
      </div>

      {items.length > 0 && !isFavoritesLoading && (
         <SearchFilterBar availableTags={allTags} onSearch={setSearchParams} />
      )}

      {isFavoritesLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl border border-gray-200">
          <div className="h-8 w-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-500">{t.common.loading || '加载中...'}</p>
        </div>
      ) : favoritesError ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl border border-gray-200">
          <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <X className="h-8 w-8 text-red-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">{t.common.error || '加载失败'}</h3>
          <p className="text-gray-500 max-w-sm mb-4">
            {favoritesError?.message || t.common.errorLoading || '无法加载收藏列表'}
          </p>
          <Button onClick={() => refetchFavorites()} className="flex items-center gap-2">
            <X className="h-4 w-4" />
            {t.common.retry || '重试'}
          </Button>
        </div>
      ) : items.length > 0 ? (
        filteredItems.length > 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <div className="col-span-5">{t.dashboard.documents}</div>
                <div className="col-span-3">{t.library.location}</div>
                <div className="col-span-2">{t.library.dateAdded}</div>
                <div className="col-span-2 text-right">{t.team.actions}</div>
            </div>

            {/* List */}
            <div className="divide-y divide-gray-100">
                {filteredItems.map(item => (
                <div key={item.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 transition-colors group">
                    <div className="col-span-5 flex flex-col justify-center">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg flex-shrink-0 ${item.type === 'folder' ? 'bg-blue-100 text-blue-600' : 'bg-indigo-100 text-indigo-600'}`}>
                            {item.type === 'folder' ? <Folder className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                            </div>
                            <div className="min-w-0">
                            <h3 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors truncate" title={item.name}>{item.name}</h3>
                            {/* Tags Display */}
                            {item.tags.length > 0 && (
                                <div className="flex gap-1 mt-1 flex-wrap">
                                    {item.tags.slice(0, 3).map((tag, idx) => (
                                        <span key={idx} className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded border border-gray-200">{tag}</span>
                                    ))}
                                    {item.tags.length > 3 && <span className="text-[10px] text-gray-400">+{item.tags.length - 3}</span>}
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
                    <div className="col-span-2 text-right flex items-center justify-end gap-2">
                        <button 
                            onClick={() => openEdit(item)}
                            className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            title={t.common.edit}
                        >
                            <Edit2 className="h-4 w-4" />
                        </button>
                    <button 
                        onClick={() => handleRemove(item.id)}
                        disabled={favoriteMutation.isPending}
                        className="p-1.5 text-yellow-500 hover:bg-yellow-50 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title={t.library.removeFromFavorites}
                    >
                        {favoriteMutation.isPending ? (
                            <div className="h-4 w-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Star className="h-4 w-4 fill-yellow-500" />
                        )}
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
          <div className="h-16 w-16 bg-yellow-50 rounded-full flex items-center justify-center mb-4">
            <Star className="h-8 w-8 text-yellow-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">{t.library.noFavorites}</h3>
          <p className="text-gray-500 max-w-sm">{t.library.noFavoritesDesc}</p>
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
