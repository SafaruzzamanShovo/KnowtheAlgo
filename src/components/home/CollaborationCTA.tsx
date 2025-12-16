import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase } from 'lucide-react';
import { HomeSettings } from '../../types';

interface CollaborationCTAProps {
  settings: HomeSettings;
}

export const CollaborationCTA: React.FC<CollaborationCTAProps> = ({ settings }) => {
  return (
    <section className="py-24 bg-gray-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/50 text-indigo-300 border border-indigo-800 text-xs font-bold uppercase tracking-wider mb-6">
              <Briefcase size={14} /> 
              <span>Work With Me</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              {settings.collab_title}
            </h2>
            
            <div 
              className="text-lg text-gray-300 mb-10 leading-relaxed max-w-2xl mx-auto prose prose-invert"
              dangerouslySetInnerHTML={{ __html: settings.collab_desc }}
            />

            <Link 
              to="/collaborate" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-xl shadow-white/10"
            >
              View Portfolio <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
