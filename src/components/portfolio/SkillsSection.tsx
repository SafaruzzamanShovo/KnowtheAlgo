import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Cpu, Code, Database, Layout } from 'lucide-react';

interface SkillsSectionProps {
  skills: string[];
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  // Simple categorization logic for demo purposes
  const categories = [
    { name: 'Languages', icon: Code, items: skills.filter(s => ['JavaScript', 'TypeScript', 'Python', 'Go', 'Rust', 'C++', 'Java'].some(k => s.includes(k))) },
    { name: 'Frontend', icon: Layout, items: skills.filter(s => ['React', 'Vue', 'HTML', 'CSS', 'Tailwind', 'Next.js'].some(k => s.includes(k))) },
    { name: 'Backend & Data', icon: Database, items: skills.filter(s => ['Node', 'SQL', 'Mongo', 'Redis', 'Postgres', 'GraphQL'].some(k => s.includes(k))) },
    { name: 'Infrastructure', icon: Cpu, items: skills.filter(s => ['Docker', 'Kubernetes', 'AWS', 'Cloud', 'System Design'].some(k => s.includes(k))) },
  ];

  // Fallback for uncategorized
  const categorized = new Set(categories.flatMap(c => c.items));
  const others = skills.filter(s => !categorized.has(s));
  if (others.length > 0) {
    categories.push({ name: 'Other Skills', icon: Zap, items: others });
  }

  return (
    <section id="skills" className="py-24 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4">Technical Arsenal</h2>
          <p className="text-gray-500 dark:text-gray-400">Tools and technologies I work with.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat, idx) => (
            cat.items.length > 0 && (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800"
              >
                <div className="flex items-center gap-2 mb-6 text-indigo-600 dark:text-indigo-400 font-bold">
                  <cat.icon size={20} />
                  <h3>{cat.name}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cat.items.map(skill => (
                    <motion.span
                      key={skill}
                      whileHover={{ scale: 1.05 }}
                      className="px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm cursor-default"
                    >
                      {skill}
                    </motion.span>
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
