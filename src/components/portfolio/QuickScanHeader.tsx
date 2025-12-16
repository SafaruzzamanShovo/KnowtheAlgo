import React from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { AboutSettings, PortfolioItem } from '../../types';
import { generateCV } from '../../utils/pdfGenerator';

interface QuickScanHeaderProps {
  settings: AboutSettings;
  items: PortfolioItem[];
}

export const QuickScanHeader: React.FC<QuickScanHeaderProps> = ({ settings }) => {
  const coreSkills = settings.skills.slice(0, 5);

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-[72px] z-30 shadow-sm/50 backdrop-blur-md bg-white/90 dark:bg-gray-900/90"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Identity & Core Role */}
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-indigo-500/20">
              {settings.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white leading-tight flex items-center gap-2">
                {settings.name}
                <span className="px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold uppercase tracking-wide">
                  Open to Work
                </span>
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{settings.role}</p>
            </div>
          </div>

          {/* Actions & Skills */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            <div className="hidden lg:flex gap-2">
              {coreSkills.map(skill => (
                <span key={skill} className="px-2 py-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[10px] font-bold text-gray-600 dark:text-gray-300 rounded-md">
                  {skill}
                </span>
              ))}
            </div>
            
            <button 
              onClick={() => generateCV(settings, [] as any)} 
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-lg text-xs font-bold transition-all shadow-md hover:shadow-lg whitespace-nowrap"
            >
              <Download size={14} /> Download Resume
            </button>
          </div>

        </div>
      </div>
    </motion.div>
  );
};
