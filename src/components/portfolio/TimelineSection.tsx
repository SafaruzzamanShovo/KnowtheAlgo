import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, Calendar } from 'lucide-react';
import { PortfolioItem } from '../../types';

interface TimelineSectionProps {
  experience: PortfolioItem[];
  education: PortfolioItem[];
}

export const TimelineSection: React.FC<TimelineSectionProps> = ({ experience, education }) => {
  return (
    <section id="timeline" className="py-24 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4">Professional Journey</h2>
          <p className="text-gray-500 dark:text-gray-400">My path through education and industry.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 relative">
          {/* Central Line (Desktop) */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-800 -translate-x-1/2"></div>

          {/* Experience Column */}
          <div>
            <div className="flex items-center gap-3 mb-10">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                <Briefcase size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Experience</h3>
            </div>
            
            <div className="space-y-12">
              {experience.map((item, index) => (
                <TimelineItem key={item.id} item={item} index={index} side="left" />
              ))}
            </div>
          </div>

          {/* Education Column */}
          <div>
            <div className="flex items-center gap-3 mb-10 md:flex-row-reverse">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
                <GraduationCap size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Education</h3>
            </div>

            <div className="space-y-12">
              {education.map((item, index) => (
                <TimelineItem key={item.id} item={item} index={index} side="right" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const TimelineItem = ({ item, index, side }: { item: PortfolioItem, index: number, side: 'left' | 'right' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: side === 'left' ? -20 : 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ delay: index * 0.1 }}
      className={`relative ${side === 'right' ? 'md:text-right' : ''}`}
    >
      {/* Connector Dot (Desktop) */}
      <div className={`hidden md:block absolute top-6 w-4 h-4 rounded-full border-4 border-white dark:border-gray-900 bg-indigo-500 shadow-lg z-10 ${side === 'left' ? '-right-[56px]' : '-left-[57px]'}`}></div>

      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow relative">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-bold text-gray-600 dark:text-gray-400 mb-4">
          <Calendar size={12} /> {item.period}
        </span>
        
        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
          {item.title}
        </h4>
        <div className="text-indigo-600 dark:text-indigo-400 font-medium text-sm mb-3">
          {item.organization}
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          {item.description}
        </p>
      </div>
    </motion.div>
  );
};
