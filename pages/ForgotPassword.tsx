
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ROUTES, APP_NAME } from '../constants';
import { useLanguage } from '../lib/i18n';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left side - Visual */}
      <div className="hidden lg:flex w-1/2 bg-primary-600 flex-col justify-between p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-indigo-800 animate-fade-in" />
        
        {/* Decorative Blobs */}
        <div className="absolute top-0 left-0 -ml-20 -mt-20 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-0 right-0 -mr-20 -mb-20 w-80 h-80 bg-indigo-400 opacity-20 rounded-full blur-3xl animate-blob" style={{ animationDelay: '2s' }}></div>
        
        <div className="relative z-10 animate-fade-in-up">
          <Link to={ROUTES.HOME} className="flex items-center gap-3 text-white/90 hover:opacity-80 transition-opacity">
            <BookOpen className="h-8 w-8" />
            <span className="text-2xl font-bold tracking-tight">{APP_NAME}</span>
          </Link>
        </div>
        
        <div className="relative z-10 max-w-md animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-4xl font-bold mb-6">{t.common.forgotPassword}</h2>
          <p className="text-primary-100 text-lg leading-relaxed">
            {t.common.forgotPasswordDesc}
          </p>
        </div>
        <div className="relative z-10 text-sm text-primary-200 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-24 bg-white relative">
        <div className="w-full max-w-sm mx-auto">
            <Link to={ROUTES.LOGIN} className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-8 transition-transform hover:-translate-x-1 duration-200">
                <ArrowLeft className="h-4 w-4 mr-1" />
                {t.common.backToLogin}
            </Link>
          
          <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isSent ? t.common.resetLinkSent : t.common.forgotPassword}
            </h1>
            <p className="text-gray-600">
              {isSent ? t.common.resetLinkSentDesc : t.common.forgotPasswordDesc}
            </p>
          </div>

          {!isSent ? (
            <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="group">
                <Input
                  label={t.common.email}
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="transition-all duration-200 group-hover:border-primary-300"
                  icon={<Mail className="h-4 w-4 text-gray-400" />}
                />
              </div>

              <Button type="submit" fullWidth disabled={isLoading || !email} className="transform transition-all active:scale-95 shadow-md hover:shadow-lg">
                {isLoading ? t.common.processing : t.common.sendResetLink}
              </Button>
            </form>
          ) : (
            <div className="animate-fade-in-up space-y-6" style={{ animationDelay: '0.2s' }}>
              <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-start gap-3 border border-green-100">
                <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">{t.common.resetLinkSent}</p>
                  <p className="text-sm mt-1 opacity-90">{t.common.resetLinkSentDesc}</p>
                </div>
              </div>
              <Button fullWidth variant="secondary" onClick={() => setIsSent(false)}>
                 Resend Link
              </Button>
              <Button fullWidth to={ROUTES.LOGIN} variant="primary">
                 {t.common.backToLogin}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
