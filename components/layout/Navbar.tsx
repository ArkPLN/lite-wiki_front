
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, BookOpen } from 'lucide-react';
import { Button } from '../ui/Button';
import { APP_NAME, ROUTES } from '../../constants';
import { useLanguage } from '../../lib/i18n';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();
  const isAuthPage = location.pathname === ROUTES.LOGIN || location.pathname === ROUTES.REGISTER;

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center gap-2">
            <div className="bg-primary-600 p-1.5 rounded-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">{APP_NAME}</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('features')} className="text-gray-600 hover:text-primary-600 font-medium transition-colors">{t.common.features}</button>
            <button onClick={() => scrollToSection('about')} className="text-gray-600 hover:text-primary-600 font-medium transition-colors">{t.common.about}</button>
            
            {!isAuthPage && (
              <div className="flex items-center gap-4">
                <Button variant="ghost" to={ROUTES.LOGIN}>{t.common.login}</Button>
                <Button variant="primary" to={ROUTES.REGISTER}>{t.common.getStarted}</Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900 p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100">
          <div className="px-4 pt-2 pb-6 space-y-4">
            <button onClick={() => scrollToSection('features')} className="block w-full text-left text-gray-600 font-medium py-2">{t.common.features}</button>
            <button onClick={() => scrollToSection('about')} className="block w-full text-left text-gray-600 font-medium py-2">{t.common.about}</button>
            <div className="pt-4 flex flex-col gap-3">
              <Button variant="secondary" fullWidth to={ROUTES.LOGIN} onClick={() => setIsOpen(false)}>{t.common.login}</Button>
              <Button variant="primary" fullWidth to={ROUTES.REGISTER} onClick={() => setIsOpen(false)}>{t.common.getStarted}</Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
