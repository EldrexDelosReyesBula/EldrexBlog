import React from 'react';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

interface NotFoundProps {
  onBackToHome: () => void;
}

const NotFound: React.FC<NotFoundProps> = ({ onBackToHome }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative mb-8">
            <h1 className="text-9xl font-black text-slate-200 dark:text-slate-800/50 select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                Post Not Found
              </span>
            </div>
          </div>
          
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            The writing you're looking for might have been moved, deleted, or never existed in the first place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onBackToHome}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#ff0557] hover:bg-[#e6044d] text-white rounded-xl font-medium transition-all shadow-lg shadow-[#ff0557]/20"
            >
              <Home size={18} />
              Back to Home
            </button>
            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              <ArrowLeft size={18} />
              Go Back
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
