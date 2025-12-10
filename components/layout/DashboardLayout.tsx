
import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Star, 
  Clock, 
  Trash2, 
  BookOpen, 
  LogOut,
  Bell,
  Search,
  BrainCircuit,
  Globe // New Icon for Community
} from 'lucide-react';
import { ROUTES, MOCK_USER, APP_NAME } from '../../constants';
import { useLanguage } from '../../lib/i18n';
import { accountData } from '../../types/auth/user';
import useUserStore from '../../store';
const SidebarItem: React.FC<{ to: string; icon: React.ReactNode; label: string; isActive: boolean }> = ({ 
  to, 
  icon, 
  label, 
  isActive 
}) => (
  <Link 
    to={to} 
    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
      isActive 
        ? 'bg-primary-50 text-primary-700' 
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }`}
  >
    <span className={isActive ? 'text-primary-600' : 'text-gray-400'}>{icon}</span>
    {label}
  </Link>
);



export const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [accountData, setAccountData] = React.useState<accountData>({
    id: '',
    name: '',
    email: '',
    phoneNumber: '',
    avatar: null,
    bio: null
  });
  const handleLogout = () => {
    navigate(ROUTES.HOME);
  };
  const accountDataStored = useUserStore((state) => state.accountData);
  // 在刷新页面后,如果有accountDataStored,则更新accountData
  React.useEffect(() => {
    if (accountDataStored) {
      setAccountData(accountDataStored);
    }
  }, [accountDataStored]);
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed inset-y-0 left-0 z-30 flex flex-col">
        {/* Logo Area */}
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <Link to={ROUTES.HOME} className="flex items-center gap-2">
            <div className="bg-primary-600 p-1 rounded-md">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900 tracking-tight">{APP_NAME}</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <SidebarItem 
            to={ROUTES.DASHBOARD.OVERVIEW} 
            icon={<LayoutDashboard className="h-5 w-5" />} 
            label={t.dashboard.overview} 
            isActive={location.pathname === ROUTES.DASHBOARD.OVERVIEW || location.pathname === ROUTES.DASHBOARD.ROOT}
          />
          <SidebarItem 
            to={ROUTES.DASHBOARD.DOCUMENTS} 
            icon={<FileText className="h-5 w-5" />} 
            label={t.dashboard.documents} 
            isActive={location.pathname.startsWith(ROUTES.DASHBOARD.DOCUMENTS)}
          />
          {/* New Community Link */}
          <SidebarItem 
            to={ROUTES.DASHBOARD.COMMUNITY} 
            icon={<Globe className="h-5 w-5" />} 
            label={t.dashboard.community} 
            isActive={location.pathname === ROUTES.DASHBOARD.COMMUNITY}
          />
          <SidebarItem 
            to={ROUTES.DASHBOARD.KNOWLEDGE} 
            icon={<BrainCircuit className="h-5 w-5" />} 
            label={t.dashboard.knowledgeCenter} 
            isActive={location.pathname === ROUTES.DASHBOARD.KNOWLEDGE}
          />
          <SidebarItem 
            to={ROUTES.DASHBOARD.TEAM} 
            icon={<Users className="h-5 w-5" />} 
            label={t.dashboard.teamSpace} 
            isActive={location.pathname.startsWith(ROUTES.DASHBOARD.TEAM)}
          />
          
          <div className="pt-6 pb-2 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {t.dashboard.library}
          </div>
          
          <SidebarItem 
            to={ROUTES.DASHBOARD.FAVORITES} 
            icon={<Star className="h-5 w-5" />} 
            label={t.dashboard.favorites} 
            isActive={location.pathname === ROUTES.DASHBOARD.FAVORITES}
          />
          <SidebarItem 
            to={ROUTES.DASHBOARD.RECENT} 
            icon={<Clock className="h-5 w-5" />} 
            label={t.dashboard.recent} 
            isActive={location.pathname === ROUTES.DASHBOARD.RECENT}
          />
          <SidebarItem 
            to={ROUTES.DASHBOARD.TRASH} 
            icon={<Trash2 className="h-5 w-5" />} 
            label={t.dashboard.trash} 
            isActive={location.pathname === ROUTES.DASHBOARD.TRASH}
          />
        </nav>

        {/* User Profile Snippet (Bottom Sidebar) */}
        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-3 px-4 py-2 w-full text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
          >
            <LogOut className="h-4 w-4" />
            {t.dashboard.signOut}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-20 px-8 flex items-center justify-between">
          <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-96">
            <Search className="h-4 w-4 text-gray-400 mr-2" />
            <input 
              type="text" 
              placeholder={t.common.searchPlaceholder} 
              className="bg-transparent border-none focus:outline-none text-sm w-full text-gray-700 placeholder-gray-400"
            />
          </div>

          <div className="flex items-center gap-6">
            <Link 
              to={ROUTES.DASHBOARD.NOTIFICATIONS}
              className={`relative hover:text-primary-600 transition-colors ${
                location.pathname === ROUTES.DASHBOARD.NOTIFICATIONS ? 'text-primary-600' : 'text-gray-500'
              }`}
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
            </Link>
            
            <Link to={ROUTES.DASHBOARD.PROFILE} className="flex items-center gap-3 pl-6 border-l border-gray-200 hover:opacity-80 transition-opacity">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-900">{accountData.name}</p>
                <p className="text-xs text-gray-500 capitalize">{MOCK_USER.role.replace('_', ' ')}</p>
              </div>
              <img 
                src={accountData.avatar || MOCK_USER.avatar} 
                alt="Profile" 
                className="h-9 w-9 rounded-full bg-primary-100 border border-primary-200"
              />
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};