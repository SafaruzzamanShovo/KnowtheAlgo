import React from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, BookOpen, Briefcase, AlertCircle, 
  TrendingUp, Users, FileText, CheckCircle2 
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardOverviewProps {
  stats: {
    posts: { total: number; pending: number; approved: number };
    curriculum: { subjects: number; modules: number; topics: number };
    portfolio: { total: number };
  };
  onChangeTab: (tab: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ stats, onChangeTab }) => {
  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">Welcome back, Admin</h2>
          <p className="text-indigo-100 max-w-xl">
            You have full control over the platform. 
            {stats.posts.pending > 0 
              ? ` There are ${stats.posts.pending} community posts waiting for your review.` 
              : " Everything is up to date."}
          </p>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 bg-white/10 skew-x-12 transform translate-x-12"></div>
        <div className="absolute bottom-0 right-12 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Pending Posts" 
          value={stats.posts.pending} 
          icon={AlertCircle} 
          color="amber"
          onClick={() => onChangeTab('community')}
          highlight={stats.posts.pending > 0}
        />
        <StatCard 
          title="Total Topics" 
          value={stats.curriculum.topics} 
          icon={BookOpen} 
          color="blue"
          onClick={() => onChangeTab('curriculum')}
        />
        <StatCard 
          title="Community Posts" 
          value={stats.posts.total} 
          icon={MessageSquare} 
          color="green"
          onClick={() => onChangeTab('community')}
        />
        <StatCard 
          title="Portfolio Items" 
          value={stats.portfolio.total} 
          icon={Briefcase} 
          color="purple"
          onClick={() => onChangeTab('portfolio')}
        />
      </div>

      {/* Action Center */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Actions */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-indigo-500" /> Activity & Actions
          </h3>
          
          <div className="space-y-3">
            {stats.posts.pending > 0 ? (
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/50 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 rounded-lg">
                    <MessageSquare size={18} />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">{stats.posts.pending} New Posts</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Community submissions need review</div>
                  </div>
                </div>
                <button 
                  onClick={() => onChangeTab('community')}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-lg transition-colors"
                >
                  Review
                </button>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                <CheckCircle2 size={32} className="mx-auto mb-2 text-green-500" />
                <p>All caught up! No pending actions.</p>
              </div>
            )}
          </div>
        </div>

        {/* Content Breakdown */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FileText size={20} className="text-indigo-500" /> Content Breakdown
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-gray-600 dark:text-gray-300">Curriculum Subjects</span>
              </div>
              <span className="font-bold text-gray-900 dark:text-white">{stats.curriculum.subjects}</span>
            </div>
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                <span className="text-gray-600 dark:text-gray-300">Learning Modules</span>
              </div>
              <span className="font-bold text-gray-900 dark:text-white">{stats.curriculum.modules}</span>
            </div>
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <span className="text-gray-600 dark:text-gray-300">Total Topics</span>
              </div>
              <span className="font-bold text-gray-900 dark:text-white">{stats.curriculum.topics}</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-800 h-px my-2"></div>
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-gray-600 dark:text-gray-300">Approved Posts</span>
              </div>
              <span className="font-bold text-gray-900 dark:text-white">{stats.posts.approved}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color, onClick, highlight }: any) => {
  const colors = {
    amber: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  };

  return (
    <motion.button 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`bg-white dark:bg-gray-900 p-6 rounded-2xl border text-left w-full transition-all ${
        highlight 
          ? 'border-amber-500/50 shadow-lg shadow-amber-500/10' 
          : 'border-gray-200 dark:border-gray-800 hover:border-indigo-500/30 hover:shadow-lg'
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${colors[color as keyof typeof colors]}`}>
          <Icon size={24} />
        </div>
        {highlight && <span className="flex h-3 w-3 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
        </span>}
      </div>
      <div className="text-3xl font-black text-gray-900 dark:text-white mb-1">{value}</div>
      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</div>
    </motion.button>
  );
};
