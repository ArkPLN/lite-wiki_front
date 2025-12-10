
import React, { useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { MessageSquare, Book, Users, Settings } from 'lucide-react';
import { ROUTES } from '../../constants';
import { useLanguage } from '../../lib/i18n';

export const Team: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Default redirect to Forum if at root /team
  useEffect(() => {
    if (location.pathname === ROUTES.DASHBOARD.TEAM) {
      navigate(ROUTES.DASHBOARD.TEAM_FORUM, { replace: true });
    }
  }, [location.pathname, navigate]);

  const tabs = [
    { name: t.team.forum, path: ROUTES.DASHBOARD.TEAM_FORUM, icon: <MessageSquare className="h-4 w-4" /> },
    { name: t.team.wiki, path: ROUTES.DASHBOARD.TEAM_WIKI, icon: <Book className="h-4 w-4" /> },
    { name: t.team.directory, path: ROUTES.DASHBOARD.TEAM_DIRECTORY, icon: <Users className="h-4 w-4" /> },
    { name: t.team.management, path: ROUTES.DASHBOARD.TEAM_MANAGEMENT, icon: <Settings className="h-4 w-4" /> },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Team Header & Navigation */}
      <div className="bg-white border-b border-gray-200 px-8 pt-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">{t.team.header}</h1>
          <p className="text-gray-500 text-sm">{t.team.subHeader}</p>
        </div>
        
        <div className="flex space-x-8">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition-colors ${
                  isActive
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                {tab.name}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Sub-page Content */}
      <div className="flex-1 overflow-hidden bg-gray-50">
        <Outlet />
      </div>
    </div>
  );
};
