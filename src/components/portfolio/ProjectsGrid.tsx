import React, { useState } from 'react';
import { Code2, Filter, Rocket } from 'lucide-react';
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
    <section id="projects" className="py-24 bg-white dark:bg-gray-950 border-y border-gray-100 dark:border-gray-800">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold mb-3 uppercase tracking-wider text-xs">
              <Code2 size={14} /> Engineering
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-4">
              Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Projects</span>
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl">
              Real-world applications, open-source contributions, and complex system designs.
            </p>
          </div>
          
          <div className="flex p-1.5 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            {['All', 'Industry', 'Course'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  filter === f
                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                }`}
              >
                {f === 'All' ? 'All Projects' : f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence mode='popLayout'>
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                {/* Pass index for color cycling */}
                <PortfolioBlock item={item} className="h-full" index={index} />
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredItems.length === 0 && (
             <div className="col-span-full text-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
               <Rocket className="mx-auto text-gray-300 mb-4" size={48} />
               <div className="text-gray-500 font-medium">No projects found in this category.</div>
             </div>
          )}
        </div>
      </div>
    </section>
  );
};
