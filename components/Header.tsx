import React, { useState, useEffect } from 'react';
import { PenTool, Search, Sliders, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  isHome: boolean;
  onOpenSettings?: () => void;
}

const Header: React.FC<HeaderProps> = ({ isHome, onOpenSettings }) => {
  const [scrolled, setScrolled] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isTransparent = isHome && !scrolled;

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          !isTransparent
            ? 'bg-white/90 dark:bg-[#110a0e]/90 backdrop-blur-xl border-brand-100 dark:border-brand-900/30 shadow-sm py-2' 
            : 'bg-transparent border-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 relative z-10">
            
            {/* Logo */}
            <div 
              className="flex items-center group cursor-pointer" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth'})}
            >
              <div className="relative h-10 sm:h-12 w-auto group-hover:scale-105 transition-all duration-300 rounded-2xl overflow-hidden shadow-sm group-hover:shadow-md">
                {!logoLoaded && (
                  <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700 animate-pulse w-32" />
                )}
                <img 
                  src="https://eldrex.landecs.org/post/eldrex-logo.svg" 
                  alt="Eldrex Logo" 
                  className={`h-full w-auto object-contain transition-opacity duration-300 ${logoLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setLogoLoaded(true)}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 ml-auto">
              {/* Settings Button */}
              <button 
                onClick={onOpenSettings}
                className={`p-2.5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 ${!isTransparent ? 'text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-slate-800' : 'text-white/80 hover:text-white hover:bg-white/10'}`}
                aria-label="Settings"
              >
                <Sliders size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;