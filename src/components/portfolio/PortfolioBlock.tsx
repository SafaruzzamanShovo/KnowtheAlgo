import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, ExternalLink, Github, FileText, 
  User, Users, Calendar, Trophy, Star, ChevronDown, 
  Sparkles, Layers, Zap, Award, Crown, Medal, MapPin,
  Cpu, Globe, Database
} from 'lucide-react';
import { PortfolioItem } from '../../types';
import DOMPurify from 'dompurify';
import { cn } from '../../lib/utils';
import { DynamicIcon } from '../DynamicIcon';

interface PortfolioBlockProps {
  item: PortfolioItem;
  className?: string;
  index?: number;
}

export const PortfolioBlock: React.FC<PortfolioBlockProps> = ({ item, className, index = 0 }) => {
  const isCardLayout = ['project', 'research'].includes(item.section);
  const isTimelineLayout = ['experience', 'education'].includes(item.section);
  
  if (isCardLayout) {
    return <AuroraCard item={item} className={className} index={index} />;
  }
  
  if (isTimelineLayout) {
    return <TimelineRow item={item} className={className} />;
  }

  return <GlassAchievementCard item={item} className={className} index={index} />;
};

// --- 1. Aurora Gradient Card (Premium Look) ---
const AuroraCard = ({ item, className, index }: { item: PortfolioItem, className?: string, index: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isProject = item.section === 'project';
  
  // Sophisticated "Cosmic" Gradient Themes
  const themes: Record<string, any> = {
    nebula: {
      bg: "bg-gradient-to-br from-[#6366f1]/10 via-[#a855f7]/10 to-[#ec4899]/10 dark:from-[#6366f1]/20 dark:via-[#a855f7]/20 dark:to-[#ec4899]/20",
      border: "border-indigo-200/60 dark:border-indigo-700/50",
      accent: "text-indigo-600 dark:text-indigo-300",
      iconGradient: "from-indigo-500 to-purple-600",
      tagBg: "bg-indigo-50 dark:bg-indigo-900/30",
      glow: "hover:shadow-[0_0_40px_-10px_rgba(99,102,241,0.3)]"
    },
    ocean: {
      bg: "bg-gradient-to-br from-[#3b82f6]/10 via-[#06b6d4]/10 to-[#14b8a6]/10 dark:from-[#3b82f6]/20 dark:via-[#06b6d4]/20 dark:to-[#14b8a6]/20",
      border: "border-blue-200/60 dark:border-blue-700/50",
      accent: "text-blue-600 dark:text-blue-300",
      iconGradient: "from-blue-500 to-cyan-500",
      tagBg: "bg-blue-50 dark:bg-blue-900/30",
      glow: "hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)]"
    },
    sunset: {
      bg: "bg-gradient-to-br from-[#f97316]/10 via-[#f43f5e]/10 to-[#ec4899]/10 dark:from-[#f97316]/20 dark:via-[#f43f5e]/20 dark:to-[#ec4899]/20",
      border: "border-orange-200/60 dark:border-orange-700/50",
      accent: "text-orange-600 dark:text-orange-300",
      iconGradient: "from-orange-500 to-rose-500",
      tagBg: "bg-orange-50 dark:bg-orange-900/30",
      glow: "hover:shadow-[0_0_40px_-10px_rgba(249,115,22,0.3)]"
    },
    forest: {
      bg: "bg-gradient-to-br from-[#10b981]/10 via-[#14b8a6]/10 to-[#0ea5e9]/10 dark:from-[#10b981]/20 dark:via-[#14b8a6]/20 dark:to-[#0ea5e9]/20",
      border: "border-emerald-200/60 dark:border-emerald-700/50",
      accent: "text-emerald-600 dark:text-emerald-300",
      iconGradient: "from-emerald-500 to-teal-500",
      tagBg: "bg-emerald-50 dark:bg-emerald-900/30",
      glow: "hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)]"
    }
  };

  // Select theme: Use manual override if present, otherwise cycle
  const themeKeys = Object.keys(themes);
  const selectedThemeKey = item.details?.color && themes[item.details.color] ? item.details.color : themeKeys[index % themeKeys.length];
  const theme = themes[selectedThemeKey];

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "group relative rounded-[2rem] border overflow-hidden transition-all duration-500 hover:-translate-y-2 flex flex-col h-full backdrop-blur-md",
        theme.bg,
        theme.border,
        "bg-white/60 dark:bg-gray-900/60",
        theme.glow,
        className
      )}
    >
      {/* Decorative Top Shine */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/40 to-transparent dark:from-white/5 pointer-events-none" />
      
      <div className="p-8 flex flex-col flex-grow relative z-10">
        {/* Header with Star Icon */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-white/50 dark:border-white/10 shadow-sm backdrop-blur-sm", theme.tagBg, theme.accent)}>
                {item.details?.type || (isProject ? "Project" : "Research")}
              </span>
              {item.details?.status === 'ongoing' && (
                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-100/50 dark:bg-emerald-900/30 px-2 py-1 rounded-full border border-emerald-200/50 dark:border-emerald-800/50">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                  Active
                </span>
              )}
            </div>
          </div>
          
          {/* Aesthetic Star/Icon Button */}
          <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 bg-gradient-to-br text-white",
            theme.iconGradient
          )}>
             {isProject ? <Star size={20} fill="currentColor" className="text-white/90" /> : <Sparkles size={20} className="text-white/90" />}
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="mb-4">
          <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 leading-tight tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-600 dark:group-hover:from-white dark:group-hover:to-gray-300 transition-all">
            {item.title}
          </h3>
          {(item.subtitle || item.organization) && (
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 flex flex-wrap items-center gap-2">
              {item.organization && <span className="flex items-center gap-1"><MapPin size={12} /> {item.organization}</span>}
              {item.organization && item.subtitle && <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />}
              {item.subtitle && <span>{item.subtitle}</span>}
            </div>
          )}
        </div>

        {/* Description Preview */}
        {!isExpanded && item.description && (
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3 mb-6 flex-grow text-sm font-medium">
             {item.description.replace(/<[^>]*>?/gm, '')}
          </p>
        )}

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div 
                className="prose prose-sm dark:prose-invert text-gray-600 dark:text-gray-300 mb-6 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.description || '') }}
              />
              
              {/* Advisor & Team Section */}
              {(item.details?.advisor || (item.details?.team && item.details.team.length > 0)) && (
                <div className="bg-white/50 dark:bg-black/20 rounded-xl p-4 mb-6 border border-white/20 dark:border-white/5 backdrop-blur-md">
                  {item.details.advisor && (
                    <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-100/50 dark:border-gray-800/50">
                      <div className="p-1.5 rounded-lg bg-white dark:bg-gray-800 text-gray-500 shadow-sm">
                        <User size={14} />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Advisor</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{item.details.advisor}</span>
                      </div>
                    </div>
                  )}
                  {item.details.team && item.details.team.length > 0 && (
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 rounded-lg bg-white dark:bg-gray-800 text-gray-500 mt-0.5 shadow-sm">
                        <Users size={14} />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Collaborators</span>
                        <div className="flex flex-wrap gap-2">
                          {item.details.team.map((member, idx) => (
                             <span key={idx} className="inline-flex items-center px-2 py-1 rounded-md bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300 shadow-sm">
                               {member}
                             </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer: Tags & Actions */}
        <div className="mt-auto pt-6 border-t border-gray-200/50 dark:border-gray-700/50 flex flex-col gap-5">
          {/* Tags */}
          {item.details?.tags && (
            <div className="flex flex-wrap gap-2">
              {item.details.tags.slice(0, isExpanded ? undefined : 3).map(tag => (
                <span 
                  key={tag} 
                  className="px-2.5 py-1 rounded-lg bg-white/60 dark:bg-black/40 text-gray-600 dark:text-gray-400 text-[11px] font-bold border border-white/50 dark:border-white/10 shadow-sm"
                >
                  #{tag}
                </span>
              ))}
              {!isExpanded && item.details.tags.length > 3 && (
                <span className="px-2 py-1 text-[11px] font-bold text-gray-400 flex items-center">
                  +{item.details.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {item.details?.links?.github && (
                <SocialLink href={item.details.links.github} icon={Github} label="Code" />
              )}
              {item.details?.links?.paper && (
                <SocialLink href={item.details.links.paper} icon={FileText} label="Paper" />
              )}
              {item.details?.links?.demo && (
                <SocialLink href={item.details.links.demo} icon={ExternalLink} label="Demo" />
              )}
            </div>
            
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className={cn(
                "group/btn flex items-center gap-2 text-xs font-bold uppercase tracking-wide transition-all px-4 py-2 rounded-xl hover:shadow-md",
                isExpanded 
                  ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white" 
                  : "bg-white dark:bg-gray-800 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 border border-gray-200 dark:border-gray-700"
              )}
            >
              {isExpanded ? 'Close' : 'Details'} 
              <ChevronDown size={14} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'group-hover/btn:translate-y-0.5'}`} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const SocialLink = ({ href, icon: Icon, label }: { href: string, icon: any, label: string }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noreferrer" 
    className="p-2.5 rounded-xl bg-white dark:bg-gray-800 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all border border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800 shadow-sm hover:shadow-md"
    title={label}
  >
    <Icon size={18} />
  </a>
);

// --- 2. Clean Timeline Row ---
const TimelineRow = ({ item, className }: { item: PortfolioItem, className?: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className={cn("relative pl-8 md:pl-0 group", className)}>
      {/* Timeline Connector */}
      <div className="hidden md:block absolute left-[149px] top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-800 group-last:bottom-auto group-last:h-full"></div>
      <div className="hidden md:flex absolute left-[145px] top-6 w-2.5 h-2.5 rounded-full bg-white dark:bg-gray-900 border-2 border-indigo-500 z-10 shadow-[0_0_0_4px_rgba(255,255,255,1)] dark:shadow-[0_0_0_4px_rgba(17,24,39,1)]"></div>

      <div className="md:hidden absolute left-3 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-800"></div>
      <div className="md:hidden absolute left-[9px] top-6 w-2 h-2 rounded-full bg-indigo-500 border-2 border-white dark:border-gray-900 z-10"></div>

      <div className="flex flex-col md:flex-row gap-6 md:gap-16 items-start">
        <div className="md:w-32 flex-shrink-0 pt-5 text-right hidden md:block">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{item.period}</span>
        </div>

        <div className="flex-1 w-full">
          <div 
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 hover:border-indigo-500/30 hover:shadow-xl transition-all cursor-pointer group/card relative overflow-hidden"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-0 group-hover/card:opacity-100 transition-opacity"></div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover/card:text-indigo-600 dark:group-hover/card:text-indigo-400 transition-colors">
                {item.title}
              </h3>
              <span className="md:hidden text-xs font-bold text-gray-500 font-mono flex items-center gap-1">
                <Calendar size={12} /> {item.period}
              </span>
            </div>
            
            <div className="text-gray-600 dark:text-gray-300 font-medium text-sm mb-4 flex items-center gap-2">
              {item.organization}
              {item.subtitle && <span className="text-gray-400">• {item.subtitle}</span>}
            </div>

            <div className={cn("text-sm text-gray-600 dark:text-gray-400 leading-relaxed", !isExpanded && "line-clamp-2")}>
               <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.description || '') }} />
            </div>

            <div className="mt-4 flex justify-center opacity-0 group-hover/card:opacity-100 transition-opacity">
               <ChevronDown size={16} className={cn("text-gray-300 transition-transform duration-300", isExpanded && "rotate-180")} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 3. Glass Achievement Card (Bento Style) ---
const GlassAchievementCard = ({ item, className, index }: { item: PortfolioItem, className?: string, index: number }) => {
  const isHonor = item.section === 'honor';
  
  // Minimalist Glass Themes with Pop
  const themes = [
    { bg: "bg-amber-500/5 dark:bg-amber-500/10", border: "border-amber-200/50 dark:border-amber-800/50", icon: "text-amber-600 dark:text-amber-400", gradient: "from-amber-500 to-orange-500" },
    { bg: "bg-indigo-500/5 dark:bg-indigo-500/10", border: "border-indigo-200/50 dark:border-indigo-800/50", icon: "text-indigo-600 dark:text-indigo-400", gradient: "from-indigo-500 to-purple-500" },
    { bg: "bg-rose-500/5 dark:bg-rose-500/10", border: "border-rose-200/50 dark:border-rose-800/50", icon: "text-rose-600 dark:text-rose-400", gradient: "from-rose-500 to-pink-500" },
  ];

  const theme = themes[index % themes.length];

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={cn(
        "relative p-6 rounded-3xl border transition-all duration-300 hover:shadow-xl flex flex-col h-full backdrop-blur-sm group overflow-hidden",
        theme.bg,
        theme.border,
        "bg-white/50 dark:bg-gray-900/50",
        className
      )}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-bl-full pointer-events-none"></div>

      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-md bg-gradient-to-br text-white", theme.gradient)}>
          {/* Dynamic Icon Support */}
          {item.details?.icon ? (
            <DynamicIcon name={item.details.icon} size={20} strokeWidth={2} />
          ) : isHonor ? (
            <Trophy size={20} strokeWidth={2} />
          ) : (
            <Crown size={20} strokeWidth={2} />
          )}
        </div>
        {item.period && (
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/80 dark:bg-gray-900/80 border border-gray-100 dark:border-gray-800 text-gray-500">
            {item.period}
          </span>
        )}
      </div>

      <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-2 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-600 dark:group-hover:from-white dark:group-hover:to-gray-300 transition-all">
        {item.title}
      </h4>
      
      <div className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide flex items-center gap-1">
        <Award size={12} /> {item.organization}
      </div>
      
      {item.description && (
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mt-auto line-clamp-3 font-medium">
          {item.description}
        </p>
      )}
    </motion.div>
  );
};
