import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { CommunityPost as ICommunityPost } from '../types';
import { ArrowLeft, User, Mail, MessageSquare, ThumbsUp, Share2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlockEnhanced } from '../components/reading/CodeBlockEnhanced';
import { ScrollProgress } from '../components/reading/ScrollProgress';
import { ReadingToolbar } from '../components/reading/ReadingToolbar';
import { Paragraph } from '../components/reading/Paragraph';
import { SmartImage } from '../components/reading/SmartImage';
import { SectionDivider } from '../components/reading/SectionDivider';
import { ReadingPreferencesProvider, useReadingPreferences } from '../context/ReadingPreferences';
import { motion } from 'framer-motion';
import DOMPurify from 'dompurify';
import { cn } from '../lib/utils';

export const CommunityPost = () => (
  <ReadingPreferencesProvider>
    <CommunityPostContent />
  </ReadingPreferencesProvider>
);

const CommunityPostContent = () => {
  const { postId } = useParams();
  const [post, setPost] = useState<ICommunityPost | null>(null);
  const [loading, setLoading] = useState(true);
  const { fontSize, lineHeight } = useReadingPreferences();

  useEffect(() => {
    if (postId) fetchPost(postId);
  }, [postId]);

  const fetchPost = async (id: string) => {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('community_posts')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        setPost(data);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full"></div></div>;
  if (!post) return <div className="min-h-screen flex items-center justify-center text-xl">Post not found</div>;

  const isHtml = post.content.trim().startsWith('<');

  // Map preferences to valid Tailwind classes
  const proseSize = fontSize === 'base' ? '' : `prose-${fontSize}`;
  const leadingClass = `leading-${lineHeight}`;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-24 pb-20 transition-colors duration-300">
      <ScrollProgress />
      <ReadingToolbar />

      <div className="container mx-auto px-4 max-w-3xl">
        <Link to="/community" className="inline-flex items-center text-gray-500 hover:text-indigo-600 mb-8 transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Back to Community
        </Link>

        <article>
          <motion.header 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-bold uppercase tracking-wide">
                {post.category}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-8 leading-tight">
              {post.title}
            </h1>
            
            {/* Author Info */}
            <div className="flex items-center justify-center">
               <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-900/50 px-5 py-3 rounded-2xl border border-gray-100 dark:border-gray-800">
                  {post.author_avatar ? (
                    <img src={post.author_avatar} alt={post.author_name} className="w-10 h-10 rounded-full object-cover ring-2 ring-white dark:ring-gray-800" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 ring-2 ring-white dark:ring-gray-800">
                      <User size={18} />
                    </div>
                  )}
                  <div className="text-left">
                    <div className="text-sm font-bold text-gray-900 dark:text-white leading-tight mb-0.5">{post.author_name}</div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>{new Date(post.created_at).toLocaleDateString()}</span>
                      {post.author_email && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                          <a 
                            href={`mailto:${post.author_email}`}
                            className="flex items-center gap-1 hover:text-indigo-600 transition-colors"
                          >
                            <Mail size={10} />
                            {post.author_email}
                          </a>
                        </>
                      )}
                    </div>
                  </div>
               </div>
            </div>
          </motion.header>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-none"
          >
            {isHtml ? (
               <div className={cn(
                 "prose prose-indigo dark:prose-invert max-w-none",
                 proseSize,
                 leadingClass,
                 // Force paragraph spacing if leading is loose
                 lineHeight === 'loose' && "[&_p]:mb-8",
                 lineHeight === 'relaxed' && "[&_p]:mb-6",
                 // Ensure direct children inherit leading
                 "[&_*]:leading-inherit"
               )}>
                 <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }} />
               </div>
            ) : (
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  code({node, inline, className, children, ...props}: any) {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                      <CodeBlockEnhanced code={String(children).replace(/\n$/, '')} language={match[1]} />
                    ) : (
                      <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono text-indigo-600 dark:text-indigo-400" {...props}>
                        {children}
                      </code>
                    )
                  },
                  h1: ({node, ...props}) => <h1 className="text-3xl font-bold mt-12 mb-6" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-12 mb-6 border-b border-gray-100 dark:border-gray-800 pb-2 flex items-center gap-3" {...props}><span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>{props.children}</h2>,
                  blockquote: ({node, ...props}) => <div className="border-l-4 border-indigo-500 pl-4 py-2 my-6 bg-gray-50 dark:bg-gray-900/50 italic text-gray-600 dark:text-gray-300 rounded-r-lg" {...props} />,
                  p: ({node, ...props}) => <Paragraph {...props} />,
                  img: ({node, ...props}) => <SmartImage src={props.src || ''} alt={props.alt || ''} caption={props.title} />,
                  hr: ({node, ...props}) => <SectionDivider />
                }}
              >
                {post.content}
              </ReactMarkdown>
            )}
          </motion.div>

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-center mb-6">
              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-4">
                 <button className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors">
                   <ThumbsUp size={18} /> <span className="text-sm font-bold">Like</span>
                 </button>
                 <button className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors">
                   <Share2 size={18} /> <span className="text-sm font-bold">Share</span>
                 </button>
              </div>
            </div>
            
            {/* Mock Comments Section */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <MessageSquare size={18} /> Discussion
              </h3>
              <div className="text-center py-8 text-gray-500">
                <p>No comments yet. Be the first to start the conversation!</p>
                <button className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold text-sm hover:bg-indigo-700">
                  Post a Comment
                </button>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};
