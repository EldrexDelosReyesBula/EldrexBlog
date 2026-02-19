import React, { useState, useEffect } from 'react';
import { PenTool, Search, Sliders } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  onSearch: (query: string) => void;
  searchTerm: string;
  onOpenSettings?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch, searchTerm, onOpenSettings }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 border-b ${
        scrolled 
          ? 'bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-slate-200 dark:border-slate-800 shadow-sm py-2' 
          : 'bg-transparent border-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div 
            className="flex items-center gap-3 group cursor-pointer" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth'})}
          >
            <div className="bg-gradient-to-br from-ember-500 to-ember-700 p-2.5 rounded-xl text-white shadow-lg shadow-ember-500/30 group-hover:shadow-ember-500/50 group-hover:scale-105 transition-all duration-300">
              <PenTool size={20} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-none font-serif">Eldrex</h1>
              <span className="text-[10px] text-ember-600 dark:text-ember-400 font-bold uppercase tracking-[0.2em]">Writings</span>
            </div>
          </div>

          <div className="flex items-center gap-3 ml-auto">
             {/* Desktop Search */}
            <div className="relative hidden sm:block w-full max-w-xs lg:max-w-sm">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={18} className="text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => onSearch(e.target.value)}
                className="block w-full pl-11 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-full leading-5 bg-slate-50/50 dark:bg-slate-800/50 placeholder-slate-400 text-slate-900 dark:text-slate-100 focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-ember-100 dark:focus:ring-ember-900 focus:border-ember-500 sm:text-sm transition-all duration-300 hover:bg-white dark:hover:bg-slate-800"
              />
            </div>

            {/* Settings Button (Desktop/Mobile) */}
             <button 
              onClick={onOpenSettings}
              className="p-2.5 text-slate-500 dark:text-slate-400 hover:text-ember-600 dark:hover:text-ember-400 hover:bg-ember-50 dark:hover:bg-slate-800 rounded-full transition-colors"
              aria-label="Settings"
            >
               <Sliders size={20} />
            </button>
            
            {/* Mobile Search Icon */}
            <button 
              className="sm:hidden p-2 text-slate-500 dark:text-slate-400 hover:text-ember-600 transition-colors"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            >
               <Search size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <AnimatePresence>
          {mobileSearchOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="sm:hidden overflow-hidden pb-4"
            >
              <input
                type="text"
                autoFocus
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => onSearch(e.target.value)}
                className="block w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-ember-500"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;