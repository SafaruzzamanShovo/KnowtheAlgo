import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, CheckCircle, XCircle, Clock, Database, UploadCloud, RefreshCw, Lock, LogOut, Mail, Key, Layout, Users, BookOpen, Briefcase } from 'lucide-react';
import { supabase, isSupabaseConnected } from '../lib/supabase';
import { CommunityPost } from '../types';
import { subjects as initialMockData, defaultCategories } from '../data/mockData';
import { portfolioMockItems } from '../data/portfolioMockData';
import { useCurriculum } from '../hooks/useCurriculum';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { usePortfolio } from '../hooks/usePortfolio';
import { CurriculumManager } from '../components/admin/CurriculumManager';
import { SiteEditor } from '../components/admin/SiteEditor';
import { CategoryManager } from '../components/admin/CategoryManager';
import { PortfolioManager } from '../components/admin/PortfolioManager';

const ADMIN_EMAIL = "shovofec@gmail.com";

export const Admin = () => {
  // Auth State
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authView, setAuthView] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authMessage, setAuthMessage] = useState<string | null>(null);

  // Dashboard State
  const [activeTab, setActiveTab] = useState<'pages' | 'portfolio' | 'community' | 'curriculum'>('pages');
  const [pendingPosts, setPendingPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  
  // Hooks
  const { subjects: dbSubjects, refresh: refreshCurriculum } = useCurriculum();
  const { homeSettings, aboutSettings, communitySettings, contributeSettings, categories, refresh: refreshSettings } = useSiteSettings();
  const { items: portfolioItems, refresh: refreshPortfolio } = usePortfolio();

  // Check Session on Mount
  useEffect(() => {
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setAuthLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });

      return () => subscription.unsubscribe();
    } else {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'community' && session?.user?.email === ADMIN_EMAIL) {
      fetchPendingPosts();
    }
  }, [activeTab, session]);

  // --- Auth Handlers (Login/Signup/Forgot) ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setLoading(true);
    if (!supabase) {
      if (email === ADMIN_EMAIL && password === 'admin123') setSession({ user: { email: ADMIN_EMAIL } });
      else setAuthError("Simulation Mode: Use shovofec@gmail.com / admin123");
      setLoading(false);
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthError(error.message);
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setLoading(true);
    if (!supabase) { setAuthError("Cannot sign up in simulation mode."); setLoading(false); return; }
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setAuthError(error.message);
    else { setAuthMessage("Account created! Check email."); setAuthView('login'); }
    setLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setLoading(true);
    if (!supabase) { setAuthError("Cannot reset in simulation."); setLoading(false); return; }
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + '/admin' });
    if (error) setAuthError(error.message);
    else { setAuthMessage("Reset link sent!"); setAuthView('login'); }
    setLoading(false);
  };

  const handleLogout = async () => { if (supabase) await supabase.auth.signOut(); setSession(null); };

  // --- Community Handlers ---
  const fetchPendingPosts = async () => {
    if (!supabase) return;
    const { data } = await supabase.from('community_posts').select('*').eq('status', 'pending');
    if (data) setPendingPosts(data);
  };

  const handleApprove = async (id: string) => {
    if (!supabase) return;
    const { error } = await supabase.from('community_posts').update({ status: 'approved' }).eq('id', id);
    if (!error) {
      setPendingPosts(prev => prev.filter(p => p.id !== id));
      setNotification({ type: 'success', message: 'Post approved!' });
    }
  };

  const handleReject = async (id: string) => {
    if (!supabase) return;
    const { error } = await supabase.from('community_posts').update({ status: 'rejected' }).eq('id', id);
    if (!error) {
      setPendingPosts(prev => prev.filter(p => p.id !== id));
      setNotification({ type: 'success', message: 'Post rejected.' });
    }
  };

  // --- Seeding Handler ---
  const handleSeedDatabase = async () => {
    if (!supabase || !isSupabaseConnected) {
      setNotification({ type: 'error', message: 'Supabase not connected.' });
      return;
    }
    if (!confirm("This will overwrite existing data with the default curriculum, categories, and portfolio items. Continue?")) return;
    setLoading(true);
    try {
      // 1. Upload Subjects
      for (const sub of initialMockData) {
        await supabase.from('subjects').upsert({
          id: sub.id,
          title: sub.title,
          description: sub.description,
          icon: sub.icon,
          color: sub.color,
          level: sub.level
        });
        // 2. Upload Modules
        for (const mod of sub.modules) {
          await supabase.from('modules').upsert({
            id: mod.id,
            title: mod.title,
            description: mod.description,
            subject_id: sub.id
          });
          // 3. Upload Topics
          for (const topic of mod.topics) {
            await supabase.from('topics').upsert({
              id: topic.id,
              title: topic.title,
              read_time: topic.readTime,
              content: topic.content,
              module_id: mod.id
            });
          }
        }
      }

      // 4. Upload Categories
      for (const cat of defaultCategories) {
        await supabase.from('categories').upsert(cat);
      }

      // 5. Upload Portfolio Items
      for (const item of portfolioMockItems) {
        await supabase.from('portfolio_items').upsert(item);
      }

      setNotification({ type: 'success', message: 'Database successfully seeded!' });
      refreshCurriculum();
      refreshSettings();
      refreshPortfolio();
    } catch (err) {
      console.error(err);
      setNotification({ type: 'error', message: 'Failed to seed database.' });
    } finally {
      setLoading(false);
    }
  };

  // --- Render ---
  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div></div>;

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="text-indigo-600 dark:text-indigo-400" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Access</h1>
          </div>
          {authError && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm flex items-center gap-2"><AlertCircle size={16} /> {authError}</div>}
          {authMessage && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm flex items-center gap-2"><CheckCircle size={16} /> {authMessage}</div>}
          
          <form onSubmit={authView === 'login' ? handleLogin : authView === 'signup' ? handleSignUp : handleForgotPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800" required />
            </div>
            {authView !== 'forgot' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800" required />
              </div>
            )}
            <button type="submit" disabled={loading} className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors">
              {loading ? 'Loading...' : authView === 'login' ? 'Login' : authView === 'signup' ? 'Sign Up' : 'Send Reset Link'}
            </button>
          </form>
          <div className="mt-6 text-center text-sm">
            {authView === 'login' && <><button onClick={() => setAuthView('forgot')} className="text-indigo-600 hover:underline">Forgot Password?</button><div className="mt-2 text-gray-400">First time? <button onClick={() => setAuthView('signup')} className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 font-medium">Create Account</button></div></>}
            {authView !== 'login' && <button onClick={() => setAuthView('login')} className="text-gray-600 dark:text-gray-300 hover:text-indigo-600">Back to Login</button>}
          </div>
        </div>
      </div>
    );
  }

  if (session.user.email !== ADMIN_EMAIL) return <div className="min-h-screen flex items-center justify-center">Access Denied</div>;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-950 py-12 pt-24">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Welcome back, {session.user.email}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex bg-white dark:bg-gray-900 rounded-lg p-1 border border-gray-200 dark:border-gray-800 overflow-x-auto">
              <button onClick={() => setActiveTab('pages')} className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 whitespace-nowrap ${activeTab === 'pages' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' : 'text-gray-600 dark:text-gray-400'}`}>
                <Layout size={16} /> Site Editor
              </button>
              <button onClick={() => setActiveTab('portfolio')} className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 whitespace-nowrap ${activeTab === 'portfolio' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' : 'text-gray-600 dark:text-gray-400'}`}>
                <Briefcase size={16} /> Portfolio
              </button>
              <button onClick={() => setActiveTab('community')} className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 whitespace-nowrap ${activeTab === 'community' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' : 'text-gray-600 dark:text-gray-400'}`}>
                <Users size={16} /> Community
              </button>
              <button onClick={() => setActiveTab('curriculum')} className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 whitespace-nowrap ${activeTab === 'curriculum' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' : 'text-gray-600 dark:text-gray-400'}`}>
                <BookOpen size={16} /> Curriculum
              </button>
            </div>
            <button onClick={handleLogout} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><LogOut size={20} /></button>
          </div>
        </div>

        {notification && <div className="mb-6 p-4 rounded-lg bg-green-50 text-green-700 border border-green-200 flex items-center gap-2"><CheckCircle size={18} /> {notification.message}</div>}

        {/* TAB 1: SITE EDITOR */}
        {activeTab === 'pages' && (
          <SiteEditor 
            initialHome={homeSettings} 
            initialAbout={aboutSettings} 
            initialCommunity={communitySettings}
            initialContribute={contributeSettings}
            onRefresh={refreshSettings} 
          />
        )}

        {/* TAB 2: PORTFOLIO MANAGER */}
        {activeTab === 'portfolio' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Database size={18} />
                <span className="font-medium">Quick Actions</span>
              </div>
              <button 
                onClick={handleSeedDatabase}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2"
              >
                <UploadCloud size={16} /> Seed Demo Data
              </button>
            </div>
            <PortfolioManager items={portfolioItems} onRefresh={refreshPortfolio} />
          </div>
        )}

        {/* TAB 3: COMMUNITY MANAGER */}
        {activeTab === 'community' && (
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <CategoryManager categories={categories} onRefresh={refreshSettings} />
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Pending Approvals</h3>
              {pendingPosts.length === 0 ? (
                <div className="text-center py-8 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-500">No pending posts.</div>
              ) : (
                <div className="space-y-4">
                  {pendingPosts.map(post => (
                    <div key={post.id} className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 flex justify-between items-center">
                      <div>
                        <h4 className="font-bold">{post.title}</h4>
                        <p className="text-sm text-gray-500">By {post.author_name} • {post.category}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleApprove(post.id)} className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm">Approve</button>
                        <button onClick={() => handleReject(post.id)} className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm">Reject</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: CURRICULUM */}
        {activeTab === 'curriculum' && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
              <h2 className="text-lg font-bold">Manage Courses</h2>
              <div className="flex items-center gap-2">
                 <button 
                  onClick={handleSeedDatabase}
                  className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
                  title="Reset/Fill Database with Default Data"
                >
                  <Database size={16} /> Seed DB
                </button>
                <button onClick={refreshCurriculum} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"><RefreshCw size={16} /></button>
              </div>
            </div>
            <div className="p-6">
              <CurriculumManager subjects={dbSubjects} onRefresh={refreshCurriculum} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
