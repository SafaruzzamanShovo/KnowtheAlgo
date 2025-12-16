import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code2, Server, Globe, Database, Cpu, ChevronRight, BookOpen } from 'lucide-react';
import { Subject } from '../../types';

const iconMap: Record<string, React.ReactNode> = {
  Code2: <Code2 className="w-5 h-5" />,
  Server: <Server className="w-5 h-5" />,
  Globe: <Globe className="w-5 h-5" />,
  Database: <Database className="w-5 h-5" />,
  Cpu: <Cpu className="w-5 h-5" />,
};

interface LearningPathsProps {
  subjects: Subject[];
  loading: boolean;
}

export const LearningPaths: React.FC<LearningPathsProps> = ({ subjects, loading }) => {
  return (
    <section id="curriculum" className="py-24 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 max-w-6xl mx-auto">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold mb-2 uppercase tracking-wider text-xs">
                <BookOpen size={14} /> Curriculum
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white">
                Learning Paths
              </h2>
            </motion.div>
          </div>
          <motion.p 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-lg text-gray-500 dark:text-gray-400 max-w-md"
          >
            Choose a specialized track designed to take you from fundamentals to advanced engineering.
          </motion.p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto mb-12">
            {subjects.map((subject, index) => (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link 
                  to={`/learn/${subject.id}`}
                  className="group block h-full relative"
                >
                  <div className="h-full bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 hover:border-indigo-500/30 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col relative overflow-hidden">
                    
                    {/* Hover Gradient */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <div className="relative z-10 flex-1">
                      <div className="flex justify-between items-start mb-6">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${subject.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          {iconMap[subject.icon] || <Code2 size={20} />}
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-[10px] font-bold uppercase tracking-wide text-gray-500">
                          {subject.level}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {subject.title}
                      </h3>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed line-clamp-3">
                        {subject.description}
                      </p>
                    </div>
                    
                    <div className="mt-auto flex items-center justify-between pt-5 border-t border-gray-200 dark:border-gray-800">
                      <div className="text-xs font-medium text-gray-500">
                        {subject.modules.length} Modules
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:gap-2.5 transition-all">
                        Start Path <ChevronRight size={14} />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
