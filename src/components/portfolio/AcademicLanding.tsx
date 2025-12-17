import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ArrowRight, ExternalLink } from 'lucide-react';
import { AboutSettings } from '../../types';

interface AcademicLandingProps {
  settings: AboutSettings;
}

export const AcademicLanding: React.FC<AcademicLandingProps> = ({ settings }) => {
  // Extract research interests from skills (taking top 3-4)
  const researchInterests = settings.skills.slice(0, 4);

  return (
    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch">
      
      {/* LEFT CARD — ABOUT ME */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white dark:bg-white rounded-[16px] p-8 md:p-10 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-neutral-100 flex flex-col h-full group hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-500 hover:scale-[1.005]"
      >
        {/* Header: Image & Name */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
          <motion.div 
            className="relative overflow-hidden rounded-2xl w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 shadow-sm border border-neutral-100"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.4 }}
          >
            <img 
              src={settings.image} 
              alt={settings.name} 
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif-reading font-bold text-neutral-900 tracking-tight mb-2">
              {settings.name}
            </h1>
            <p className="text-sm font-medium text-neutral-500 uppercase tracking-wider">
              {settings.role}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-12 h-px bg-neutral-200 mb-8"></div>

        {/* Academic Bio */}
        <div className="prose prose-neutral prose-sm max-w-none text-neutral-600 leading-relaxed mb-8 font-sans">
          <div dangerouslySetInnerHTML={{ __html: settings.bio }} />
        </div>

        {/* Research Interests (Footer of Left Card) */}
        <div className="mt-auto">
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">
            Research Interests
          </h3>
          <div className="flex flex-wrap gap-2">
            {researchInterests.map((interest, idx) => (
              <span 
                key={idx} 
                className="px-3 py-1.5 bg-neutral-50 text-neutral-600 text-xs font-medium rounded-lg border border-neutral-100"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* RIGHT CARD — ACADEMIC CV */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
        className="bg-white dark:bg-white rounded-[16px] p-8 md:p-10 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-neutral-100 flex flex-col justify-between h-full group hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-500 hover:scale-[1.005] relative overflow-hidden"
      >
        {/* Subtle Background Detail */}
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
          <FileText size={120} />
        </div>

        <div className="relative z-10">
          <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600 mb-6">
            <FileText size={24} strokeWidth={1.5} />
          </div>
          
          <h2 className="text-2xl font-bold text-neutral-900 mb-3 font-serif-reading">
            Academic Curriculum Vitae
          </h2>
          <p className="text-neutral-500 leading-relaxed max-w-sm">
            A comprehensive overview of my academic background, research publications, awards, and technical competencies.
          </p>
        </div>

        <div className="relative z-10 mt-10 sm:mt-0">
          <a 
            href={settings.resume_link}
            target="_blank"
            rel="noreferrer"
            className="group/btn inline-flex items-center gap-3 text-sm font-bold text-slate-700 hover:text-slate-900 transition-colors"
          >
            <span className="border-b-2 border-slate-200 group-hover/btn:border-slate-600 pb-0.5 transition-all duration-300">
              View Academic CV
            </span>
            <motion.span 
              initial={{ x: 0 }}
              whileHover={{ x: 4 }}
              className="text-slate-400 group-hover/btn:text-slate-600"
            >
              <ArrowRight size={16} />
            </motion.span>
          </a>
          
          <div className="mt-4 text-xs text-neutral-400 flex items-center gap-1">
            <ExternalLink size={10} />
            <span>Hosted on GitHub Pages</span>
          </div>
        </div>
      </motion.div>

    </div>
  );
};
