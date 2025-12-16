import React, { useState } from 'react';
import { BookOpen, Sparkles } from 'lucide-react';
import { PortfolioItem } from '../../types';
import { PortfolioBlock } from './PortfolioBlock';
import { motion, AnimatePresence } from 'framer-motion';

interface ResearchSectionProps {
  items: PortfolioItem[];
}

export const ResearchSection: React.FC<ResearchSectionProps> = ({ items }) => {
  const [filter, setFilter] = useState<'ongoing' | 'completed'>('ongoing');
  const filteredItems = items.filter(item => (item.details?.status || 'ongoing') === filter);

  return (
    <section id="research" className="py-24 bg-gray-50/50 dark:bg-gray-900/30 relative">
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold mb-3 uppercase tracking-wider text-xs">
              <BookOpen size={14} /> Academic Work
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-4">
              Research <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Experience</span>
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl">
              Pushing the boundaries of what's possible through rigorous academic inquiry and experimentation.
            </p>
          </div>
          
          <div className="flex p-1.5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
            <button
              onClick={() => setFilter('ongoing')}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                filter === 'ongoing'
                  ? 'bg-gray-100 dark:bg-gray-800 text-indigo-600 dark:text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Ongoing
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                filter === 'completed'
                  ? 'bg-gray-100 dark:bg-gray-800 text-indigo-600 dark:text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Published
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence mode='popLayout'>
            {filteredItems.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
              >
                {/* Pass index + offset to ensure different colors from projects */}
                <PortfolioBlock item={item} className="h-full" index={idx + 2} />
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredItems.length === 0 && (
            <div className="col-span-full text-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
              <Sparkles className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-500 font-medium">No research items found in this category.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
