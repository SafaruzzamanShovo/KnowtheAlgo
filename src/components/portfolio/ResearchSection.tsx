import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, User, Users, ExternalLink, FileText, CheckCircle2 } from 'lucide-react';
import { PortfolioItem } from '../../types';
import { useRecruiterMode } from '../../context/RecruiterModeContext';

interface ResearchSectionProps {
  items: PortfolioItem[];
}

export const ResearchSection: React.FC<ResearchSectionProps> = ({ items }) => {
  const [filter, setFilter] = useState<'ongoing' | 'completed'>('ongoing');
  const { isRecruiterMode } = useRecruiterMode();
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
          
          <div className="bg-white dark:bg-gray-800 p-1.5 rounded-full shadow-sm border border-gray-100 dark:border-gray-700 flex">
            <button
              onClick={() => setFilter('ongoing')}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                filter === 'ongoing'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              Ongoing
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                filter === 'completed'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              Published
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.1 }}
                className={`group bg-white dark:bg-gray-900 rounded-2xl p-8 border hover:shadow-xl transition-all relative overflow-hidden ${isRecruiterMode ? 'border-l-4 border-l-indigo-500 border-y border-r border-gray-200' : 'border border-gray-200 dark:border-gray-800'}`}
              >
                {/* Status Indicator Line (Storytelling Mode) */}
                {!isRecruiterMode && (
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${filter === 'ongoing' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                )}

                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Left: Meta */}
                  <div className="lg:w-1/4 flex flex-col gap-4">
                    {!isRecruiterMode && (
                      <div className="w-16 h-16 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center overflow-hidden">
                         {item.details?.image ? (
                           <img src={item.details.image} alt={item.organization} className="w-full h-full object-cover" />
                         ) : (
                           <BookOpen className="text-gray-400" size={24} />
                         )}
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white text-lg">{item.organization}</div>
                      <div className="text-sm text-gray-500 font-medium">{item.period}</div>
                    </div>
                    {item.details?.advisor && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <User size={14} className="text-indigo-500" />
                        <span>Advisor: {item.details.advisor}</span>
                      </div>
                    )}
                  </div>

                  {/* Right: Content */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                        {item.title}
                      </h3>
                      {filter === 'ongoing' && !isRecruiterMode && (
                        <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase rounded-full tracking-wide">
                          In Progress
                        </span>
                      )}
                    </div>
                    
                    {isRecruiterMode ? (
                      <ul className="space-y-2 mb-6">
                        <li className="flex gap-2 text-gray-700 dark:text-gray-300">
                          <CheckCircle2 size={16} className="text-indigo-500 flex-shrink-0 mt-1" />
                          <span className="text-sm">{item.description}</span>
                        </li>
                        {/* Mock bullet points for demo since data is single string */}
                        <li className="flex gap-2 text-gray-700 dark:text-gray-300">
                          <CheckCircle2 size={16} className="text-indigo-500 flex-shrink-0 mt-1" />
                          <span className="text-sm">Achieved significant performance improvements in distributed environments.</span>
                        </li>
                      </ul>
                    ) : (
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 text-lg">
                        {item.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2 mb-6">
                      {item.details?.tags?.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-bold rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 pt-6 border-t border-gray-100 dark:border-gray-800">
                      {item.details?.team && !isRecruiterMode && (
                        <div className="flex items-center gap-2 text-sm text-gray-500 mr-auto">
                          <Users size={14} />
                          <span>with {item.details.team.join(', ')}</span>
                        </div>
                      )}
                      
                      {item.details?.links?.scholar && (
                        <a href={item.details.links.scholar} className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-white transition-colors">
                          <ExternalLink size={14} /> Scholar
                        </a>
                      )}
                      {item.details?.links?.paper && (
                        <a href={item.details.links.paper} className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity">
                          <FileText size={14} /> Read Paper
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
