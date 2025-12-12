


import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, Tag, X, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';
import { useLanguage } from '../../lib/i18n';

export type SearchMode = 'accurate' | 'blur';

export interface SearchParams {
  query: string;
  date: string;
  tag: string;
  mode: SearchMode;
}

interface SearchFilterBarProps {
  availableTags: string[];
  onSearch: (params: SearchParams) => void;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({ availableTags, onSearch }) => {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [date, setDate] = useState('');
  const [tag, setTag] = useState('');
  const [mode, setMode] = useState<SearchMode>('blur');

  // Trigger search whenever any filter changes
  useEffect(() => {
    onSearch({ query, date, tag, mode });
  }, [query, date, tag, mode]);

  const handleReset = () => {
    setQuery('');
    setDate('');
    setTag('');
    setMode('blur');
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        {/* Name Search */}
        <div className="flex flex-1 gap-2 w-full">
            <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.dashboard.search.placeholder}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            />
            </div>
            <Button size="sm" onClick={() => onSearch({ query, date, tag, mode })}>{t.common.search}</Button>
        </div>

        {/* Filters Group */}
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
           {/* Mode Selector */}
           <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-2 shrink-0 h-9">
              <span className="text-xs text-gray-500 mr-2 font-medium uppercase">{t.dashboard.search.modeLabel}</span>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as SearchMode)}
                className="bg-transparent text-sm py-1 focus:outline-none text-gray-700 cursor-pointer"
              >
                <option value="blur">{t.dashboard.search.modeBlur}</option>
                <option value="accurate">{t.dashboard.search.modeAccurate}</option>
              </select>
           </div>

           {/* Date Picker */}
           <div className="relative shrink-0 h-9">
             <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
               <Calendar className="h-4 w-4 text-gray-400" />
             </div>
             <input
               type="date"
               value={date}
               onChange={(e) => setDate(e.target.value)}
               className="h-full pl-9 pr-3 py-1 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-600"
             />
           </div>

           {/* Tag Selector */}
           <div className="relative shrink-0 min-w-[120px] h-9">
             <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
               <Tag className="h-4 w-4 text-gray-400" />
             </div>
             <select
               value={tag}
               onChange={(e) => setTag(e.target.value)}
               className="w-full h-full pl-9 pr-8 py-1 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none cursor-pointer text-gray-600"
             >
               <option value="">{t.dashboard.search.tagLabel}</option>
               {availableTags.map(t => (
                 <option key={t} value={t}>{t}</option>
               ))}
             </select>
             <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
               <span className="text-[10px] text-gray-400">▼</span>
             </div>
           </div>

           {/* Reset */}
           {(query || date || tag || mode !== 'blur') && (
             <button
               onClick={handleReset}
               className="h-9 w-9 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
               title={t.dashboard.search.reset}
             >
               <RefreshCw className="h-4 w-4" />
             </button>
           )}
        </div>
      </div>
    </div>
  );
};