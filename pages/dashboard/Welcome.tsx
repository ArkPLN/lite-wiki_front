
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Users, Layout, ArrowRight, User } from 'lucide-react';
import { useLanguage } from '../../lib/i18n';
import { ROUTES } from '../../constants';
import { Button } from '../../components/ui/Button';

export const Welcome: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="min-h-full p-8 flex flex-col items-center justify-center bg-gray-50 animate-fade-in">
      <div className="max-w-4xl w-full text-center space-y-8">
        
        {/* Hero Section */}
        <div className="space-y-4">
           <div className="mx-auto h-20 w-20 bg-white rounded-2xl shadow-sm border border-gray-200 flex items-center justify-center mb-6">
              <User className="h-10 w-10 text-primary-600" />
           </div>
           <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
             {t.welcome.title}
           </h1>
           <p className="text-xl text-gray-600 max-w-2xl mx-auto">
             {t.welcome.subtitle}
           </p>
           <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-200 rounded-full text-xs font-semibold text-gray-700 uppercase tracking-wide">
              {t.welcome.role}
           </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mt-12">
           {/* Card 1 */}
           <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-primary-200 transition-all group cursor-default">
              <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                 <Layout className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{t.welcome.card1Title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">
                {t.welcome.card1Desc}
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="pl-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                onClick={() => navigate(ROUTES.DASHBOARD.DOCUMENTS)}
              >
                Go to Workbench <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
           </div>

           {/* Card 2 */}
           <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-purple-200 transition-all group cursor-default">
              <div className="h-12 w-12 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                 <Bot className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{t.welcome.card2Title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">
                {t.welcome.card2Desc}
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="pl-0 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                onClick={() => navigate(ROUTES.DASHBOARD.KNOWLEDGE)}
              >
                Ask AI <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
           </div>

           {/* Card 3 */}
           <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-green-200 transition-all group cursor-default">
              <div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center text-green-600 mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
                 <Users className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{t.welcome.card3Title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">
                {t.welcome.card3Desc}
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="pl-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                onClick={() => navigate(ROUTES.DASHBOARD.TEAM)}
              >
                View Team <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
           </div>
        </div>

        <div className="pt-8">
           <Button size="lg" onClick={() => navigate(ROUTES.DASHBOARD.OVERVIEW)} className="shadow-lg shadow-primary-500/30">
              {t.welcome.getStarted}
           </Button>
        </div>

      </div>
    </div>
  );
};
