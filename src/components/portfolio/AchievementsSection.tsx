import React from 'react';
import { Trophy, Crown } from 'lucide-react';
import { PortfolioItem } from '../../types';
import { PortfolioBlock } from './PortfolioBlock';

interface AchievementsSectionProps {
  honors: PortfolioItem[];
  leadership: PortfolioItem[];
}

export const AchievementsSection: React.FC<AchievementsSectionProps> = ({ honors, leadership }) => {
  return (
    <section id="achievements" className="py-24 bg-gray-50/50 dark:bg-gray-900/30">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          
          {/* Honors */}
          <div>
            <div className="flex items-center gap-3 mb-10">
              <div className="p-3 bg-white dark:bg-gray-900 text-amber-500 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                <Trophy size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white">Honors & Awards</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Recognition for excellence.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {honors.map((item, idx) => (
                <PortfolioBlock key={item.id} item={item} index={idx} className="h-full" />
              ))}
            </div>
          </div>

          {/* Leadership */}
          <div>
            <div className="flex items-center gap-3 mb-10">
              <div className="p-3 bg-white dark:bg-gray-900 text-rose-500 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                <Crown size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white">Leadership</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Impact beyond code.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {leadership.map((item, idx) => (
                <PortfolioBlock key={item.id} item={item} index={idx + 2} className="h-full" />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
