import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, BarChart2 } from 'lucide-react';

interface ConsentModalProps {
  onAccept: () => void;
  onDecline: () => void;
}

const ConsentModal: React.FC<ConsentModalProps> = ({ onAccept, onDecline }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] p-4 sm:p-6 pointer-events-none flex justify-center">
      <motion.div
        initial={{ y: 100, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 100, opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="pointer-events-auto max-w-2xl w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5"
      >
        <div className="p-3 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-xl flex-shrink-0">
          <BarChart2 size={24} />
        </div>
        
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white mb-1 flex items-center justify-center sm:justify-start gap-2">
            Analytics & Privacy
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            I use Vercel Analytics to understand how readers interact with my stories. 
            This helps me create better content. Data is anonymous and privacy-focused.
          </p>
        </div>

        <div className="flex flex-row sm:flex-col gap-3 w-full sm:w-auto mt-2 sm:mt-0">
          <button
            onClick={onAccept}
            className="flex-1 sm:flex-none px-6 py-2.5 bg-brand-600 text-white text-sm font-bold rounded-xl hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/30 whitespace-nowrap"
          >
            Allow
          </button>
          <button
            onClick={onDecline}
            className="flex-1 sm:flex-none px-6 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors whitespace-nowrap"
          >
            Decline
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ConsentModal;