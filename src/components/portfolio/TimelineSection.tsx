import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, GraduationCap } from 'lucide-react';
import { PortfolioItem } from '../../types';
import { PortfolioCard } from './PortfolioCard';

interface TimelineSectionProps {
  experience: PortfolioItem[];
  education: PortfolioItem[];
}

export const TimelineSection: React.FC<TimelineSectionProps> = ({ experience, education }) => {
  return (
    <section id="timeline" className="py-24 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4">Professional Journey</h2>
          <p className="text-gray-500 dark:text-gray-400">My path through education and industry.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 relative">
          {/* Central Divider (Desktop) */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 dark:border-gray-800 -translate-x-1/2 bg-gradient-to-b from-transparent via-gray-300 dark:via-gray-700 to-transparent"></div>

          {/* Experience Column */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                <Briefcase size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Experience</h3>
            </div>
            
            <div className="space-y-8">
              {experience.map((item, index) => (
                <div key={item.id} className="relative">
                  {/* Connector Dot */}
                  <div className="hidden lg:block absolute top-8 -right-[54px] w-3 h-3 rounded-full bg-indigo-500 border-2 border-white dark:border-gray-900 shadow-sm z-10"></div>
                  <PortfolioCard item={item} type="experience" index={index} />
                </div>
              ))}
            </div>
          </div>

          {/* Education Column */}
          <div>
            <div className="flex items-center gap-3 mb-8 lg:flex-row-reverse">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
                <GraduationCap size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Education</h3>
            </div>

            <div className="space-y-8">
              {education.map((item, index) => (
                <div key={item.id} className="relative">
                  {/* Connector Dot */}
                  <div className="hidden lg:block absolute top-8 -left-[55px] w-3 h-3 rounded-full bg-purple-500 border-2 border-white dark:border-gray-900 shadow-sm z-10"></div>
                  <PortfolioCard item={item} type="education" index={index} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
