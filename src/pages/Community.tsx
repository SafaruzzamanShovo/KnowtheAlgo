import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { CommunityPost } from '../types';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { Search, ArrowRight, MessageSquare, Layers, ChevronLeft, Sparkles, Hash, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Background } from '../components/Background';

export const Community = () => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { categories, communitySettings } = useSiteSettings();

  useEffect(() => {
    if (selectedCategory) {
      fetchPosts(selectedCategory);
    }
  }, [selectedCategory]);

  const fetchPosts = async (category: string) => {
    setLoading(true);
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('community_posts')
          .select('*')
          .eq('status', 'approved')
          .eq('category', category)
          .order('display_order', { ascending: true })
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setPosts(data || []);
      }
    } catch (error) {
      console.error('Error fetching community posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- View 1: Category Hub ---
  if (!selectedCategory) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <Background />
        
        <div className="container mx-auto px-4 max-w-5xl relative z-10 pt-32 pb-20">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200 dark:border-gray-800 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-6 shadow-sm">
                <Sparkles size={12} /> 
                <span className="uppercase tracking-wide">Knowledge Hub</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
                {communitySettings.title}
              </h1>
              
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto mb-8 leading-relaxed">
                {communitySettings.subtitle}
              </p>

              <Link 
                to="/contribute" 
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-bold hover:scale-105 transition-transform shadow-lg shadow-indigo-500/10 text-sm"
              >
                <MessageSquare size={16} /> Start a Discussion
              </Link>
            </motion.div>
          </div>

          {/* Minimal Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((cat, index) => (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedCategory(cat.title)}
                className="group relative bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl p-5 border border-gray-200 dark:border-gray-800 hover:border-indigo-500/30 text-left transition-all hover:shadow-lg hover:-translate-y-0.5 flex flex-col h-full"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center text-white shadow-sm`}>
                    <Layers size={18} />
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400">
                    <ArrowRight size={16} />
                  </div>
                </div>
                
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {cat.title}
                </h3>
                
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- View 2: Post Feed ---
  return (
    <div className="min-h-screen relative overflow-hidden">
      <Background />

      <div className="container mx-auto px-4 max-w-6xl relative z-10 pt-28 pb-20">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <button 
              onClick={() => setSelectedCategory(null)}
              className="group flex items-center text-sm font-bold text-gray-500 hover:text-indigo-600 mb-4 transition-colors uppercase tracking-wide"
            >
              <ChevronLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" /> 
              Back to Categories
            </button>
            <h2 className="text-4xl font-black text-gray-900 dark:text-white flex items-center gap-3">
              {selectedCategory}
              <span className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-bold align-middle">
                Topic
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search posts..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-64 transition-all"
              />
            </div>
            <Link 
              to="/contribute" 
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20 whitespace-nowrap"
            >
              + Create Post
            </Link>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-white/50 dark:bg-gray-900/50 rounded-3xl animate-pulse border border-gray-200 dark:border-gray-800"></div>
            ))}
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link to={`/community/${post.id}`} className="block h-full group">
                    <article className="h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-3xl p-6 border border-gray-200 dark:border-gray-800 hover:border-indigo-500/50 transition-all hover:shadow-xl hover:-translate-y-1 flex flex-col relative overflow-hidden">
                      
                      {/* Decorative Top Gradient */}
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-green-500"></span>
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Discussion</span>
                        </div>
                        <span className="text-xs text-gray-400 flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
                          <Clock size={12} /> {new Date(post.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 transition-colors leading-tight">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3 flex-1 text-sm leading-relaxed">
                        {post.content.replace(/<[^>]*>?/gm, '').substring(0, 150)}...
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {post.tags?.slice(0, 2).map(tag => (
                          <span key={tag} className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-medium flex items-center gap-1">
                            <Hash size={10} /> {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800 mt-auto">
                        <div className="flex items-center gap-3">
                          {post.author_avatar ? (
                            <img src={post.author_avatar} alt={post.author_name} className="w-8 h-8 rounded-full object-cover ring-2 ring-white dark:ring-gray-900" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white dark:ring-gray-900">
                              {post.author_name.charAt(0)}
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-gray-900 dark:text-white">
                              {post.author_name}
                            </span>
                            <span className="text-[10px] text-gray-500">Author</span>
                          </div>
                        </div>
                        
                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                          <ArrowRight size={14} />
                        </div>
                      </div>
                    </article>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-24 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-3xl border border-gray-200 dark:border-gray-800 border-dashed">
            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <MessageSquare size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No posts found</h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              {searchQuery ? `No results for "${searchQuery}"` : `Be the first to write about ${selectedCategory}!`}
            </p>
            <Link to="/contribute" className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors">
              Start a Discussion
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
