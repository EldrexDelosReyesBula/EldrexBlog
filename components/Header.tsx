import React, { useState, useEffect } from 'react';
import { PenTool, Search, Sliders, X } from 'lucide-react';
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
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          scrolled || mobileSearchOpen
            ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-slate-200 dark:border-slate-800 shadow-sm py-2' 
            : 'bg-transparent border-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 relative z-10">
            
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

              {/* Settings Button */}
              <button 
                onClick={onOpenSettings}
                className="p-2.5 text-slate-500 dark:text-slate-400 hover:text-ember-600 dark:hover:text-ember-400 hover:bg-ember-50 dark:hover:bg-slate-800 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ember-500"
                aria-label="Settings"
              >
                <Sliders size={20} />
              </button>
              
              {/* Mobile Search Toggle */}
              <button 
                className="sm:hidden p-2 text-slate-500 dark:text-slate-400 hover:text-ember-600 transition-colors focus:outline-none focus:ring-2 focus:ring-ember-500 rounded-full"
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                aria-label={mobileSearchOpen ? "Close search" : "Open search"}
              >
                {mobileSearchOpen ? <X size={24} /> : <Search size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar with Overlay */}
          <AnimatePresence>
            {mobileSearchOpen && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="sm:hidden overflow-hidden relative z-10"
              >
                <div className="pb-4 pt-1">
                  <input
                    type="text"
                    autoFocus
                    placeholder="Search stories..."
                    value={searchTerm}
                    onChange={(e) => onSearch(e.target.value)}
                    className="block w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-ember-500 shadow-inner"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Mobile Search Backdrop */}
      <AnimatePresence>
        {mobileSearchOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileSearchOpen(false)}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 sm:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
