import React from 'react';
import { Trophy, Star } from 'lucide-react';
import { PortfolioItem } from '../../types';
import { PortfolioCard } from './PortfolioCard';

interface AchievementsSectionProps {
  honors: PortfolioItem[];
  leadership: PortfolioItem[];
}

export const AchievementsSection: React.FC<AchievementsSectionProps> = ({ honors, leadership }) => {
  return (
    <section id="achievements" className="py-24 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Honors */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <Trophy className="text-amber-500" size={28} />
              <h2 className="text-3xl font-black text-gray-900 dark:text-white">Honors & Awards</h2>
            </div>
            <div className="space-y-6">
              {honors.map((item, idx) => (
                <PortfolioCard key={item.id} item={item} type="honor" index={idx} />
              ))}
            </div>
          </div>

          {/* Leadership */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <Star className="text-rose-500" size={28} />
              <h2 className="text-3xl font-black text-gray-900 dark:text-white">Leadership</h2>
            </div>
            <div className="space-y-6">
              {leadership.map((item, idx) => (
                <PortfolioCard key={item.id} item={item} type="leadership" index={idx} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
