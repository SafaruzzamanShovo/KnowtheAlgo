import React from 'react';
import { Trophy, Star } from 'lucide-react';
import { PortfolioItem } from '../../types';
import { PortfolioBlock } from './PortfolioBlock';

interface AchievementsSectionProps {
  honors: PortfolioItem[];
  leadership: PortfolioItem[];
}

export const AchievementsSection: React.FC<AchievementsSectionProps> = ({ honors, leadership }) => {
  return (
    <section id="achievements" className="py-24 bg-gray-50/50 dark:bg-gray-900/50">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Honors */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg">
                <Trophy size={20} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Honors & Awards</h3>
            </div>
            <div className="space-y-4">
              {honors.map((item) => (
                <PortfolioBlock key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* Leadership */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg">
                <Star size={20} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Leadership</h3>
            </div>
            <div className="space-y-4">
              {leadership.map((item) => (
                <PortfolioBlock key={item.id} item={item} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
