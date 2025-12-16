import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Eye } from 'lucide-react';
import { useRecruiterMode } from '../../context/RecruiterModeContext';

export const RecruiterToggle = () => {
  const { isRecruiterMode, toggleRecruiterMode } = useRecruiterMode();

  return (
    <motion.button
      onClick={toggleRecruiterMode}
      className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 px-5 py-3 rounded-full shadow-2xl transition-all duration-300 border ${
        isRecruiterMode 
          ? 'bg-indigo-600 text-white border-indigo-500 shadow-indigo-500/30' 
          : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className={`p-1.5 rounded-full ${isRecruiterMode ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-800'}`}>
        {isRecruiterMode ? <Briefcase size={18} /> : <Eye size={18} />}
      </div>
      <div className="text-left">
        <div className="text-[10px] uppercase font-bold tracking-wider opacity-70">View Mode</div>
        <div className="text-sm font-bold leading-none">
          {isRecruiterMode ? 'Recruiter' : 'Storytelling'}
        </div>
      </div>
      
      {/* Toggle Switch Visual */}
      <div className={`w-10 h-5 rounded-full relative transition-colors ${isRecruiterMode ? 'bg-white/30' : 'bg-gray-200 dark:bg-gray-700'}`}>
        <motion.div 
          className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
          animate={{ x: isRecruiterMode ? 20 : 0 }}
        />
      </div>
    </motion.button>
  );
};
