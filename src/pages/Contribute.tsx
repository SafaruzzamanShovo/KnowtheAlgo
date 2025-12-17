import React, { useState, useEffect } from 'react';
import { Send, FileText, Layout } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { DualModeEditor } from '../components/DualModeEditor';

export const Contribute = () => {
  const { contributeSettings, categories } = useSiteSettings();
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    author: '',
    email: '',
    avatar: '',
    content: '',
    tags: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Set default subject when categories load
  useEffect(() => {
    if (categories.length > 0 && !formData.subject) {
      setFormData(prev => ({ ...prev, subject: categories[0].title }));
    }
  }, [categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.content || formData.content === '<p></p>') {
      alert('Please write some content for your post.');
      setLoading(false);
      return;
    }

    try {
      if (supabase) {
        const { error } = await supabase.from('community_posts').insert([
          {
            title: formData.title,
            category: formData.subject || 'General',
            author_name: formData.author,
            author_email: formData.email,
            author_avatar: formData.avatar,
            content: formData.content,
            tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
            status: 'pending'
          }
        ]);
        if (error) throw error;
      }
      setTimeout(() => {
        setSubmitted(true);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4 pt-20">
        <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 shadow-xl text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Send className="text-green-600 dark:text-green-400" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Submission Received!</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Thanks for contributing. Your post has been sent to the admin for review. Once approved, it will appear in the Community section.
          </p>
          <div className="flex gap-3 justify-center">
            <Link to="/community" className="px-6 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              View Community
            </Link>
            <button onClick={() => { setSubmitted(false); setFormData({...formData, title: '', content: ''}); }} className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
              Submit Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-950 py-12 pt-24">
      {/* Increased max-width to 6xl to give the editor more room (Page View) */}
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{contributeSettings.title}</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {contributeSettings.subtitle}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Metadata Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Post Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none text-lg font-medium"
                    placeholder="e.g., A Deep Dive into Distributed Caching"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.title}>{cat.title}</option>
                      ))}
                      {!categories.length && <option value="General">General</option>}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({...formData, tags: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="react, tutorial, system-design"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700 h-fit">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Layout size={16} /> Author Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Name</label>
                    <input
                      type="text"
                      required
                      value={formData.author}
                      onChange={(e) => setFormData({...formData, author: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Avatar URL</label>
                    <input
                      type="text"
                      value={formData.avatar}
                      onChange={(e) => setFormData({...formData, avatar: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Editor Section */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <FileText size={18} /> Content
              </label>
              <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-inner bg-gray-100 dark:bg-gray-950/50">
                <DualModeEditor 
                  content={formData.content} 
                  onChange={(html) => setFormData({...formData, content: typeof html === 'string' ? html : ''})} 
                  minHeight="500px" // Taller editor for better writing experience
                />
              </div>
              <p className="mt-2 text-xs text-gray-500 flex justify-between">
                <span>Supports Markdown shortcuts, drag & drop images, and code blocks.</span>
                <span>Auto-expands as you type.</span>
              </p>
            </div>

            <div className="pt-6 border-t border-gray-200 dark:border-gray-800 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transform hover:-translate-y-0.5"
              >
                {loading ? 'Submitting...' : 'Submit for Review'} <Send size={18} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
