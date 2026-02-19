import React from 'react';
import { Heart, Settings, Sliders, ExternalLink } from 'lucide-react';
import { PageType } from './StaticPage';

interface FooterProps {
  onOpenPreferences?: () => void;
  onOpenSettings?: () => void;
  onNavigate: (page: PageType) => void;
}

const Footer: React.FC<FooterProps> = ({ onOpenPreferences, onOpenSettings, onNavigate }) => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between gap-12">
          
          <div className="text-center md:text-left flex-1">
            <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Eldrex Writings</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed mx-auto md:mx-0">
              Documenting the journey of learning, creating, and experiencing life in the digital age.
            </p>
            <div className="mt-6 text-xs text-slate-400 flex flex-col md:flex-row items-center gap-4 justify-center md:justify-start">
               <span>© {new Date().getFullYear()} All rights reserved.</span>
               {onOpenPreferences && (
                 <button 
                   onClick={onOpenPreferences}
                   className="flex items-center gap-1 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                 >
                   <Settings size={12} />
                   <span>Analytics Consent</span>
                 </button>
               )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 text-center md:text-left">
              <div className="flex flex-col gap-3">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">Site</h4>
                  <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-slate-500 hover:text-ember-600 text-sm transition-colors text-left mx-auto md:mx-0">Home</button>
                  <button onClick={() => onNavigate('about')} className="text-slate-500 hover:text-ember-600 text-sm transition-colors text-left mx-auto md:mx-0">About</button>
                  <a href="https://ko-fi.com/landecsorg" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-ember-600 text-sm transition-colors text-left mx-auto md:mx-0 flex items-center gap-1">
                      Support <ExternalLink size={10} />
                  </a>
              </div>
              <div className="flex flex-col gap-3">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">Legal</h4>
                  <button onClick={() => onNavigate('privacy')} className="text-slate-500 hover:text-ember-600 text-sm transition-colors text-left mx-auto md:mx-0">Privacy Policy</button>
                  <button onClick={() => onNavigate('terms')} className="text-slate-500 hover:text-ember-600 text-sm transition-colors text-left mx-auto md:mx-0">Terms of Use</button>
                  <button onClick={() => onNavigate('copyright')} className="text-slate-500 hover:text-ember-600 text-sm transition-colors text-left mx-auto md:mx-0">Copyright Notice</button>
              </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-4 flex-1">
            <div className="flex items-center gap-6 flex-wrap justify-center">
                <a href="https://github.com/EldrexDelosReyesBula" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors transform hover:-translate-y-1">
                    <i className="fa-brands fa-github text-xl"></i>
                </a>
                <a href="https://bsky.app/profile/eldrex.bsky.social" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-400 transition-colors transform hover:-translate-y-1">
                    <i className="fa-brands fa-bluesky text-xl"></i>
                </a>
                <a href="https://www.facebook.com/eldrex.landecs.org" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-600 transition-colors transform hover:-translate-y-1">
                    <i className="fa-brands fa-facebook text-xl"></i>
                </a>
                <a href="https://www.instagram.com/landecs_ld" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-pink-600 transition-colors transform hover:-translate-y-1">
                    <i className="fa-brands fa-instagram text-xl"></i>
                </a>
                <a href="https://www.threads.com/@landecs_ld" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors transform hover:-translate-y-1">
                    <i className="fa-brands fa-threads text-xl"></i>
                </a>
                <a href="https://ngl.link/eldrex.me" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-purple-600 transition-colors transform hover:-translate-y-1">
                    <i className="fa-solid fa-paper-plane text-xl"></i>
                </a>
            </div>
            <div className="flex gap-3">
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-100 dark:border-slate-700">
                <span>Made with</span>
                <Heart size={10} className="text-red-500 fill-current" />
                <span>and React</span>
              </div>
              
              {onOpenSettings && (
                 <button 
                   onClick={onOpenSettings}
                   className="flex items-center gap-1.5 text-xs font-medium text-ember-600 dark:text-ember-400 bg-ember-50 dark:bg-ember-900/20 px-3 py-1.5 rounded-full border border-ember-100 dark:border-ember-800 hover:bg-ember-100 dark:hover:bg-ember-900/40 transition-colors"
                 >
                   <Sliders size={12} />
                   <span>Appearance</span>
                 </button>
               )}
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;