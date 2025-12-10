
import React from 'react';
import { APP_NAME } from '../../constants';
import { Github, Twitter, Linkedin } from 'lucide-react';
import { useLanguage } from '../../lib/i18n';

/* =========================================
   Component: Footer
   Description: Displays the site footer with links to product pages, company info, and social media.
   Structure:
   - 4-column grid for links
   - Bottom bar for copyright and social icons
   ========================================= */
export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-white text-lg font-bold mb-4">{APP_NAME}</h3>
            <p className="text-slate-400 max-w-sm">
              {t.footer.description}
            </p>
          </div>
          
          {/* Product Links */}
          <div>
            <h4 className="text-white font-medium mb-4">{t.footer.product}</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">{t.footer.features}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t.footer.integrations}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t.footer.pricing}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t.footer.roadmap}</a></li>
            </ul>
          </div>
          
          {/* Company Links */}
          <div>
            <h4 className="text-white font-medium mb-4">{t.footer.company}</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">{t.footer.aboutUs}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t.footer.careers}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t.footer.contact}</a></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar: Copyright & Socials */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} {APP_NAME}. {t.footer.copyright}
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-slate-400 hover:text-white transition-colors transform hover:scale-110"><Github className="h-5 w-5" /></a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors transform hover:scale-110"><Twitter className="h-5 w-5" /></a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors transform hover:scale-110"><Linkedin className="h-5 w-5" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};
