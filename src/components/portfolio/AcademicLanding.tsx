import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Github, ArrowUpRight, MapPin, Mail, Layers, Code2, Cpu, Globe } from 'lucide-react';
import { AboutSettings } from '../../types';

interface AcademicLandingProps {
  settings: AboutSettings;
}

export const AcademicLanding: React.FC<AcademicLandingProps> = ({ settings }) => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-6 items-stretch justify-center min-h-[80vh]">
      {/* Left: Profile Identity */}
      <SpotlightCard className="flex-[1.4] bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800/50">
        <ProfileContent settings={settings} />
      </SpotlightCard>

      {/* Right: Portfolio Gateway */}
      <SpotlightCard className="flex-1 bg-zinc-900 dark:bg-black border-zinc-800 dark:border-zinc-800">
        <PortfolioGateway settings={settings} />
      </SpotlightCard>
    </div>
  );
};

// --- Spotlight Card Wrapper ---
// Adds a subtle glow effect that follows the mouse
const SpotlightCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsFocused(true)}
      onMouseLeave={() => setIsFocused(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative rounded-3xl border overflow-hidden group ${className}`}
    >
      {/* Spotlight Gradient */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(99,102,241,0.15), transparent 40%)`,
        }}
      />
      <div className="relative h-full flex flex-col">{children}</div>
    </motion.div>
  );
};

// --- Left Content: Profile ---
const ProfileContent = ({ settings }: { settings: AboutSettings }) => {
  return (
    <div className="p-8 md:p-10 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="relative">
          <div className="w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-zinc-50 dark:ring-zinc-800 shadow-lg">
            <img 
              src={settings.image} 
              alt={settings.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white dark:border-zinc-900 shadow-sm flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            OPEN
          </div>
        </div>
        
        {/* Social Stack */}
        <div className="flex gap-2">
          {settings.socials?.github && (
            <SocialIcon href={settings.socials.github} icon={Github} />
          )}
          {settings.socials?.email && (
            <SocialIcon href={settings.socials.email} icon={Mail} />
          )}
        </div>
      </div>

      {/* Identity */}
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white tracking-tight mb-2">
          {settings.name}
        </h1>
        <p className="text-indigo-600 dark:text-indigo-400 font-medium text-sm uppercase tracking-wider flex items-center gap-2">
          <Cpu size={14} /> {settings.role}
        </p>
      </div>

      {/* Bio */}
      <div className="prose prose-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-8 max-w-md">
        <div dangerouslySetInnerHTML={{ __html: settings.bio }} />
      </div>

      {/* Footer: Skills / Location */}
      <div className="mt-auto pt-8 border-t border-zinc-100 dark:border-zinc-800/50 flex flex-wrap gap-y-4 justify-between items-end">
        <div className="flex flex-wrap gap-2">
          {settings.skills.slice(0, 4).map((skill) => (
            <span 
              key={skill} 
              className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs font-semibold rounded-lg border border-zinc-200 dark:border-zinc-700/50"
            >
              {skill}
            </span>
          ))}
        </div>
        <div className="text-xs text-zinc-400 font-medium flex items-center gap-1">
          <MapPin size={12} /> Remote / Worldwide
        </div>
      </div>
    </div>
  );
};

// --- Right Content: Portfolio Gateway ---
const PortfolioGateway = ({ settings }: { settings: AboutSettings }) => {
  const portfolioUrl = settings.resume_link || settings.socials?.github || '#';

  return (
    <a 
      href={portfolioUrl}
      target="_blank"
      rel="noreferrer"
      className="flex flex-col h-full relative group/card cursor-pointer"
    >
      {/* Animated Grid Background */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <motion.div 
          animate={{ x: [0, 24], y: [0, 24] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
        />
      </div>

      <div className="p-8 md:p-10 flex flex-col h-full relative z-10">
        <div className="flex justify-between items-start mb-12">
          <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center text-white border border-zinc-700 shadow-inner group-hover/card:bg-indigo-600 group-hover/card:border-indigo-500 transition-colors duration-300">
            <Layers size={24} />
          </div>
          <div className="bg-zinc-800 text-zinc-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-zinc-700 group-hover/card:text-white transition-colors">
            External
          </div>
        </div>

        <div className="mt-auto">
          <h2 className="text-3xl font-bold text-white mb-3">
            View Portfolio
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed mb-8 max-w-xs group-hover/card:text-zinc-300 transition-colors">
            Explore my latest projects, case studies, and technical deep dives.
          </p>

          <div className="flex items-center gap-4 text-white font-bold text-sm group-hover/card:translate-x-2 transition-transform duration-300">
            <span className="border-b border-white/30 pb-0.5 group-hover/card:border-white transition-colors">Launch Site</span>
            <ArrowUpRight size={16} />
          </div>
        </div>
      </div>
    </a>
  );
};

const SocialIcon = ({ href, icon: Icon }: { href: string; icon: any }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className="p-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-white transition-all"
  >
    <Icon size={18} />
  </a>
);
