import React, { useState } from 'react';
import { useLanguage } from '@/lib/i18n';
import { Button } from '@/components/ui/Button';

// Import community components
import { DiscussionList } from '@/components/community/DiscussionList';
import { DiscussionDetail } from '@/components/community/DiscussionDetail';
import { CreateDiscussion } from '@/components/community/CreateDiscussion';
import { TagCloud } from '@/components/community/TagCloud';

const AdBanner: React.FC = () => {
    const { t } = useLanguage();
    return (
        <div className="my-6 p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="absolute top-2 right-2 text-[10px] text-gray-400 border border-gray-300 px-1 rounded">{t.community.adLabel}</div>
            <p className="text-sm font-semibold text-gray-700 mb-1">{t.community.sponsored}</p>
            <p className="text-xs text-gray-500 max-w-sm">
                Unlock premium features with Lite-Wiki Pro. Get unlimited storage and advanced AI models today.
            </p>
            <Button size="sm" variant="outline" className="mt-3 text-xs">Learn More</Button>
        </div>
    );
};

export const Community: React.FC = () => {
    const { t } = useLanguage();
  
    // View Navigation State
    const [viewMode, setViewMode] = useState<'list' | 'detail' | 'create'>('list');
    const [selectedDiscussionId, setSelectedDiscussionId] = useState<string | null>(null);
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    // --- Navigation Handlers ---
    const handleDiscussionClick = (discussion: any) => {
        setSelectedDiscussionId(discussion.id);
        setViewMode('detail');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCreateNewClick = () => {
        setViewMode('create');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBackToList = () => {
        setViewMode('list');
        setSelectedDiscussionId(null);
    };

    const handleTagSelect = (tag: string) => {
        setSelectedTag(tag === selectedTag ? null : tag);
        // If we're not in list view, switch to it to show filtered results
        if (viewMode !== 'list') {
            setViewMode('list');
        }
    };

    // --- Render based on view mode ---
    const renderContent = () => {
        switch (viewMode) {
            case 'detail':
                return selectedDiscussionId ? (
                    <DiscussionDetail 
                        discussionId={selectedDiscussionId} 
                        onBack={handleBackToList} 
                    />
                ) : null;
            
            case 'create':
                return (
                    <CreateDiscussion 
                        onBack={handleBackToList} 
                        onSuccess={handleBackToList} 
                    />
                );
            
            case 'list':
            default:
                return (
                    <div className="flex gap-6">
                        <div className="flex-1">
                            <DiscussionList 
                                onDiscussionClick={handleDiscussionClick} 
                                onCreateNewClick={handleCreateNewClick}
                            />
                        </div>
                        
                        {/* Sidebar with TagCloud */}
                        <div className="w-80 hidden lg:block">
                            <TagCloud 
                                onTagClick={handleTagSelect}
                                selectedTag={selectedTag || undefined}
                            />
                            
                            {/* Ad Banner */}
                            <AdBanner />
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="container mx-auto px-4 py-6">
            {renderContent()}
        </div>
    );
};