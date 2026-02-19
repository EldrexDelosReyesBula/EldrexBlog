import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Moon, Sun, Monitor, Type, LayoutTemplate, FileText, Shield, Check, Ban } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  analyticsConsent: boolean | null;
  onAnalyticsChange: (allowed: boolean) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose,
  analyticsConsent,
  onAnalyticsChange
}) => {
  const { 
    theme, setTheme, 
    texture, setTexture, 
    fontSize, setFontSize,
    fontFamily, setFontFamily 
  } = useTheme();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm dark:bg-black/60"
        />

        {/* Modal / Bottom Sheet */}
        <motion.div
          initial={isMobile ? { y: "100%" } : { opacity: 0, scale: 0.95, y: 10 }}
          animate={isMobile ? { y: 0 } : { opacity: 1, scale: 1, y: 0 }}
          exit={isMobile ? { y: "100%" } : { opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border-t sm:border border-slate-200 dark:border-slate-800 max-h-[90vh] sm:max-h-[85vh] flex flex-col"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white/50 dark:bg-slate-900/50 backdrop-blur-md shrink-0">
            <h2 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <LayoutTemplate size={20} className="text-ember-600" />
              Settings
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6 space-y-8 overflow-y-auto">
            
            {/* Theme Section */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Appearance</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'light', icon: Sun, label: 'Light' },
                  { id: 'dark', icon: Moon, label: 'Dark' },
                  { id: 'system', icon: Monitor, label: 'Auto' },
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setTheme(option.id as any)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-200 ${
                      theme === option.id 
                        ? 'bg-ember-50 border-ember-200 text-ember-700 dark:bg-ember-900/20 dark:border-ember-800 dark:text-ember-400' 
                        : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800/80'
                    }`}
                  >
                    <option.icon size={20} />
                    <span className="text-sm font-medium">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Texture Section */}
            <div className="space-y-3">
               <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Atmosphere</label>
               <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setTexture('clean')}
                    className={`group flex items-center justify-center gap-3 p-4 rounded-xl border transition-all ${
                      texture === 'clean'
                      ? 'bg-white border-ember-200 shadow-sm ring-1 ring-ember-100 dark:bg-slate-800 dark:border-ember-700'
                      : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-white dark:bg-slate-800/50 dark:border-slate-800'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-white border border-slate-200 shadow-sm dark:bg-slate-700 dark:border-slate-600"></div>
                    <span className={`text-sm font-medium ${texture === 'clean' ? 'text-ember-700 dark:text-ember-400' : ''}`}>Clean</span>
                  </button>

                  <button
                    onClick={() => setTexture('paper')}
                    className={`group flex items-center justify-center gap-3 p-4 rounded-xl border transition-all overflow-hidden relative ${
                      texture === 'paper'
                      ? 'border-ember-200 shadow-sm ring-1 ring-ember-100 dark:border-ember-700'
                      : 'border-slate-100 text-slate-500 hover:opacity-100 dark:border-slate-800'
                    }`}
                  >
                     <div className="absolute inset-0 bg-[#fffbf0] opacity-50 dark:bg-[#1e1b16]"></div>
                     <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }}></div>
                     <FileText size={20} className={`relative z-10 ${texture === 'paper' ? 'text-ember-600 dark:text-ember-400' : 'text-slate-400'}`} />
                     <span className={`relative z-10 text-sm font-medium ${texture === 'paper' ? 'text-ember-700 dark:text-ember-400' : ''}`}>Paper Feel</span>
                  </button>
               </div>
            </div>

            {/* Typography Section */}
            <div className="space-y-6">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Typography</label>
              
              {/* Font Family */}
              <div className="space-y-3">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Font Style</span>
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    onClick={() => setFontFamily('sans')}
                    className={`px-3 py-2 rounded-lg text-sm border font-sans transition-all ${
                      fontFamily === 'sans' 
                      ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900' 
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                    }`}
                  >Sans</button>
                  <button 
                    onClick={() => setFontFamily('serif')}
                    className={`px-3 py-2 rounded-lg text-sm border font-serif transition-all ${
                      fontFamily === 'serif' 
                      ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900' 
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                    }`}
                  >Serif</button>
                  <button 
                    onClick={() => setFontFamily('mono')}
                    className={`px-3 py-2 rounded-lg text-sm border font-mono transition-all ${
                      fontFamily === 'mono' 
                      ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900' 
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                    }`}
                  >Mono</button>
                </div>
              </div>

              {/* Font Size */}
              <div className="space-y-3">
                 <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Size</span>
                    <span className="text-xs font-mono text-ember-600 dark:text-ember-400 bg-ember-50 dark:bg-ember-900/30 px-2 py-0.5 rounded">
                      {fontSize.charAt(0).toUpperCase() + fontSize.slice(1)}
                    </span>
                 </div>
                 <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800 p-2 rounded-xl border border-slate-100 dark:border-slate-700">
                    <button 
                      onClick={() => setFontSize('small')}
                      className={`p-2 rounded-lg transition-colors ${fontSize === 'small' ? 'bg-white shadow-sm text-slate-900 dark:bg-slate-700 dark:text-white' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                    >
                      <Type size={14} />
                    </button>
                    <div className="flex-1 h-1 bg-slate-200 dark:bg-slate-700 rounded-full relative">
                       <div className={`absolute top-0 bottom-0 bg-slate-900 dark:bg-slate-400 rounded-full transition-all duration-300 ${
                         fontSize === 'small' ? 'left-0 w-1/4' : fontSize === 'medium' ? 'left-1/4 w-1/2' : 'left-3/4 w-1/4'
                       }`} />
                    </div>
                    <button 
                      onClick={() => setFontSize('large')}
                      className={`p-2 rounded-lg transition-colors ${fontSize === 'large' ? 'bg-white shadow-sm text-slate-900 dark:bg-slate-700 dark:text-white' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                    >
                      <Type size={20} />
                    </button>
                 </div>
              </div>

            </div>

             {/* Privacy & Analytics Section */}
             <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <Shield size={14} /> Privacy & Data
                </label>
                
                <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                    <div className="flex-1 pr-4">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Analytics</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                            Allow anonymous data collection to help improve the reading experience.
                        </p>
                    </div>
                    
                    <button 
                        onClick={() => onAnalyticsChange(!analyticsConsent)}
                        className={`relative w-12 h-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ember-500 ${
                            analyticsConsent 
                            ? 'bg-ember-600' 
                            : 'bg-slate-200 dark:bg-slate-600'
                        }`}
                        aria-label="Toggle analytics"
                    >
                        <motion.div 
                            initial={false}
                            animate={{ x: analyticsConsent ? 22 : 2 }}
                            className="w-5 h-5 bg-white rounded-full shadow-sm flex items-center justify-center"
                        >
                            {analyticsConsent ? (
                                <Check size={10} className="text-ember-600" />
                            ) : (
                                <Ban size={10} className="text-slate-400" />
                            )}
                        </motion.div>
                    </button>
                </div>
            </div>

            {/* Extra padding for bottom safe area on mobile */}
            <div className="h-6 sm:hidden" />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SettingsModal;