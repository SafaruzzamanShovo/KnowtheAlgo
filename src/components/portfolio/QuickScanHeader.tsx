import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Award, Target, Download, CheckCircle2 } from 'lucide-react';
import { AboutSettings, PortfolioItem } from '../../types';
import { generateCV } from '../../utils/pdfGenerator';

interface QuickScanHeaderProps {
  settings: AboutSettings;
  items: PortfolioItem[];
}

export const QuickScanHeader: React.FC<QuickScanHeaderProps> = ({ settings, items }) => {
  // Derived Metrics
  const yearsExp = new Date().getFullYear() - 2020; // Mock calculation based on education start
  const projectCount = items.filter(i => i.section === 'project').length;
  const researchCount = items.filter(i => i.section === 'research').length;
  const awardCount = items.filter(i => i.section === 'honor').length;

  const coreSkills = settings.skills.slice(0, 5);

  const handleDownloadCV = () => {
    generateCV(settings, items);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-16 z-30 shadow-sm"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          
          {/* Identity & Core Role */}
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xl">
              {settings.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">{settings.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{settings.role}</p>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="flex items-center gap-8 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto scrollbar-none">
            <MetricItem icon={Clock} value={`${yearsExp}+ Years`} label="Experience" />
            <MetricItem icon={Target} value={projectCount.toString()} label="Projects" />
            <MetricItem icon={Award} value={(researchCount + awardCount).toString()} label="Impact Items" />
          </div>

          {/* Core Skills & CTA */}
          <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
            <div className="hidden xl:flex gap-2">
              {coreSkills.map(skill => (
                <span key={skill} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300 rounded">
                  {skill}
                </span>
              ))}
            </div>
            
            <button 
              onClick={handleDownloadCV}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold transition-colors shadow-lg shadow-indigo-500/20 whitespace-nowrap"
            >
              <Download size={16} /> Download CV
            </button>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

const MetricItem = ({ icon: Icon, value, label }: { icon: any, value: string, label: string }) => (
  <div className="flex items-center gap-3 min-w-[100px]">
    <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-400">
      <Icon size={18} />
    </div>
    <div>
      <div className="font-black text-gray-900 dark:text-white leading-none mb-1">{value}</div>
      <div className="text-[10px] font-bold uppercase text-gray-400 tracking-wide">{label}</div>
    </div>
  </div>
);
