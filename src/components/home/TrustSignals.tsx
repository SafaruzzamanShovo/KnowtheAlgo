import React from 'react';
import { motion } from 'framer-motion';
import { Book, Code, Users } from 'lucide-react';

interface TrustSignalsProps {
  stats: {
    topics: number;
    projects: number;
    posts: number;
  };
}

export const TrustSignals: React.FC<TrustSignalsProps> = ({ stats }) => {
  return (
    <section className="py-20 bg-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          
          <StatItem 
            icon={Book} 
            value={stats.topics} 
            label="Topics Covered" 
            delay={0}
          />
          <StatItem 
            icon={Code} 
            value={stats.projects} 
            label="Portfolio Projects" 
            delay={0.2}
          />
          <StatItem 
            icon={Users} 
            value={stats.posts} 
            label="Community Discussions" 
            delay={0.4}
          />

        </div>
      </div>
    </section>
  );
};

const StatItem = ({ icon: Icon, value, label, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.6 }}
    className="flex flex-col items-center"
  >
    <div className="mb-4 text-indigo-400 opacity-80">
      <Icon size={32} />
    </div>
    <div className="text-5xl md:text-6xl font-black mb-2 tracking-tight">
      {value}+
    </div>
    <div className="text-gray-400 font-medium uppercase tracking-widest text-sm">
      {label}
    </div>
  </motion.div>
);
