import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Github, Globe, Terminal, Cpu, Command } from 'lucide-react';
import { AboutSettings } from '../../types';

interface AcademicLandingProps {
  settings: AboutSettings;
}

export const AcademicLanding: React.FC<AcademicLandingProps> = ({ settings }) => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12 md:py-24 flex flex-col md:flex-row gap-6 items-stretch justify-center min-h-[80vh]">
      {/* LEFT CARD — PROFILE (Command Center Style) */}
      <SpotlightCard className="flex-[1.6] p-8 md:p-10 flex flex-col relative group">
        <div className="flex flex-col sm:flex-row gap-8 items-start relative z-10">
          {/* Profile Image with Status Indicator */}
          <div className="relative flex-shrink-0">
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden border-2 border-zinc-800 shadow-2xl">
              <img 
                src={settings.image} 
                alt={settings.name} 
                className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-zinc-900 p-1.5 rounded-full border border-zinc-800">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-zinc-100 tracking-tight mb-2">
                {settings.name}
              </h1>
              <div className="flex items-center gap-2 text-zinc-400 text-sm font-medium uppercase tracking-wider">
                <Terminal size={14} className="text-indigo-500" />
                {settings.role}
              </div>
            </div>

            <div 
              className="prose prose-invert prose-sm text-zinc-400 leading-relaxed max-w-none"
              dangerouslySetInnerHTML={{ __html: settings.bio }}
            />

            {/* Tech Stack / Skills Chips */}
            <div className="flex flex-wrap gap-2 pt-2">
              {settings.skills.slice(0, 6).map((skill) => (
                <span 
                  key={skill} 
                  className="px-2.5 py-1 bg-zinc-800/50 border border-zinc-700/50 text-zinc-300 text-xs font-medium rounded-md hover:bg-zinc-800 hover:border-zinc-600 transition-colors cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </SpotlightCard>

      {/* RIGHT CARD — PORTFOLIO GATEWAY */}
      <a 
        href={settings.resume_link || '#'} 
        target="_blank"
        rel="noreferrer"
        className="flex-1 block group/right"
      >
        <SpotlightCard className="h-full p-8 md:p-10 flex flex-col justify-between items-center text-center relative overflow-hidden hover:border-zinc-600 transition-colors">
          
          {/* Abstract Grid Background */}
          <div className="absolute inset-0 opacity-[0.03] group-hover/right:opacity-[0.07] transition-opacity" 
               style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
          </div>

          <div className="relative z-10 flex-1 flex flex-col justify-center items-center mt-4">
            <div className="w-20 h-20 bg-zinc-800/50 rounded-3xl flex items-center justify-center mb-8 border border-zinc-700/50 shadow-inner group-hover/right:scale-110 transition-transform duration-500">
              <Globe size={36} className="text-zinc-200" strokeWidth={1.5} />
            </div>
            
            <h2 className="text-xl font-bold text-zinc-100 mb-3">
              {settings.portfolio_card_title || "View Portfolio"}
            </h2>
            <p className="text-sm text-zinc-500 max-w-[200px] leading-relaxed">
              {settings.portfolio_card_desc || "Explore full case studies, research papers, and live deployments."}
            </p>
          </div>

          <div className="relative z-10 w-full mt-8">
            <div className="w-full py-3 rounded-xl bg-zinc-100 text-zinc-900 font-bold text-sm flex items-center justify-center gap-2 group-hover/right:bg-white transition-colors shadow-lg shadow-zinc-900/20">
              {settings.portfolio_card_cta || "Launch"} <ArrowRight size={16} className="group-hover/right:translate-x-1 transition-transform" />
            </div>
          </div>
        </SpotlightCard>
      </a>
    </div>
  );
};

// --- Spotlight Effect Component ---
const SpotlightCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setOpacity(1);
  };

  const handleBlur = () => {
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-2xl border border-zinc-800 bg-zinc-900/80 text-zinc-200 shadow-xl backdrop-blur-md ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 rounded-2xl"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.06), transparent 40%)`,
        }}
      />
      {children}
    </div>
  );
};
