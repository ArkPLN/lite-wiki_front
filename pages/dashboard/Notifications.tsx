
import React, { useState } from 'react';
import { 
  Bell, 
  Info, 
  AlertTriangle, 
  AlertCircle, 
  Zap, 
  Check, 
  Trash2, 
  MailOpen,
  BellRing
} from 'lucide-react';
import { useLanguage } from '../../lib/i18n';
import { NotificationItem, NotificationType } from '../../types';
import { Button } from '../../components/ui/Button';

// Mock Data
const MOCK_NOTIFICATIONS: NotificationItem[] = [
  { 
    id: '1', 
    type: 'info', 
    title: 'New Team Member', 
    message: 'Jessica Wu has joined the Engineering team. Say hello!', 
    timestamp: '10 mins ago', 
    isRead: false 
  },
  { 
    id: '2', 
    type: 'warning', 
    title: 'Storage Capacity', 
    message: 'Your team storage is 85% full. Please consider archiving old documents.', 
    timestamp: '2 hours ago', 
    isRead: false 
  },
  { 
    id: '3', 
    type: 'error', 
    title: 'Sync Failed', 
    message: 'Failed to sync "Project Roadmap.md" due to a network timeout.', 
    timestamp: 'Yesterday', 
    isRead: true 
  },
  { 
    id: '4', 
    type: 'system', 
    title: 'System Maintenance', 
    message: 'Scheduled maintenance will occur on Sunday at 2:00 AM UTC.', 
    timestamp: '2 days ago', 
    isRead: true 
  },
];

export const Notifications: React.FC = () => {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: NotificationType) => {
    switch(type) {
      case 'info': return <Info className="h-5 w-5 text-blue-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'error': return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'system': return <Zap className="h-5 w-5 text-purple-500" />;
      default: return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStyles = (type: NotificationType, isRead: boolean) => {
    const base = isRead ? "bg-white opacity-60" : "bg-white border-l-4";
    switch(type) {
      case 'info': return `${base} ${!isRead ? 'border-blue-500 shadow-sm' : ''}`;
      case 'warning': return `${base} ${!isRead ? 'border-amber-500 shadow-sm' : ''}`;
      case 'error': return `${base} ${!isRead ? 'border-red-500 shadow-sm' : ''}`;
      case 'system': return `${base} ${!isRead ? 'border-purple-500 shadow-sm' : ''}`;
      default: return base;
    }
  };

  const getBadge = (type: NotificationType) => {
    switch(type) {
      case 'info': return <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-700">{t.notifications.typeInfo}</span>;
      case 'warning': return <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-700">{t.notifications.typeWarning}</span>;
      case 'error': return <span className="text-xs font-semibold px-2 py-0.5 rounded bg-red-100 text-red-700">{t.notifications.typeError}</span>;
      case 'system': return <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-100 text-purple-700">{t.notifications.typeSystem}</span>;
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto h-full overflow-y-auto animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BellRing className="h-6 w-6 text-primary-600" />
            {t.notifications.title}
           </h1>
           <p className="text-gray-500 mt-1">
             {notifications.filter(n => !n.isRead).length} unread messages
           </p>
        </div>
        {notifications.length > 0 && (
          <Button variant="secondary" size="sm" onClick={handleMarkAllRead} className="flex items-center gap-2">
            <MailOpen className="h-4 w-4" />
            {t.notifications.markAllRead}
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map(item => (
            <div 
              key={item.id} 
              className={`p-5 rounded-lg border border-gray-100 transition-all ${getStyles(item.type, item.isRead)}`}
            >
              <div className="flex gap-4">
                <div className={`p-2 rounded-full h-fit flex-shrink-0 ${
                  item.type === 'info' ? 'bg-blue-50' : 
                  item.type === 'warning' ? 'bg-amber-50' : 
                  item.type === 'error' ? 'bg-red-50' : 
                  'bg-purple-50'
                }`}>
                  {getIcon(item.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-bold text-slate-900 ${item.isRead ? 'text-gray-600' : ''}`}>
                        {item.title}
                      </h3>
                      {getBadge(item.type)}
                    </div>
                    <span className="text-xs text-gray-400">{item.timestamp}</span>
                  </div>
                  <p className={`text-sm mb-3 ${item.isRead ? 'text-gray-400' : 'text-gray-600'}`}>
                    {item.message}
                  </p>
                  
                  <div className="flex gap-3">
                    {!item.isRead && (
                      <button 
                        onClick={() => handleMarkAsRead(item.id)}
                        className="text-xs font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors"
                      >
                        <Check className="h-3 w-3" /> {t.notifications.markRead}
                      </button>
                    )}
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="text-xs font-medium text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="h-3 w-3" /> {t.notifications.delete}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-200 border-dashed">
             <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
               <Bell className="h-8 w-8 text-gray-400" />
             </div>
             <h3 className="text-lg font-bold text-gray-900 mb-2">{t.notifications.noNotifications}</h3>
             <p className="text-gray-500">{t.notifications.noNotificationsDesc}</p>
          </div>
        )}
      </div>
    </div>
  );
};