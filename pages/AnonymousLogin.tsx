
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, ArrowLeft, VenetianMask, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ROUTES, APP_NAME } from '../constants';
import { useLanguage } from '../lib/i18n';

export const AnonymousLogin: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const handleAnonymousLogin = () => {
    setLoading(true);
    // Simulate setting up a guest session
    setTimeout(() => {
      setLoading(false);
      navigate(ROUTES.DASHBOARD.WELCOME);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to={ROUTES.HOME} className="flex justify-center items-center gap-2 mb-6 group">
          <div className="bg-primary-600 p-1.5 rounded-lg group-hover:bg-primary-700 transition-colors">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <span className="font-bold text-2xl text-slate-900 tracking-tight">{APP_NAME}</span>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {t.common.anonymousLogin}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
           {t.common.guestDesc}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200 sm:rounded-lg sm:px-10 border border-gray-100">
           <div className="flex flex-col items-center justify-center space-y-6">
              <div className="h-24 w-24 bg-gray-50 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300">
                 <VenetianMask className="h-12 w-12 text-gray-400" />
              </div>
              
              <div className="text-center space-y-2">
                 <p className="font-medium text-gray-900">No email required.</p>
                 <p className="text-xs text-gray-500 max-w-xs mx-auto">
                    You will be assigned a temporary session. Your data is stored locally and may be lost if you clear your browser cache.
                 </p>
              </div>

              <div className="w-full space-y-4">
                 <Button 
                   fullWidth 
                   size="lg" 
                   onClick={handleAnonymousLogin} 
                   disabled={loading}
                   className="flex items-center justify-center gap-2"
                 >
                   {loading ? t.common.processing : t.common.continueAsGuest}
                   {!loading && <ArrowRight className="h-4 w-4" />}
                 </Button>

                 <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or</span>
                    </div>
                </div>

                 <Button 
                   variant="secondary" 
                   fullWidth 
                   to={ROUTES.LOGIN}
                 >
                   {t.common.signIn}
                 </Button>
              </div>
           </div>
        </div>
        
        <div className="text-center mt-6">
            <Link to={ROUTES.HOME} className="text-sm font-medium text-primary-600 hover:text-primary-500 flex items-center justify-center gap-1">
               <ArrowLeft className="h-3 w-3" /> {t.common.backToHome}
            </Link>
        </div>
      </div>
    </div>
  );
};
