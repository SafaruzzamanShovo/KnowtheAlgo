import React, { useState } from 'react';
import { Code2, Filter } from 'lucide-react';
import { PortfolioItem } from '../../types';
import { PortfolioBlock } from './PortfolioBlock';
import { motion, AnimatePresence } from 'framer-motion';

interface ProjectsGridProps {
  items: PortfolioItem[];
}

export const ProjectsGrid: React.FC<ProjectsGridProps> = ({ items }) => {
  const [filter, setFilter] = useState<'All' | 'Industry' | 'Course'>('All');
  
  const filteredItems = filter === 'All' 
    ? items 
    : items.filter(item => (item.details?.type || 'Industry') === filter);

  return (
    <section id="projects" className="py-24 bg-gray-50/50 dark:bg-gray-900/50">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold mb-2 uppercase tracking-wider text-xs">
              <Code2 size={14} /> Engineering
            </div>
            <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Featured Projects</h2>
          </div>
          
          <div className="flex gap-1 bg-white dark:bg-gray-900 p-1.5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
            {['All', 'Industry', 'Course'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  filter === f
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                }`}
              >
                {f === 'All' ? 'All' : f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode='popLayout'>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <PortfolioBlock item={item} className="h-full" />
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredItems.length === 0 && (
             <div className="col-span-full text-center py-12 text-gray-500 italic">No projects found in this category.</div>
          )}
        </div>
      </div>
    </section>
  );
};
