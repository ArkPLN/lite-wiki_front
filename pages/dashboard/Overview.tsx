
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Clock, FileText, Users, HardDrive } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { useLanguage } from '@/lib/i18n';
import axios from 'axios';
import { accountData } from '@/types/auth/user';
import useUserStore from '@/store';
const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; color: string }> = ({
  title,
  value,
  icon,
  color
}) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
    </div>
    <div className={`p-3 rounded-lg ${color} text-white`}>
      {icon}
    </div>
  </div>
);

const RecentFileRow: React.FC<{ name: string; updated: string; author: string }> = ({ name, updated, author }) => (
  <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-50 last:border-0 cursor-pointer group">
    <div className="flex items-center gap-4">
      <div className="h-10 w-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
        <FileText className="h-5 w-5" />
      </div>
      <div>
        <h4 className="font-medium text-gray-900">{name}</h4>
        <p className="text-xs text-gray-500">Updated {updated}</p>
      </div>
    </div>
    <div className="text-sm text-gray-600">{author}</div>
  </div>
);



export const Overview: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const { data: accountData, isLoading, isError, error } = useQuery<accountData>({
    queryKey: ['userState'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get('api/v1/auth/me', {
        headers: {
          Authorization: token
          }
        });
      return response.data;
    },
    // 只在初始加载时获取一次数据
    staleTime: Infinity,
  });

  // 处理成功状态
  React.useEffect(() => {
    if (accountData) {
      localStorage.setItem('accountData', JSON.stringify(accountData));
      useUserStore.setState({ accountData });
      console.log('Login Success!');
    }
  }, [accountData]);

  // 处理错误状态
  React.useEffect(() => {
    if (isError) {
      console.error('Error fetching user state:', error);
      navigate(ROUTES.LOGIN);
    }
  }, [isError, error, navigate]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {isError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Error loading user data: {error?.message || 'Unknown error'}
              </p>
            </div>
          </div>
        </div>
      )}

      {!isLoading && !isError && (
        <>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-900">{t.dashboard.overview}</h1>
            <div className="text-sm text-gray-500">Last synced: Just now</div>
          </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t.dashboard.totalDocs}
          value="124"
          icon={<FileText className="h-5 w-5" />}
          color="bg-blue-500"
        />
        <StatCard
          title={t.dashboard.teamMembers}
          value="12"
          icon={<Users className="h-5 w-5" />}
          color="bg-green-500"
        />
        <StatCard
          title={t.dashboard.hoursOnline}
          value="48.5"
          icon={<Clock className="h-5 w-5" />}
          color="bg-purple-500"
        />
        <StatCard
          title={t.dashboard.storageUsed}
          value="1.2 GB"
          icon={<HardDrive className="h-5 w-5" />}
          color="bg-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area: Recent Files */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900">{t.dashboard.recentActivity}</h2>
            <Link to={ROUTES.DASHBOARD.DOCUMENTS} className="text-sm text-primary-600 hover:text-primary-700 font-medium">{t.dashboard.viewAll}</Link>
          </div>
          <div className="p-4">
            <RecentFileRow name="Project Lite-Wiki Requirements.md" updated="2 hours ago" author="Alex Developer" />
            <RecentFileRow name="Weekly Sync Notes - Q1.md" updated="5 hours ago" author="Sarah Chen" />
            <RecentFileRow name="API Documentation v2.md" updated="Yesterday" author="Mike Design" />
            <RecentFileRow name="Marketing Strategy 2024.md" updated="2 days ago" author="Alex Developer" />
          </div>
        </div>

        {/* Sidebar: Quick Actions & Storage */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-primary-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg">
            <h3 className="text-lg font-bold mb-2">{t.dashboard.aiAssistant}</h3>
            <p className="text-primary-100 text-sm mb-4">
              {t.dashboard.aiDescription}
            </p>
            <Link to={ROUTES.DASHBOARD.DOCUMENTS} className="block w-full text-center py-2 bg-white text-primary-600 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm">
              {t.dashboard.openEditor}
            </Link>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">{t.dashboard.storageStatus}</h3>
            <div className="w-full bg-gray-100 rounded-full h-3 mb-2">
              <div className="bg-green-500 h-3 rounded-full w-[45%]"></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>1.2 GB Used</span>
              <span>5 GB Total</span>
            </div>
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
};
