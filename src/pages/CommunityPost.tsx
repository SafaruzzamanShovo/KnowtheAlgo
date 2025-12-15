import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { CommunityPost as ICommunityPost } from '../types';
import { ArrowLeft, User, Calendar, Mail } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from '../components/CodeBlock';
import DOMPurify from 'dompurify';

export const CommunityPost = () => {
  const { postId } = useParams();
  const [post, setPost] = useState<ICommunityPost | null>(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link to="/community" className="inline-flex items-center text-gray-500 hover:text-indigo-600 mb-8 transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Back to Community
        </Link>

        <article>
          <header className="mb-10 text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-bold uppercase tracking-wide">
                {post.category}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
              {post.title}
            </h1>
            
            {/* Author Info */}
            <div className="flex items-center justify-center gap-6">
               <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900 px-4 py-2 rounded-full border border-gray-100 dark:border-gray-800">
                  {post.author_avatar ? (
                    <img src={post.author_avatar} alt={post.author_name} className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <User size={16} />
                    </div>
                  )}
                  <div className="text-left">
                    <div className="text-sm font-bold text-gray-900 dark:text-white leading-none">{post.author_name}</div>
                    <div className="text-xs text-gray-500">{new Date(post.created_at).toLocaleDateString()}</div>
                  </div>
               </div>

               {post.author_email && (
                 <a href={`mailto:${post.author_email}`} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-600 transition-colors" title="Contact Author">
                   <Mail size={18} />
                 </a>
               )}
            </div>
          </header>

          <div className="prose prose-lg prose-indigo dark:prose-invert max-w-none">
            {isHtml ? (
              <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }} />
            ) : (
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  code({node, inline, className, children, ...props}: any) {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                      <CodeBlock code={String(children).replace(/\n$/, '')} language={match[1]} />
                    ) : (
                      <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono text-indigo-600 dark:text-indigo-400" {...props}>
                        {children}
                      </code>
                    )
                  }
                }}
              >
                {post.content}
              </ReactMarkdown>
            )}
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <span key={tag} className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};
