import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Share2, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EndReaderProps {
  nextTopic?: {
    id: string;
    title: string;
    subjectId: string;
  };
}

export const EndReader: React.FC<EndReaderProps> = ({ nextTopic }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-24 pt-12 border-t border-gray-100 dark:border-gray-800"
    >
      <div className="flex flex-col items-center text-center mb-12">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mb-6 animate-pulse">
          <CheckCircle2 size={32} />
        </div>
        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">You've reached the end</h3>
        <p className="text-gray-500 dark:text-gray-400">Great job! You've completed this section.</p>
        
        <div className="flex gap-4 mt-8">
          <button className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <Bookmark size={18} /> Save for later
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <Share2 size={18} /> Share
          </button>
        </div>
      </div>

      {nextTopic && (
        <div className="max-w-2xl mx-auto">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider text-center mb-4">Up Next</div>
          <Link 
            to={`/learn/${nextTopic.subjectId}/${nextTopic.id}`}
            className="group block bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 hover:border-indigo-500/50 hover:shadow-xl transition-all relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 group-hover:w-2 transition-all"></div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-indigo-600 dark:text-indigo-400 font-bold mb-1">Recommended Next Topic</div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                  {nextTopic.title}
                </h4>
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <ArrowRight size={20} />
              </div>
            </div>
          </Link>
        </div>
      )}
    </motion.div>
  );
};
