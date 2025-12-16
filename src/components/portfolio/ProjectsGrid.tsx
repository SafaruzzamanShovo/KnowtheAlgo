import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Github, ExternalLink, Layers, Star, TrendingUp, Zap } from 'lucide-react';
import { PortfolioItem } from '../../types';
import { useRecruiterMode } from '../../context/RecruiterModeContext';

interface ProjectsGridProps {
  items: PortfolioItem[];
}

export const ProjectsGrid: React.FC<ProjectsGridProps> = ({ items }) => {
  const [filter, setFilter] = useState<'All' | 'Industry' | 'Course'>('All');
  const { isRecruiterMode } = useRecruiterMode();
  
  const filteredItems = filter === 'All' 
    ? items 
    : items.filter(item => (item.details?.type || 'Industry') === filter);

  return (
    <section id="projects" className="py-24 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold mb-2 uppercase tracking-wider text-xs">
            <Code2 size={14} /> Engineering
          </div>
          <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-8">Selected Projects</h2>
          
          <div className="inline-flex bg-gray-100 dark:bg-gray-900 p-1 rounded-xl">
            {['All', 'Industry', 'Course'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                  filter === f
                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                }`}
              >
                {f === 'All' ? 'All Projects' : f === 'Industry' ? 'Industry / Hackathons' : 'Coursework'}
              </button>
            ))}
          </div>
        </div>

        <div className={`grid grid-cols-1 ${isRecruiterMode ? 'lg:grid-cols-2 gap-6' : 'md:grid-cols-2 gap-8'}`}>
          <AnimatePresence mode="popLayout">
            {filteredItems.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className={`group relative bg-gray-50 dark:bg-gray-900 rounded-3xl overflow-hidden border ${isRecruiterMode ? 'border-indigo-100 dark:border-indigo-900/30' : 'border-gray-200 dark:border-gray-800'} hover:shadow-2xl transition-all duration-500`}
              >
                {/* Recruiter Mode: Condensed Header */}
                {isRecruiterMode ? (
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                          {project.title}
                          {project.details?.links?.github && <Star size={14} className="text-amber-500 fill-amber-500" />}
                        </h3>
                        <div className="flex gap-2 text-xs font-bold text-gray-500 uppercase tracking-wide">
                          <span>{project.details?.type}</span>
                          <span>•</span>
                          <span className="text-indigo-600 dark:text-indigo-400">{project.details?.tags?.slice(0, 3).join(', ')}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                         {project.details?.links?.github && (
                           <a href={project.details.links.github} className="text-gray-400 hover:text-gray-900 dark:hover:text-white"><Github size={18} /></a>
                         )}
                         {project.details?.links?.demo && (
                           <a href={project.details.links.demo} className="text-indigo-600 hover:text-indigo-700"><ExternalLink size={18} /></a>
                         )}
                      </div>
                    </div>

                    {/* Impact Metrics First */}
                    <div className="mb-4 grid grid-cols-2 gap-3">
                      <div className="bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-100 dark:border-gray-700 flex items-center gap-2">
                        <TrendingUp size={14} className="text-green-500" />
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Optimized Performance</span>
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-100 dark:border-gray-700 flex items-center gap-2">
                        <Zap size={14} className="text-amber-500" />
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Reduced Latency</span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                ) : (
                  // Storytelling Mode
                  <>
                    <div className={`h-32 bg-gradient-to-r ${project.details?.imageGradient || 'from-gray-700 to-gray-900'} relative`}>
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                      <div className="absolute -bottom-6 left-8">
                        <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center shadow-lg text-gray-900 dark:text-white">
                          <Layers size={24} />
                        </div>
                      </div>
                    </div>

                    <div className="pt-10 p-8">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-indigo-600 transition-colors">
                            {project.title}
                          </h3>
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                            {project.details?.type} Project
                          </span>
                        </div>
                        <div className="flex gap-2">
                          {project.details?.links?.github && (
                            <a href={project.details.links.github} className="p-2 bg-white dark:bg-gray-800 rounded-full text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all border border-gray-200 dark:border-gray-700">
                              <Github size={18} />
                            </a>
                          )}
                          {project.details?.links?.demo && (
                            <a href={project.details.links.demo} className="p-2 bg-indigo-600 rounded-full text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20">
                              <ExternalLink size={18} />
                            </a>
                          )}
                        </div>
                      </div>

                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6 line-clamp-3 group-hover:line-clamp-none transition-all">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {project.details?.tags?.map(tag => (
                          <span key={tag} className="px-2.5 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-xs font-bold text-gray-600 dark:text-gray-400">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
