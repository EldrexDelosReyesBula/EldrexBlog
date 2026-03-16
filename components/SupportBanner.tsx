import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, X } from 'lucide-react';

interface SupportBannerProps {
  isVisible: boolean;
  onClose: () => void;
}

const SupportBanner: React.FC<SupportBannerProps> = ({ isVisible, onClose }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 100, opacity: 0, scale: 0.9 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20,
            opacity: { duration: 0.2 }
          }}
          className="fixed bottom-6 right-6 z-[55] w-[calc(100%-3rem)] max-w-md"
        >
          <motion.div 
            animate={{ 
              y: [0, -4, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-brand-100/50 dark:border-slate-700 p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5 relative overflow-hidden group"
          >
            {/* Background Expressive Elements */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-500/10 dark:bg-brand-500/20 rounded-full blur-3xl group-hover:bg-brand-500/20 transition-colors duration-700" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-pink-500/10 dark:bg-pink-500/20 rounded-full blur-3xl group-hover:bg-pink-500/20 transition-colors duration-700" />
            
            <div className="p-4 bg-gradient-to-br from-brand-100 to-brand-50 dark:from-brand-900/40 dark:to-brand-900/20 text-brand-600 dark:text-brand-400 rounded-2xl relative z-10 shrink-0 shadow-inner">
              <Coffee size={28} className="animate-bounce" style={{ animationDuration: '3s' }} />
            </div>

            <div className="flex-1 relative z-10 text-center sm:text-left">
              <h4 className="text-xl font-serif font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                Found a spark of inspiration? ✨
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5 font-light">
                I pour my heart into these writings. If they've touched you or made you think, a small support helps keep this creative space alive.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={() => {
                    const event = new CustomEvent('navigate-to-page', { detail: 'donate' });
                    window.dispatchEvent(event);
                    onClose();
                  }}
                  className="px-6 py-2.5 bg-brand-600 text-white text-sm font-bold rounded-xl hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/25 active:scale-95 flex items-center justify-center gap-2 group/btn"
                >
                  Support the Journey
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    →
                  </motion.span>
                </button>
                <button 
                  onClick={onClose}
                  className="px-6 py-2.5 bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 text-sm font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95"
                >
                  Maybe Later
                </button>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="absolute top-3 right-3 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-all z-20"
              aria-label="Close banner"
            >
              <X size={18} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SupportBanner;