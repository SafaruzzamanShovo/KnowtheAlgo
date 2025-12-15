import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { CommunityPost } from '../types';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { Search, User, Calendar, ArrowRight, MessageSquare, Layers, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export const Community = () => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
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

  // View 1: Category Selection
  if (!selectedCategory) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
              {communitySettings.title}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
              {communitySettings.subtitle}
            </p>
            <Link 
              to="/contribute" 
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30"
            >
              Write a Post
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {categories.map((cat, index) => (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedCategory(cat.title)}
                className="group relative overflow-hidden bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 hover:border-indigo-500/50 text-left transition-all hover:shadow-xl hover:-translate-y-1"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${cat.color} opacity-10 blur-2xl rounded-full group-hover:opacity-20 transition-opacity`}></div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white mb-6 shadow-lg`}>
                  <Layers size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{cat.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{cat.description}</p>
                <div className="mt-6 flex items-center text-indigo-600 font-bold text-sm">
                  View Posts <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // View 2: Posts List
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <button 
          onClick={() => setSelectedCategory(null)}
          className="flex items-center text-gray-500 hover:text-indigo-600 mb-8 transition-colors font-medium"
        >
          <ChevronLeft size={20} className="mr-1" /> Back to Topics
        </button>

        <div className="flex flex-col md:flex-row items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{selectedCategory} Posts</h2>
            <p className="text-gray-600 dark:text-gray-400">Browsing all approved community submissions.</p>
          </div>
          <Link 
            to="/contribute" 
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            + New Post
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">Loading posts...</p>
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={`/community/${post.id}`} className="block h-full group">
                  <article className="h-full bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 hover:border-indigo-500/50 transition-all hover:shadow-xl hover:-translate-y-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase">
                        {post.category}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Calendar size={12} /> {new Date(post.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3 flex-1">
                      {post.content.substring(0, 150)}...
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-500">
                          <User size={14} />
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {post.author_name}
                        </span>
                      </div>
                      <span className="text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight size={20} />
                      </span>
                    </div>
                  </article>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
            <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No posts yet</h3>
            <p className="text-gray-500 mb-6">Be the first to write about {selectedCategory}!</p>
            <Link to="/contribute" className="text-indigo-600 font-medium hover:underline">
              Write a contribution
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
