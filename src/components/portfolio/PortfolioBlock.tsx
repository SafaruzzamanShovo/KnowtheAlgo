import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, ExternalLink, Github, FileText, 
  User, Users, Calendar, MapPin, ChevronDown, Trophy, Star
} from 'lucide-react';
import { PortfolioItem } from '../../types';
import DOMPurify from 'dompurify';
import { cn } from '../../lib/utils';

interface PortfolioBlockProps {
  item: PortfolioItem;
  className?: string;
}

export const PortfolioBlock: React.FC<PortfolioBlockProps> = ({ item, className }) => {
  // Determine layout based on section type
  const isCardLayout = ['project', 'research'].includes(item.section);
  const isTimelineLayout = ['experience', 'education'].includes(item.section);
  
  if (isCardLayout) {
    return <ProjectResearchCard item={item} className={className} />;
  }
  
  if (isTimelineLayout) {
    return <TimelineRow item={item} className={className} />;
  }

  return <MinimalRow item={item} className={className} />;
};

// --- 1. Modern Card for Projects & Research ---
const ProjectResearchCard = ({ item, className }: { item: PortfolioItem, className?: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isProject = item.section === 'project';
  
  // Gradient fallback
  const gradient = item.details?.imageGradient || (isProject ? 'from-blue-500 to-cyan-500' : 'from-indigo-500 to-purple-500');

  return (
    <motion.div 
      layout
      className={cn(
        "group relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col h-full",
        className
      )}
    >
      {/* Top Banner / Gradient Accent */}
      <div className={`h-2 w-full bg-gradient-to-r ${gradient}`} />

      <div className="p-6 flex flex-col flex-grow">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-2 mb-2">
            {item.details?.type && (
              <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                {item.details.type}
              </span>
            )}
            {item.details?.status === 'ongoing' && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Ongoing
              </span>
            )}
          </div>
          {item.period && (
            <span className="text-xs font-medium text-gray-400 font-mono">{item.period}</span>
          )}
        </div>

        {/* Title & Subtitle */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {item.title}
        </h3>
        {(item.subtitle || item.organization) && (
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 font-medium">
            {item.subtitle} {item.organization && `• ${item.organization}`}
          </div>
        )}

        {/* Description Preview */}
        {!isExpanded && item.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3 mb-6 flex-grow">
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
                className="prose prose-sm dark:prose-invert text-gray-600 dark:text-gray-300 mb-6"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.description || '') }}
              />
              
              {/* Advisor & Team Section */}
              {(item.details?.advisor || (item.details?.team && item.details.team.length > 0)) && (
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-6 border border-gray-100 dark:border-gray-800">
                  {item.details.advisor && (
                    <div className="flex items-center gap-2 mb-2 text-sm">
                      <User size={14} className="text-indigo-500" />
                      <span className="text-gray-500 dark:text-gray-400">Advisor:</span>
                      <span className="font-bold text-gray-900 dark:text-white">{item.details.advisor}</span>
                    </div>
                  )}
                  {item.details.team && item.details.team.length > 0 && (
                    <div className="flex items-start gap-2 text-sm">
                      <Users size={14} className="text-indigo-500 mt-0.5" />
                      <span className="text-gray-500 dark:text-gray-400 whitespace-nowrap">Team:</span>
                      <div className="flex flex-wrap gap-1">
                        {item.details.team.map((member, idx) => (
                           <span key={idx} className="font-medium text-gray-900 dark:text-white">
                             {member}{idx < (item.details?.team?.length || 0) - 1 ? ',' : ''}
                           </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer: Tags & Actions */}
        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-4">
          {/* Tags */}
          {item.details?.tags && (
            <div className="flex flex-wrap gap-2">
              {item.details.tags.slice(0, isExpanded ? undefined : 3).map(tag => (
                <span key={tag} className="px-2 py-1 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-[10px] font-bold border border-gray-100 dark:border-gray-700">
                  {tag}
                </span>
              ))}
              {!isExpanded && item.details.tags.length > 3 && (
                <span className="px-2 py-1 text-[10px] text-gray-400">+{item.details.tags.length - 3}</span>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              {item.details?.links?.github && (
                <a href={item.details.links.github} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors" title="GitHub">
                  <Github size={18} />
                </a>
              )}
              {item.details?.links?.paper && (
                <a href={item.details.links.paper} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-indigo-600 transition-colors" title="Read Paper">
                  <FileText size={18} />
                </a>
              )}
              {item.details?.links?.demo && (
                <a href={item.details.links.demo} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-indigo-600 transition-colors" title="Live Demo">
                  <ExternalLink size={18} />
                </a>
              )}
            </div>
            
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              {isExpanded ? 'Show Less' : 'Details'} <ArrowRight size={12} className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- 2. Timeline Row for Experience & Education ---
const TimelineRow = ({ item, className }: { item: PortfolioItem, className?: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className={cn("relative pl-8 md:pl-0 group", className)}>
      {/* Timeline Connector (Desktop) */}
      <div className="hidden md:block absolute left-[149px] top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-800 group-last:bottom-auto group-last:h-full"></div>
      <div className="hidden md:flex absolute left-[144px] top-6 w-3 h-3 rounded-full bg-white dark:bg-gray-900 border-2 border-indigo-500 z-10"></div>

      {/* Timeline Connector (Mobile) */}
      <div className="md:hidden absolute left-3 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-800"></div>
      <div className="md:hidden absolute left-[9px] top-6 w-2 h-2 rounded-full bg-indigo-500 border-2 border-white dark:border-gray-900 z-10"></div>

      <div className="flex flex-col md:flex-row gap-6 md:gap-16 items-start">
        
        {/* Date Column */}
        <div className="md:w-32 flex-shrink-0 pt-5 text-right hidden md:block">
          <span className="text-sm font-bold text-gray-500 dark:text-gray-400 font-mono">{item.period}</span>
        </div>

        {/* Content Card */}
        <div className="flex-1 w-full">
          <div 
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 hover:border-indigo-500/30 hover:shadow-lg transition-all cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{item.title}</h3>
              {/* Mobile Date */}
              <span className="md:hidden text-xs font-bold text-gray-500 font-mono flex items-center gap-1">
                <Calendar size={12} /> {item.period}
              </span>
            </div>
            
            <div className="text-indigo-600 dark:text-indigo-400 font-medium text-sm mb-4 flex items-center gap-2">
              {item.organization}
              {item.subtitle && <span className="text-gray-400">• {item.subtitle}</span>}
            </div>

            <div className={cn("text-sm text-gray-600 dark:text-gray-400 leading-relaxed", !isExpanded && "line-clamp-2")}>
               <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.description || '') }} />
            </div>

            {/* Expand Indicator */}
            <div className="mt-4 flex justify-center">
               <ChevronDown size={16} className={cn("text-gray-300 transition-transform duration-300", isExpanded && "rotate-180")} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 3. Minimal Row for Awards/Leadership ---
const MinimalRow = ({ item, className }: { item: PortfolioItem, className?: string }) => {
  const Icon = item.section === 'honor' ? Trophy : Star;
  
  return (
    <div className={cn("flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-indigo-500/30 transition-colors", className)}>
      <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-400 group-hover:text-indigo-500 transition-colors">
        <Icon size={20} />
      </div>
      <div>
        <h4 className="font-bold text-gray-900 dark:text-white">{item.title}</h4>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {item.organization} {item.period && `• ${item.period}`}
        </div>
        {item.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
            {item.description}
          </p>
        )}
      </div>
    </div>
  );
};
