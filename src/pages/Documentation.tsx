import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Menu, ArrowLeft, Clock, ChevronDown, ChevronUp, BookOpen, CheckCircle2 } from 'lucide-react';
import { useCurriculum } from '../hooks/useCurriculum';
import { CodeBlock } from '../components/CodeBlock';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export const Documentation = () => {
  const { subjectId, topicId } = useParams();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({});

  // Use dynamic data hook
  const { subjects, loading } = useCurriculum();

  const subject = subjects.find(s => s.id === subjectId);

  // Safely find current topic and module with optional chaining
  const currentModule = subject?.modules?.find(m => m.topics.some(t => t.id === topicId));
  const currentTopic = currentModule?.topics?.find(t => t.id === topicId);

  // Auto-open the module containing the current topic
  useEffect(() => {
    if (currentModule) {
      setOpenModules(prev => ({ ...prev, [currentModule.id]: true }));
    }
  }, [currentModule?.id]);

  // Robust Redirect Logic
  useEffect(() => {
    if (!loading && subject) {
      const hasModules = subject.modules && subject.modules.length > 0;
      if (hasModules) {
        const firstModule = subject.modules[0];
        const hasTopics = firstModule.topics && firstModule.topics.length > 0;
        
        if (hasTopics) {
          const firstTopicId = firstModule.topics[0].id;
          
          // If no topicId provided, OR if provided topicId is not found in any module
          const isTopicValid = subject.modules.some(m => m.topics.some(t => t.id === topicId));
          
          if (!topicId || !isTopicValid) {
            navigate(`/learn/${subject.id}/${firstTopicId}`, { replace: true });
          }
        }
      }
    }
  }, [subject, topicId, navigate, loading]);

  const toggleModule = (moduleId: string) => {
    setOpenModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!subject) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-950">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Subject Not Found</h2>
      <Link to="/" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Go Home</Link>
    </div>
  );

  // Loading state while redirecting
  if (!currentTopic && topicId) return null; 

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-950 pt-16">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-4 bg-indigo-600 text-white rounded-full shadow-xl hover:bg-indigo-700 transition-colors"
        >
          {isSidebarOpen ? <ChevronRight /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside 
        className={cn(
          "fixed lg:sticky top-16 h-[calc(100vh-4rem)] w-80 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-gray-200 dark:border-gray-800 overflow-y-auto transition-transform duration-300 z-40",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="p-6 pb-20 lg:pb-6">
          <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600 mb-8 transition-colors group">
            <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Bootcamp
          </Link>
          
          <div className="mb-8">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${subject.color} mb-4 shadow-lg`}></div>
            <h2 className="font-bold text-gray-900 dark:text-white text-xl leading-tight">{subject.title}</h2>
            <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-2 uppercase tracking-wider">Course Curriculum</p>
          </div>

          <div className="space-y-2">
            {subject.modules.map((module, index) => (
              <div key={module.id} className="select-none">
                <button 
                  onClick={() => toggleModule(module.id)}
                  className="flex items-center justify-between w-full text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-800 text-xs font-bold text-gray-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                      {index + 1}
                    </span>
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {module.title}
                    </span>
                  </div>
                  {openModules[module.id] ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
                </button>
                
                <AnimatePresence>
                  {openModules[module.id] && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-4 pt-1 pb-2 space-y-1 border-l-2 border-gray-100 dark:border-gray-800 ml-6 mt-1">
                        {module.topics.map((topic) => (
                          <Link
                            key={topic.id}
                            to={`/learn/${subject.id}/${topic.id}`}
                            className={cn(
                              "flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-all relative group/link",
                              topicId === topic.id 
                                ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 font-medium" 
                                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                            )}
                            onClick={() => window.innerWidth < 1024 && setIsSidebarOpen(false)}
                          >
                            {topicId === topic.id && (
                              <motion.div 
                                layoutId="activeIndicator"
                                className="absolute left-0 w-0.5 h-full bg-indigo-600 rounded-full" 
                              />
                            )}
                            <span className="truncate">{topic.title}</span>
                            {topicId === topic.id && <CheckCircle2 size={14} className="ml-auto flex-shrink-0" />}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col xl:flex-row">
        
        {/* Article Content */}
        <div className="flex-1 max-w-4xl px-6 py-10 lg:px-16 lg:py-12 mx-auto w-full">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center text-sm text-gray-500 mb-8 overflow-x-auto whitespace-nowrap pb-2 scrollbar-none">
            <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
            <ChevronRight size={14} className="mx-2 flex-shrink-0" />
            <span className="font-medium text-gray-900 dark:text-white">{subject.title}</span>
            <ChevronRight size={14} className="mx-2 flex-shrink-0" />
            <span className="font-medium text-indigo-600 dark:text-indigo-400">{currentTopic?.title}</span>
          </nav>

          <article className="prose prose-lg prose-indigo dark:prose-invert max-w-none">
            <div className="mb-10 pb-8 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wide">
                  {currentModule?.title}
                </span>
              </div>
              <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
                {currentTopic?.title}
              </h1>
              <div className="flex items-center gap-6 text-sm text-gray-500 font-medium">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-indigo-500" />
                  <span>{currentTopic?.readTime || "5 min"} read</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen size={16} className="text-indigo-500" />
                  <span>Topic {subject.modules.flatMap(m => m.topics).findIndex(t => t.id === topicId) + 1} of {subject.modules.flatMap(m => m.topics).length}</span>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {currentTopic?.content.map((block, idx) => {
                if (block.type === 'heading') {
                  return (
                    <h2 key={idx} className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-6 first:mt-0 scroll-mt-24 flex items-center gap-3" id={`heading-${idx}`}>
                      <span className="w-1.5 h-8 bg-indigo-500 rounded-full"></span>
                      {block.value}
                    </h2>
                  );
                }
                if (block.type === 'code') {
                  return <CodeBlock key={idx} code={block.value} language={block.language} />;
                }
                if (block.type === 'note') {
                  return (
                    <div key={idx} className="bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-500 p-6 rounded-r-xl my-8">
                      <p className="text-amber-900 dark:text-amber-100 font-medium m-0">{block.value}</p>
                    </div>
                  );
                }
                return (
                  <p key={idx} className="text-gray-600 dark:text-gray-300 leading-8 text-lg">
                    {block.value}
                  </p>
                );
              })}
            </div>
          </article>

          {/* Navigation Footer */}
          <div className="mt-20 pt-10 border-t border-gray-200 dark:border-gray-800 flex justify-between gap-4">
            <button 
              onClick={() => {
                const allTopics = subject.modules.flatMap(m => m.topics);
                const currentIndex = allTopics.findIndex(t => t.id === topicId);
                if (currentIndex > 0) {
                  navigate(`/learn/${subject.id}/${allTopics[currentIndex - 1].id}`);
                }
              }}
              className="group flex-1 max-w-xs text-left p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all"
            >
              <div className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 group-hover:text-indigo-600 transition-colors">
                <ArrowLeft size={14} className="mr-2" /> Previous
              </div>
              <div className="font-bold text-gray-900 dark:text-white truncate">
                Previous Topic
              </div>
            </button>

            <button 
              onClick={() => {
                const allTopics = subject.modules.flatMap(m => m.topics);
                const currentIndex = allTopics.findIndex(t => t.id === topicId);
                if (currentIndex < allTopics.length - 1) {
                  navigate(`/learn/${subject.id}/${allTopics[currentIndex + 1].id}`);
                }
              }}
              className="group flex-1 max-w-xs text-right p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all"
            >
              <div className="flex items-center justify-end text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 group-hover:text-indigo-600 transition-colors">
                Next <ChevronRight size={14} className="ml-2" />
              </div>
              <div className="font-bold text-gray-900 dark:text-white truncate">
                Next Topic
              </div>
            </button>
          </div>
        </div>

        {/* Right Sidebar - TOC */}
        <aside className="hidden xl:block w-80 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-8">
          <div className="mb-8">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">On this page</h3>
            <ul className="space-y-3">
              {currentTopic?.content
                .filter(b => b.type === 'heading')
                .map((h, idx) => (
                  <li key={idx}>
                    <a 
                      href={`#heading-${idx}`} 
                      className="block text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors pl-3 border-l-2 border-transparent hover:border-indigo-600 py-1"
                    >
                      {h.value}
                    </a>
                  </li>
                ))}
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
            <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-2">Have a question?</h4>
            <p className="text-xs text-gray-500 mb-4">Join our community discord to discuss this topic with others.</p>
            <button className="w-full py-2 text-xs font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              Join Community
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
};
