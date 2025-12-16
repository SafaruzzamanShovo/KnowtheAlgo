import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Cpu, Code, Database, Layout, Terminal, Globe, Server, Cloud, Layers } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SkillsSectionProps {
  skills: string[];
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  // Enhanced categorization with colors and icons
  const categories = [
    { 
      name: 'Languages', 
      icon: Terminal, 
      color: 'text-blue-500',
      gradient: 'from-blue-500/20 to-cyan-500/20',
      border: 'border-blue-200/50 dark:border-blue-800/50',
      items: skills.filter(s => ['JavaScript', 'TypeScript', 'Python', 'Go', 'Rust', 'C++', 'Java', 'Swift'].some(k => s.includes(k))) 
    },
    { 
      name: 'Frontend', 
      icon: Layout, 
      color: 'text-purple-500',
      gradient: 'from-purple-500/20 to-pink-500/20',
      border: 'border-purple-200/50 dark:border-purple-800/50',
      items: skills.filter(s => ['React', 'Vue', 'HTML', 'CSS', 'Tailwind', 'Next.js', 'Framer'].some(k => s.includes(k))) 
    },
    { 
      name: 'Backend & Data', 
      icon: Database, 
      color: 'text-emerald-500',
      gradient: 'from-emerald-500/20 to-teal-500/20',
      border: 'border-emerald-200/50 dark:border-emerald-800/50',
      items: skills.filter(s => ['Node', 'SQL', 'Mongo', 'Redis', 'Postgres', 'GraphQL', 'Prisma'].some(k => s.includes(k))) 
    },
    { 
      name: 'Infrastructure', 
      icon: Cloud, 
      color: 'text-orange-500',
      gradient: 'from-orange-500/20 to-red-500/20',
      border: 'border-orange-200/50 dark:border-orange-800/50',
      items: skills.filter(s => ['Docker', 'Kubernetes', 'AWS', 'Cloud', 'System Design', 'CI/CD', 'Linux'].some(k => s.includes(k))) 
    },
  ];

  // Fallback for uncategorized
  const categorized = new Set(categories.flatMap(c => c.items));
  const others = skills.filter(s => !categorized.has(s));
  if (others.length > 0) {
    categories.push({ 
      name: 'Tools & Others', 
      icon: Layers, 
      color: 'text-gray-500',
      gradient: 'from-gray-500/20 to-slate-500/20',
      border: 'border-gray-200/50 dark:border-gray-800/50',
      items: others 
    });
  }

  return (
    <section id="skills" className="py-24 bg-white dark:bg-gray-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <Cpu size={14} /> Expertise
          </div>
          <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">Technical Arsenal</h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            A curated stack of technologies I use to build scalable, high-performance systems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            cat.items.length > 0 && (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className={cn(
                  "group relative overflow-hidden rounded-3xl p-6 border transition-all duration-300 hover:shadow-2xl flex flex-col h-full bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm",
                  cat.border
                )}
              >
                {/* Gradient Background */}
                <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500", cat.gradient)} />

                {/* Header */}
                <div className="relative z-10 flex items-center justify-between mb-6">
                  <div className={cn("p-3 rounded-2xl bg-white dark:bg-gray-900 shadow-sm", cat.color)}>
                    <cat.icon size={24} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-40">
                    {cat.name}
                  </span>
                </div>

                {/* Skills List */}
                <div className="relative z-10 flex flex-wrap gap-2 mt-auto">
                  {cat.items.map(skill => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm group-hover:border-transparent transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            )
          ))}
        </div>
      </div>
    </section>
  );
};
