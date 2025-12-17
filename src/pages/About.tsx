import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ArrowRight, ExternalLink, GraduationCap, Github, Linkedin, Mail, BookOpen } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { SEOHead } from '../components/seo/SEOHead';

export const About = () => {
  const { aboutSettings, loading } = useSiteSettings();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin w-6 h-6 border-2 border-gray-300 border-t-gray-800 rounded-full"></div>
      </div>
    );
  }

  // Animation Variants - Sophisticated & Smooth
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#F5F5F7] dark:bg-[#050505] flex items-center justify-center p-6 lg:p-12 font-sans">
      <SEOHead
        title={`${aboutSettings.name} - Academic Profile`}
        description={aboutSettings.bio}
        image={aboutSettings.image}
        type="profile"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch"
      >
        {/* LEFT CARD — GORGEOUS EDITORIAL PROFILE */}
        <motion.div
          variants={cardVariants}
          className="lg:col-span-3 bg-white dark:bg-[#121212] rounded-[2rem] p-8 lg:p-10 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.05)] dark:shadow-none border border-white/50 dark:border-white/5 flex flex-col relative overflow-hidden group"
        >
          {/* Subtle Gradient Background */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-transparent dark:from-indigo-900/10 dark:via-purple-900/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

          {/* Header: Image & Identity */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8 relative z-10">
            <div className="relative">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-white dark:border-gray-800 shadow-lg shadow-black/5 dark:shadow-black/20">
                {aboutSettings.image ? (
                  <img 
                    src={aboutSettings.image} 
                    alt={aboutSettings.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-300">
                    <GraduationCap size={40} />
                  </div>
                )}
              </div>
              {/* Status Dot */}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white dark:bg-[#121212] rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-emerald-500 rounded-full border border-white dark:border-[#121212]"></div>
              </div>
            </div>
            
            <div>
              <h1 className="text-3xl sm:text-4xl font-serif-reading font-bold text-gray-900 dark:text-white tracking-tight mb-1.5">
                {aboutSettings.name}
              </h1>
              <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                {aboutSettings.role}
              </p>
            </div>
          </div>

          {/* Bio - Editorial Style */}
          <div className="relative z-10 mb-8 flex-grow">
            <div 
              className="prose prose-sm sm:prose-base dark:prose-invert text-gray-600 dark:text-gray-300 leading-relaxed font-serif-reading max-w-none"
              dangerouslySetInnerHTML={{ __html: aboutSettings.bio }}
            />
          </div>

          {/* Footer: Socials & Interests */}
          <div className="mt-auto pt-8 border-t border-gray-100 dark:border-gray-800/50 relative z-10">
            <div className="flex flex-col gap-6">
              {/* Social Links */}
              <div className="flex items-center gap-3">
                {aboutSettings.socials?.email && (
                  <SocialButton href={aboutSettings.socials.email} icon={Mail} label="Email" />
                )}
                {aboutSettings.socials?.github && (
                  <SocialButton href={aboutSettings.socials.github} icon={Github} label="GitHub" />
                )}
                {aboutSettings.socials?.linkedin && (
                  <SocialButton href={aboutSettings.socials.linkedin} icon={Linkedin} label="LinkedIn" />
                )}
                {aboutSettings.socials?.scholar && (
                  <SocialButton href={aboutSettings.socials.scholar} icon={BookOpen} label="Scholar" />
                )}
              </div>

              {/* Tags */}
              {aboutSettings.skills && aboutSettings.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {aboutSettings.skills.slice(0, 5).map((interest) => (
                    <span 
                      key={interest} 
                      className="px-3 py-1 bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 text-[11px] font-bold uppercase tracking-wide rounded-lg border border-gray-100 dark:border-gray-800"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* RIGHT CARD — ACADEMIC CV */}
        <motion.a
          href={aboutSettings.resume_link || '#'}
          target="_blank"
          rel="noopener noreferrer"
          variants={cardVariants}
          className="lg:col-span-2 group relative bg-[#1A1A1A] dark:bg-white text-white dark:text-black rounded-[2rem] p-8 lg:p-10 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.15)] flex flex-col justify-between overflow-hidden transition-transform hover:-translate-y-1 duration-500"
        >
          {/* Abstract Pattern */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 dark:bg-black/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 dark:bg-black/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

          <div className="relative z-10">
            <div className="w-14 h-14 bg-white/10 dark:bg-black/5 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md border border-white/10 dark:border-black/5">
              <FileText size={24} className="text-white dark:text-black" />
            </div>

            <h2 className="text-3xl font-serif-reading font-bold mb-4 leading-tight">
              Curriculum<br/>Vitae
            </h2>
            
            <p className="text-white/60 dark:text-black/60 text-sm leading-relaxed max-w-xs">
              A comprehensive record of academic background, research publications, and technical achievements.
            </p>
          </div>

          <div className="relative z-10 mt-12">
            <div className="flex items-center justify-between border-t border-white/20 dark:border-black/10 pt-6">
              <span className="text-xs font-bold uppercase tracking-widest opacity-80">
                Read Online
              </span>
              <div className="w-10 h-10 rounded-full bg-white dark:bg-black text-black dark:text-white flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-[-45deg]">
                <ArrowRight size={16} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-[10px] opacity-50">
              <ExternalLink size={10} />
              <span>Hosted on GitHub Pages</span>
            </div>
          </div>
        </motion.a>
      </motion.div>
    </div>
  );
};

const SocialButton = ({ href, icon: Icon, label }: { href: string, icon: any, label: string }) => (
  <a 
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/20 dark:hover:text-indigo-400 transition-all border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/30"
    title={label}
  >
    <Icon size={18} strokeWidth={2} />
  </a>
);
