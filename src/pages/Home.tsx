import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Code2, Server, Globe, Database, Cpu, ChevronRight, BookOpen, Users, MessageSquare, Sparkles, Handshake, Quote } from 'lucide-react';
import { useCurriculum } from '../hooks/useCurriculum';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { supabase } from '../lib/supabase';
import { CommunityPost } from '../types';

const iconMap: Record<string, React.ReactNode> = {
  Code2: <Code2 className="w-6 h-6" />,
  Server: <Server className="w-6 h-6" />,
  Globe: <Globe className="w-6 h-6" />,
  Database: <Database className="w-6 h-6" />,
  Cpu: <Cpu className="w-6 h-6" />,
};

export const Home = () => {
  const { subjects, loading } = useCurriculum();
  const { homeSettings } = useSiteSettings();
  const [latestPost, setLatestPost] = useState<CommunityPost | null>(null);

  // Automate: Fetch the actual latest community post
  useEffect(() => {
    const fetchLatestPost = async () => {
      if (!supabase) return;
      
      const { data, error } = await supabase
        .from('community_posts')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data && !error) {
        setLatestPost(data);
      }
    };

    fetchLatestPost();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 lg:pt-48 lg:pb-24 overflow-hidden">
        {/* Aesthetic Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        {/* Gradient Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-[120px] -z-10 mix-blend-multiply dark:mix-blend-screen animate-pulse"></div>
           <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-purple-500/10 dark:bg-purple-500/10 rounded-full blur-[120px] -z-10"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50/50 dark:bg-indigo-900/20 backdrop-blur-sm border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-300 text-sm font-bold mb-8 shadow-sm">
                <Sparkles size={14} className="text-indigo-500" /> 
                <span>Welcome to KnowtheAlgo</span>
              </div>
              
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-gray-900 dark:text-white mb-8 leading-[0.95]">
                {homeSettings.title}
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
                {homeSettings.subtitle}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a 
                  href="#curriculum"
                  className="group w-full sm:w-auto px-8 py-4 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-lg hover:bg-indigo-600 dark:hover:bg-indigo-50 transition-all duration-300 shadow-xl shadow-indigo-500/10 flex items-center justify-center gap-2"
                >
                  {homeSettings.cta_text} 
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Learning Paths Section (Formerly Curriculum) */}
      <section id="curriculum" className="py-16 bg-white dark:bg-gray-950 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold mb-3 uppercase tracking-wider text-xs">
                <BookOpen size={14} /> Structured Learning
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">
                Explore Learning Paths
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Choose a specialized track designed to take you from fundamentals to advanced engineering.
              </p>
            </motion.div>
          </div>

          {loading ? (
             <div className="flex justify-center py-20">
               <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
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
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2rem] blur opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                    <div className="h-full bg-gray-50 dark:bg-gray-900/50 rounded-[2rem] p-8 border border-gray-200 dark:border-gray-800 hover:border-indigo-500/30 dark:hover:border-indigo-500/30 transition-all duration-300 relative flex flex-col overflow-hidden hover:-translate-y-1">
                      
                      <div className="relative z-10 flex-1">
                        <div className="flex justify-between items-start mb-8">
                          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${subject.color} flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-300`}>
                            {iconMap[subject.icon] || <Code2 size={24} />}
                          </div>
                          <span className="px-3 py-1 rounded-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-xs font-bold uppercase tracking-wide text-gray-500">
                            {subject.level}
                          </span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {subject.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed line-clamp-3 text-sm">
                          {subject.description}
                        </p>
                      </div>
                      
                      <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between text-sm font-bold text-indigo-600 dark:text-indigo-400">
                        <span>Start Path</span>
                        <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center group-hover:translate-x-2 transition-transform">
                          <ChevronRight size={16} />
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

      {/* Community Section (Automated) */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto bg-white dark:bg-gray-950 rounded-[3rem] p-8 md:p-12 relative overflow-hidden text-center md:text-left shadow-2xl border border-gray-200 dark:border-gray-800">
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-xs font-bold mb-6">
                  <Users size={14} /> 
                  <span>Join the Discussion</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
                  {homeSettings.community_title}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-lg leading-relaxed">
                  {homeSettings.community_desc}
                </p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <Link 
                    to="/community" 
                    className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-bold hover:opacity-90 transition-opacity flex items-center gap-2"
                  >
                    <MessageSquare size={18} /> Visit Community
                  </Link>
                </div>
              </div>

              <div className="flex-1 w-full max-w-md">
                {latestPost ? (
                  <Link to={`/community/${latestPost.id}`} className="block">
                    <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-8 transform rotate-3 hover:rotate-0 transition-all duration-500 border border-gray-200 dark:border-gray-800 shadow-lg group">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                          {latestPost.author_name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-gray-900 dark:text-white font-bold text-sm">{latestPost.author_name}</div>
                          <div className="text-gray-500 text-xs">
                            {new Date(latestPost.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <Quote size={20} className="ml-auto text-indigo-200 dark:text-indigo-900" />
                      </div>
                      <h4 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                        {latestPost.title}
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
                        "{latestPost.content.substring(0, 120)}..."
                      </p>
                      <div className="flex gap-2">
                        <span className="px-2 py-1 rounded-md bg-indigo-100 dark:bg-indigo-900/30 text-xs text-indigo-600 dark:text-indigo-400 font-bold">
                          #{latestPost.category}
                        </span>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500 border border-gray-200 dark:border-gray-800 shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold">
                        JD
                      </div>
                      <div>
                        <div className="text-gray-900 dark:text-white font-bold text-sm">Jane Doe</div>
                        <div className="text-gray-500 text-xs">Just now</div>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4">
                      "Does anyone have a good resource for understanding Dynamic Programming? I'm stuck on the knapsack problem."
                    </p>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 rounded-md bg-indigo-100 dark:bg-indigo-900/30 text-xs text-indigo-600 dark:text-indigo-400">#algorithms</span>
                      <span className="px-2 py-1 rounded-md bg-indigo-100 dark:bg-indigo-900/30 text-xs text-indigo-600 dark:text-indigo-400">#help</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collaboration Section (Redesigned) */}
      <section className="py-20 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-gray-900 to-gray-800 dark:from-indigo-950 dark:to-gray-900 p-10 md:p-16 text-center shadow-2xl">
              {/* Decorative Background */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>

              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md text-white mb-8 border border-white/20 shadow-lg">
                  <Handshake size={32} />
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">
                  {homeSettings.collab_title}
                </h2>
                <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed max-w-2xl mx-auto">
                  {homeSettings.collab_desc}
                </p>
                <Link 
                  to="/collaborate" 
                  className="inline-flex items-center gap-2 px-10 py-4 bg-white text-gray-900 rounded-full font-bold hover:bg-indigo-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
                >
                  Let's Collaborate <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};
