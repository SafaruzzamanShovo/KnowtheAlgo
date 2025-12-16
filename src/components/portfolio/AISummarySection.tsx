import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RefreshCw, Check, BrainCircuit } from 'lucide-react';
import { AboutSettings, PortfolioItem } from '../../types';
import { supabase } from '../../lib/supabase';

interface AISummarySectionProps {
  settings: AboutSettings;
  items: PortfolioItem[];
}

export const AISummarySection: React.FC<AISummarySectionProps> = ({ settings, items }) => {
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Simulate AI Generation based on props
  const generateSummary = () => {
    setLoading(true);
    
    // In a real app, this would call an Edge Function with OpenAI
    // Here we construct a smart template based on the data
    setTimeout(() => {
      const topSkills = settings.skills.slice(0, 5).join(', ');
      const projectCount = items.filter(i => i.section === 'project').length;
      const researchCount = items.filter(i => i.section === 'research').length;
      
      const generated = `Results-driven ${settings.role} with expertise in ${topSkills}. Proven track record of delivering ${projectCount} scalable engineering projects and contributing to ${researchCount} research initiatives. Specialized in distributed systems and AI infrastructure, with a focus on optimizing performance and reducing latency. Demonstrated leadership in academic and industry settings, consistently bridging the gap between theoretical computer science and practical application.`;
      
      setSummary(generated);
      setLoading(false);
      saveSummary(generated);
    }, 1500);
  };

  const saveSummary = async (text: string) => {
    if (!supabase) return;
    // Persist to site_settings
    await supabase.from('site_settings').upsert({
      key: 'ai_portfolio_summary',
      value: { text, updated_at: new Date().toISOString() }
    });
  };

  useEffect(() => {
    const fetchSaved = async () => {
      if (!supabase) {
        generateSummary();
        return;
      }
      const { data } = await supabase.from('site_settings').select('*').eq('key', 'ai_portfolio_summary').single();
      if (data?.value?.text) {
        setSummary(data.value.text);
      } else {
        generateSummary();
      }
    };
    fetchSaved();
  }, []);

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-12 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 border-y border-indigo-100 dark:border-indigo-900/30"
    >
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white dark:bg-gray-900 rounded-lg shadow-sm text-indigo-600">
              <BrainCircuit size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                AI Profile Summary
                <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold uppercase tracking-wide">
                  Recruiter Optimized
                </span>
              </h3>
              <p className="text-xs text-gray-500">Auto-generated from projects, research, and skills.</p>
            </div>
          </div>
          
          <button 
            onClick={generateSummary}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-white dark:hover:bg-gray-800 rounded-full transition-all"
            title="Regenerate Summary"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        <div className="relative bg-white dark:bg-gray-900 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 shadow-sm">
          {loading ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-3/4"></div>
              <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-full"></div>
              <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-5/6"></div>
            </div>
          ) : (
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg font-medium">
              {summary}
            </p>
          )}
          
          {/* Decorative Quote */}
          <div className="absolute -top-3 -left-2 text-6xl text-indigo-100 dark:text-indigo-900/20 font-serif leading-none select-none">“</div>
        </div>
      </div>
    </motion.section>
  );
};
