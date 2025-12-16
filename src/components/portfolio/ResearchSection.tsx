import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { PortfolioItem } from '../../types';
import { PortfolioBlock } from './PortfolioBlock';
import { motion } from 'framer-motion';

interface ResearchSectionProps {
  items: PortfolioItem[];
}

export const ResearchSection: React.FC<ResearchSectionProps> = ({ items }) => {
  const [filter, setFilter] = useState<'ongoing' | 'completed'>('ongoing');
  const filteredItems = items.filter(item => (item.details?.status || 'ongoing') === filter);

  return (
    <section id="research" className="py-24 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold mb-2 uppercase tracking-wider text-xs">
              <BookOpen size={14} /> Academic Work
            </div>
            <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Research Experience</h2>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('ongoing')}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all border ${
                filter === 'ongoing'
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-transparent'
                  : 'bg-transparent text-gray-500 border-gray-200 dark:border-gray-800 hover:border-gray-300'
              }`}
            >
              Ongoing
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all border ${
                filter === 'completed'
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-transparent'
                  : 'bg-transparent text-gray-500 border-gray-200 dark:border-gray-800 hover:border-gray-300'
              }`}
            >
              Published / Completed
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <PortfolioBlock item={item} className="h-full" />
            </motion.div>
          ))}
          {filteredItems.length === 0 && (
            <div className="col-span-full text-center py-16 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
              <p className="text-gray-500">No research items found in this category.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
