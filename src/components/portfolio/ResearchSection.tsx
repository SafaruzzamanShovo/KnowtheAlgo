import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { PortfolioItem } from '../../types';
import { PortfolioCard } from './PortfolioCard';

interface ResearchSectionProps {
  items: PortfolioItem[];
}

export const ResearchSection: React.FC<ResearchSectionProps> = ({ items }) => {
  const [filter, setFilter] = useState<'ongoing' | 'completed'>('ongoing');
  const filteredItems = items.filter(item => (item.details?.status || 'ongoing') === filter);

  return (
    <section id="research" className="py-24 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold mb-2 uppercase tracking-wider text-xs">
              <BookOpen size={14} /> Academic Work
            </div>
            <h2 className="text-4xl font-black text-gray-900 dark:text-white">Research Experience</h2>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-1.5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex">
            <button
              onClick={() => setFilter('ongoing')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                filter === 'ongoing'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              Ongoing
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                filter === 'completed'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              Published
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {filteredItems.map((item, index) => (
            <PortfolioCard key={item.id} item={item} type="research" index={index} />
          ))}
          {filteredItems.length === 0 && (
            <div className="text-center py-12 text-gray-500">No research items found in this category.</div>
          )}
        </div>
      </div>
    </section>
  );
};
