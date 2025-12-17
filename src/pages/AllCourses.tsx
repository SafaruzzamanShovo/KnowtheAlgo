import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, BookOpen, ArrowLeft } from 'lucide-react';
import { useCurriculum } from '../hooks/useCurriculum';
import { CourseIcon } from '../components/home/LearningPaths';
import { Background } from '../components/Background';

export const AllCourses = () => {
  const { subjects, loading } = useCurriculum();

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Background />
      
      <div className="container mx-auto px-4 relative z-10 pt-24 pb-20">
        
        <div className="max-w-6xl mx-auto mb-12">
          <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600 mb-8 transition-colors group">
            <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Home
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold mb-2 uppercase tracking-wider text-xs">
                <BookOpen size={14} /> Full Curriculum
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white">
                All Courses
              </h1>
            </motion.div>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-md">
              Explore our complete catalog of engineering topics and learning paths.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {subjects.map((subject, index) => (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link 
                  to={`/learn/${subject.id}`}
                  className="group block h-full relative"
                >
                  {/* Card Background - slightly opaque to stand out from page bg */}
                  <div className="h-full bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-2xl p-5 border border-gray-200 dark:border-gray-800 hover:border-indigo-500/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col relative overflow-hidden">
                    
                    {/* Hover Gradient */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <div className="relative z-10 flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <CourseIcon icon={subject.icon} color={subject.color} />
                        <span className="px-2 py-0.5 rounded-md bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-[10px] font-bold uppercase tracking-wide text-gray-500">
                          {subject.level}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {subject.title}
                      </h3>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed line-clamp-2">
                        {subject.description}
                      </p>
                    </div>
                    
                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
                      <div className="text-xs font-medium text-gray-500">
                        {subject.modules.length} Modules
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:gap-2 transition-all">
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
    </div>
  );
};
