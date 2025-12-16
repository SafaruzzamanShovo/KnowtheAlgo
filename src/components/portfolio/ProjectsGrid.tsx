import React, { useState } from 'react';
import { Code2 } from 'lucide-react';
import { PortfolioItem } from '../../types';
import { PortfolioCard } from './PortfolioCard';

interface ProjectsGridProps {
  items: PortfolioItem[];
}

export const ProjectsGrid: React.FC<ProjectsGridProps> = ({ items }) => {
  const [filter, setFilter] = useState<'All' | 'Industry' | 'Course'>('All');
  
  const filteredItems = filter === 'All' 
    ? items 
    : items.filter(item => (item.details?.type || 'Industry') === filter);

  return (
    <section id="projects" className="py-24 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold mb-2 uppercase tracking-wider text-xs">
              <Code2 size={14} /> Engineering
            </div>
            <h2 className="text-4xl font-black text-gray-900 dark:text-white">Selected Projects</h2>
          </div>
          
          <div className="bg-gray-100 dark:bg-gray-900 p-1.5 rounded-xl flex overflow-x-auto">
            {['All', 'Industry', 'Course'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                  filter === f
                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                }`}
              >
                {f === 'All' ? 'All' : f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredItems.map((item, index) => (
            <PortfolioCard key={item.id} item={item} type="project" index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
