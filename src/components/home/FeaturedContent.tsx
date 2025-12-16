import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, ArrowRight, Quote, Hash } from 'lucide-react';
import { CommunityPost } from '../../types';

interface FeaturedContentProps {
  post: CommunityPost | null;
  loading: boolean;
  title: string;
  subtitle: string;
}

export const FeaturedContent: React.FC<FeaturedContentProps> = ({ post, loading, title, subtitle }) => {
  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto bg-white dark:bg-gray-950 rounded-[3rem] p-8 md:p-16 shadow-2xl border border-gray-200 dark:border-gray-800 relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Text Side */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-xs font-bold mb-6">
                  <MessageSquare size={14} /> 
                  <span>Community Spotlight</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
                  {title}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                  {subtitle}
                </p>
                <Link 
                  to="/community" 
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-bold hover:opacity-90 transition-opacity"
                >
                  Join the Discussion <ArrowRight size={18} />
                </Link>
              </motion.div>
            </div>

            {/* Card Side */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              {loading ? (
                <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-3xl animate-pulse"></div>
              ) : post ? (
                <Link to={`/community/${post.id}`} className="block group">
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative">
                    <Quote size={40} className="absolute top-8 right-8 text-indigo-200 dark:text-indigo-900/50" />
                    
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                        {post.author_name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-gray-900 dark:text-white font-bold">{post.author_name}</div>
                        <div className="text-gray-500 text-xs">
                          {new Date(post.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3 leading-relaxed">
                      {post.content.replace(/<[^>]*>?/gm, '')}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        <Hash size={12} /> {post.category}
                      </span>
                      <span className="text-sm font-bold text-gray-400 group-hover:text-indigo-600 transition-colors flex items-center gap-1">
                        Read More <ArrowRight size={16} />
                      </span>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-10 text-center border border-dashed border-gray-300 dark:border-gray-700">
                  <p className="text-gray-500 font-medium">No featured posts yet.</p>
                </div>
              )}
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
};
