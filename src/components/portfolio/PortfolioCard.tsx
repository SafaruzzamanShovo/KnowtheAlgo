import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ExternalLink, Github, FileText, ChevronDown, ChevronUp, 
  Calendar, User, Users, Tag, Award, Briefcase, Code2, Star,
  ArrowRight
} from 'lucide-react';
import { PortfolioItem, PortfolioSection } from '../../types';
import { cn } from '../../lib/utils';
import DOMPurify from 'dompurify';

interface PortfolioCardProps {
  item: PortfolioItem;
  type: PortfolioSection;
  index?: number;
}

const sectionConfig = {
  research: { color: 'bg-blue-500', text: 'text-blue-600', border: 'border-blue-500', icon: FileText, label: 'Research' },
  project: { color: 'bg-emerald-500', text: 'text-emerald-600', border: 'border-emerald-500', icon: Code2, label: 'Project' },
  experience: { color: 'bg-indigo-500', text: 'text-indigo-600', border: 'border-indigo-500', icon: Briefcase, label: 'Experience' },
  education: { color: 'bg-purple-500', text: 'text-purple-600', border: 'border-purple-500', icon: User, label: 'Education' },
  honor: { color: 'bg-amber-500', text: 'text-amber-600', border: 'border-amber-500', icon: Award, label: 'Honor' },
  leadership: { color: 'bg-rose-500', text: 'text-rose-600', border: 'border-rose-500', icon: Star, label: 'Leadership' },
  news: { color: 'bg-gray-500', text: 'text-gray-600', border: 'border-gray-500', icon: Star, label: 'Update' },
};

export const PortfolioCard: React.FC<PortfolioCardProps> = ({ item, type, index = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const config = sectionConfig[type] || sectionConfig.research;
  const Icon = config.icon;

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        delay: index * 0.1, 
        duration: 0.5,
        ease: [0.21, 0.47, 0.32, 0.98] // Smooth spring-like ease
      } 
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className={cn(
        "group relative bg-white dark:bg-gray-900 rounded-xl border transition-all duration-300 overflow-hidden",
        isHovered 
          ? "shadow-xl translate-y-[-4px] border-gray-300 dark:border-gray-700" 
          : "shadow-sm border-gray-200 dark:border-gray-800"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Accent Strip (Left Edge) */}
      <div className={cn(
        "absolute left-0 top-0 bottom-0 w-1 transition-all duration-300",
        config.color,
        isHovered ? "opacity-100" : "opacity-60"
      )} />

      <div className="p-6 pl-8 flex flex-col h-full">
        {/* Header: Badges & Date */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <span className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-gray-50 dark:bg-gray-800",
              config.text
            )}>
              <Icon size={12} />
              {item.details?.type || config.label}
            </span>
            {item.details?.status === 'ongoing' && (
              <span className="px-2 py-1 rounded-md bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                Ongoing
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400 dark:text-gray-500">
            <Calendar size={12} />
            {item.period}
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight">
            {item.title}
          </h3>
          {(item.organization || item.subtitle) && (
            <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              {item.organization}
              {item.organization && item.subtitle && <span className="mx-1.5 opacity-50">•</span>}
              {item.subtitle}
            </div>
          )}
        </div>

        {/* Metadata Row (Recruiter Friendly) */}
        <div className="flex flex-wrap gap-y-2 gap-x-4 mb-5 text-xs text-gray-500 dark:text-gray-400">
          {item.details?.advisor && (
            <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800/50 px-2 py-1 rounded">
              <User size={12} className="text-indigo-500" />
              <span>Advisor: {item.details.advisor}</span>
            </div>
          )}
          {item.details?.team && item.details.team.length > 0 && (
            <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800/50 px-2 py-1 rounded">
              <Users size={12} className="text-indigo-500" />
              <span>{item.details.team.length} Team Members</span>
            </div>
          )}
          {item.details?.tags && (
            <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800/50 px-2 py-1 rounded">
              <Tag size={12} className="text-indigo-500" />
              <span>{item.details.tags.slice(0, 3).join(', ')}</span>
            </div>
          )}
        </div>

        {/* Description (Truncated) */}
        <div className="relative mb-4">
          <div 
            className={cn(
              "text-sm text-gray-600 dark:text-gray-300 leading-relaxed prose dark:prose-invert max-w-none transition-all duration-300",
              !isExpanded && "line-clamp-2"
            )}
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.description || '') }}
          />
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-4">
                {item.details?.team && (
                  <div>
                    <span className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider block mb-1">Team</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{item.details.team.join(', ')}</span>
                  </div>
                )}
                {item.details?.tags && (
                  <div>
                    <span className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider block mb-2">Technologies</span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.details.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Actions */}
        <div className="mt-auto pt-4 flex items-center justify-between">
          <div className="flex gap-2">
            {item.details?.links?.github && (
              <ActionButton href={item.details.links.github} icon={Github} label="Code" />
            )}
            {item.details?.links?.demo && (
              <ActionButton href={item.details.links.demo} icon={ExternalLink} label="Demo" />
            )}
            {item.details?.links?.paper && (
              <ActionButton href={item.details.links.paper} icon={FileText} label="Paper" />
            )}
            {item.details?.links?.scholar && (
              <ActionButton href={item.details.links.scholar} icon={FileText} label="Scholar" />
            )}
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-bold text-gray-400 hover:text-indigo-600 flex items-center gap-1 transition-colors group/btn"
          >
            {isExpanded ? 'Close' : 'Details'}
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} className="group-hover/btn:translate-y-0.5 transition-transform" />}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const ActionButton = ({ href, icon: Icon, label }: { href: string, icon: any, label: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white transition-all text-xs font-bold border border-gray-200 dark:border-gray-700 hover:border-indigo-600 dark:hover:border-indigo-600 hover:shadow-md"
  >
    <Icon size={12} />
    {label}
  </a>
);
