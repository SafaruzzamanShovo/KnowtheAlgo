import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Menu, ArrowLeft, Clock, ChevronDown, ChevronUp, CheckCircle2, X, User, Mail } from 'lucide-react';
import { useCurriculum } from '../hooks/useCurriculum';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { CodeBlockEnhanced } from '../components/reading/CodeBlockEnhanced';
import { Callout } from '../components/reading/Callout';
import { ScrollProgress } from '../components/reading/ScrollProgress';
import { ReadingToolbar } from '../components/reading/ReadingToolbar';
import { TableOfContents } from '../components/reading/TableOfContents';
import { Paragraph } from '../components/reading/Paragraph';
import { SmartImage } from '../components/reading/SmartImage';
import { SectionDivider } from '../components/reading/SectionDivider';
import { EndReader } from '../components/reading/EndReader';
import { ReadingPreferencesProvider, useReadingPreferences } from '../context/ReadingPreferences';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import DOMPurify from 'dompurify';

// Wrapper to provide context
export const Documentation = () => (
  <ReadingPreferencesProvider>
    <DocumentationContent />
  </ReadingPreferencesProvider>
);

const DocumentationContent = () => {
  const { subjectId, topicId } = useParams();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({});
  
  // Context
  const { fontSize, lineHeight, focusMode } = useReadingPreferences();

  const { subjects, loading } = useCurriculum();
  const { aboutSettings } = useSiteSettings(); // Fetch admin/author info

  const subject = subjects.find(s => s.id === subjectId);
  const currentModule = subject?.modules?.find(m => m.topics.some(t => t.id === topicId));
  const currentTopic = currentModule?.topics?.find(t => t.id === topicId);

  // Find next topic for the "EndReader" component
  const allTopics = subject?.modules.flatMap(m => m.topics) || [];
  const currentIndex = allTopics.findIndex(t => t.id === topicId);
  const nextTopic = currentIndex !== -1 && currentIndex < allTopics.length - 1 ? {
    id: allTopics[currentIndex + 1].id,
    title: allTopics[currentIndex + 1].title,
    subjectId: subject?.id || ''
  } : undefined;

  // Auto-open module
  useEffect(() => {
    if (currentModule) {
      setOpenModules(prev => ({ ...prev, [currentModule.id]: true }));
    }
  }, [currentModule?.id]);

  // Redirect logic
  useEffect(() => {
    if (!loading && subject) {
      const hasModules = subject.modules && subject.modules.length > 0;
      if (hasModules) {
        const firstModule = subject.modules[0];
        const hasTopics = firstModule.topics && firstModule.topics.length > 0;
        if (hasTopics) {
          const firstTopicId = firstModule.topics[0].id;
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

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full"></div></div>;
  if (!subject) return <div className="min-h-screen flex items-center justify-center">Subject Not Found</div>;
  if (!currentTopic && topicId) return null;

  const isRichContent = typeof currentTopic?.content === 'string';

  return (
    <div className={`flex min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300 ${focusMode ? 'pt-0' : 'pt-16'}`}>
      <ScrollProgress />
      <ReadingToolbar />

      {/* Mobile Sidebar Toggle */}
      {!focusMode && (
        <div className="lg:hidden fixed bottom-6 right-6 z-50">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-4 bg-indigo-600 text-white rounded-full shadow-xl hover:bg-indigo-700 transition-colors"
          >
            {isSidebarOpen ? <X /> : <Menu />}
          </button>
        </div>
      )}

      {/* Sidebar Navigation */}
      <AnimatePresence>
        {(!focusMode && isSidebarOpen) && (
          <motion.aside 
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={cn(
              "fixed lg:sticky top-16 h-[calc(100vh-4rem)] w-80 bg-gray-50/90 dark:bg-gray-900/90 backdrop-blur-xl border-r border-gray-200 dark:border-gray-800 overflow-y-auto z-40",
              "lg:translate-x-0"
            )}
          >
            <div className="p-6 pb-20 lg:pb-6">
              <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600 mb-8 transition-colors group">
                <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Bootcamp
              </Link>
              
              <div className="mb-8">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${subject.color} mb-4 shadow-lg`}></div>
                <h2 className="font-bold text-gray-900 dark:text-white text-xl leading-tight">{subject.title}</h2>
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
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className={cn(
        "flex-1 min-w-0 flex flex-col xl:flex-row transition-all duration-500",
        focusMode ? "max-w-5xl mx-auto pt-12" : ""
      )}>
        
        <div className="flex-1 px-6 py-10 lg:px-16 lg:py-12 w-full max-w-4xl mx-auto">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center text-sm text-gray-500 mb-8 overflow-x-auto whitespace-nowrap pb-2 scrollbar-none">
            <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
            <ChevronRight size={14} className="mx-2 flex-shrink-0" />
            <span className="font-medium text-gray-900 dark:text-white">{subject.title}</span>
            <ChevronRight size={14} className="mx-2 flex-shrink-0" />
            <span className="font-medium text-indigo-600 dark:text-indigo-400">{currentTopic?.title}</span>
          </nav>

          <article className="max-w-none">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-10 pb-8 border-b border-gray-100 dark:border-gray-800"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wide">
                  {currentModule?.title}
                </span>
              </div>
              <h1 className="font-extrabold text-4xl md:text-5xl text-gray-900 dark:text-white mb-6 leading-tight tracking-tight">
                {currentTopic?.title}
              </h1>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                {/* Author Info (Admin) */}
                <div className="flex items-center gap-3">
                  {aboutSettings.image ? (
                    <img src={aboutSettings.image} alt={aboutSettings.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-800" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500">
                      <User size={14} />
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900 dark:text-white leading-none mb-0.5">{aboutSettings.name}</span>
                    {aboutSettings.socials?.email && (
                      <a href={aboutSettings.socials.email} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                        <Mail size={10} /> {aboutSettings.socials.email.replace('mailto:', '')}
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500 font-medium bg-gray-50 dark:bg-gray-900 px-3 py-1.5 rounded-full">
                  <Clock size={16} className="text-indigo-500" />
                  <span>{currentTopic?.readTime || "5 min"} read</span>
                </div>
              </div>
            </motion.div>

            <div className="space-y-2">
              {isRichContent ? (
                 <div className={`prose prose-indigo dark:prose-invert max-w-none prose-${fontSize} leading-${lineHeight}`}>
                    <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(currentTopic?.content as string) }} />
                 </div>
              ) : (
                (currentTopic?.content as any[])?.map((block, idx) => (
                  <ContentBlockRenderer key={idx} block={block} index={idx} />
                ))
              )}
            </div>
            
            <EndReader nextTopic={nextTopic} />
          </article>
        </div>

        {/* Right Sidebar - TOC */}
        <TableOfContents content={currentTopic?.content} isRichContent={isRichContent} />
      </main>
    </div>
  );
};

const ContentBlockRenderer = ({ block, index }: { block: any, index: number }) => {
  const Component = () => {
    switch (block.type) {
      case 'heading':
        return (
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-16 mb-8 flex items-center gap-3 scroll-mt-24" id={`heading-${index}`}>
            <span className="w-1.5 h-8 bg-indigo-500 rounded-full"></span>
            {block.value}
          </h2>
        );
      case 'code':
        return <CodeBlockEnhanced code={block.value} language={block.language} explanation={block.explanation} />;
      case 'note':
        return <Callout type="note">{block.value}</Callout>;
      case 'image':
        return <SmartImage src={block.value} alt="Topic Image" caption={block.caption} />;
      case 'divider':
        return <SectionDivider />;
      default:
        // Text blocks are now Paragraphs
        return <Paragraph id={`p-${index}`}>{block.value}</Paragraph>;
    }
  };

  return <Component />;
};
