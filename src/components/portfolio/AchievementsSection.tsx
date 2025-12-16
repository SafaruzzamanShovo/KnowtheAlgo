import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, Star } from 'lucide-react';
import { PortfolioItem } from '../../types';

interface AchievementsSectionProps {
  honors: PortfolioItem[];
  leadership: PortfolioItem[];
}

export const AchievementsSection: React.FC<AchievementsSectionProps> = ({ honors, leadership }) => {
  return (
    <section id="achievements" className="py-24 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Honors */}
          <div>
            <div className="flex items-center gap-3 mb-10">
              <Trophy className="text-amber-500" size={28} />
              <h2 className="text-3xl font-black text-gray-900 dark:text-white">Honors & Awards</h2>
            </div>
            <div className="space-y-4">
              {honors.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 flex items-start gap-4 hover:border-amber-500/50 transition-colors"
                >
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500 rounded-lg">
                    <Award size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-lg">{item.title}</h4>
                    <div className="text-gray-500 text-sm mb-1">{item.organization}</div>
                    <span className="text-xs font-bold bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-gray-600 dark:text-gray-400">
                      {item.period}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Leadership */}
          <div>
            <div className="flex items-center gap-3 mb-10">
              <Star className="text-blue-500" size={28} />
              <h2 className="text-3xl font-black text-gray-900 dark:text-white">Leadership</h2>
            </div>
            <div className="space-y-4">
              {leadership.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 flex items-start gap-4 hover:border-blue-500/50 transition-colors"
                >
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-500 rounded-lg">
                    <Star size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-lg">{item.title}</h4>
                    <div className="text-indigo-600 dark:text-indigo-400 font-medium text-sm mb-2">{item.organization}</div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
