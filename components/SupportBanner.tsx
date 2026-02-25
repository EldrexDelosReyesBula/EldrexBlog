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
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-4 right-4 z-[55] w-full max-w-md px-4 sm:px-0"
        >
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-brand-100 dark:border-slate-700 p-5 flex items-start gap-4 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-50 dark:bg-brand-900/10 rounded-bl-full -mr-4 -mt-4 z-0 pointer-events-none" />
            
            <div className="p-3 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-xl relative z-10 shrink-0">
              <Coffee size={24} />
            </div>

            <div className="flex-1 relative z-10">
              <h4 className="font-serif font-bold text-slate-900 dark:text-white mb-1">
                Enjoying the content?
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                I noticed you've been reading for a while. If you find value in my writing, consider supporting the blog to help keep it running.
              </p>
              <div className="flex gap-3">
                <a 
                  href="https://ko-fi.com/landecsorg" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-brand-600 text-white text-xs font-bold rounded-lg hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/20"
                >
                  Support Now
                </a>
                <button 
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors z-20"
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SupportBanner;