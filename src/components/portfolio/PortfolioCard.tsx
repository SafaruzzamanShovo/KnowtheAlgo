import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ExternalLink, Github, FileText, ChevronDown, ChevronUp, 
  Calendar, User, Users, Tag, Award, Briefcase, Code2, Star 
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
  research: { color: 'bg-blue-500', text: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', icon: FileText },
  project: { color: 'bg-emerald-500', text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: Code2 },
  experience: { color: 'bg-indigo-500', text: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200', icon: Briefcase },
  education: { color: 'bg-purple-500', text: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', icon: User },
  honor: { color: 'bg-amber-500', text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', icon: Award },
  leadership: { color: 'bg-rose-500', text: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200', icon: Star },
  news: { color: 'bg-gray-500', text: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200', icon: Star },
};

export const PortfolioCard: React.FC<PortfolioCardProps> = ({ item, type, index = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const config = sectionConfig[type] || sectionConfig.research;
  const isRecruiterMode = localStorage.getItem('recruiter-mode') === 'true';

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { delay: index * 0.1, duration: 0.4 } }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className={cn(
        "group relative bg-white dark:bg-gray-900 rounded-2xl border transition-all duration-300 overflow-hidden",
        isHovered ? "shadow-xl translate-y-[-4px] border-gray-300 dark:border-gray-700" : "shadow-sm border-gray-200 dark:border-gray-800"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Accent Strip */}
      <div className={cn("absolute top-0 left-0 w-1 h-full transition-all duration-300", config.color, isHovered ? "opacity-100" : "opacity-60")} />

      <div className="p-6 pl-8">
        {/* Header Row */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full", config.bg, config.text, "dark:bg-opacity-10")}>
                {item.details?.type || type}
              </span>
              {item.details?.status === 'ongoing' && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                  Ongoing
                </span>
              )}
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {item.title}
            </h3>
          </div>
          
          {/* Date Badge */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-50 dark:bg-gray-800 px-2.5 py-1 rounded-lg">
            <Calendar size={12} />
            {item.period}
          </div>
        </div>

        {/* Subtitle / Organization */}
        {(item.organization || item.subtitle) && (
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4 flex items-center gap-2">
            {item.organization && <span>{item.organization}</span>}
            {item.organization && item.subtitle && <span className="text-gray-300 dark:text-gray-700">•</span>}
            {item.subtitle && <span className="text-gray-500">{item.subtitle}</span>}
          </div>
        )}

        {/* Metadata Row (Recruiter Friendly) */}
        <div className="flex flex-wrap gap-y-2 gap-x-4 mb-4 text-xs text-gray-500 dark:text-gray-400">
          {item.details?.advisor && (
            <div className="flex items-center gap-1.5">
              <User size={12} className="text-indigo-500" />
              <span>Advisor: {item.details.advisor}</span>
            </div>
          )}
          {item.details?.team && item.details.team.length > 0 && (
            <div className="flex items-center gap-1.5">
              <Users size={12} className="text-indigo-500" />
              <span>Team: {item.details.team.length} members</span>
            </div>
          )}
          {item.details?.tags && (
            <div className="flex items-center gap-1.5">
              <Tag size={12} className="text-indigo-500" />
              <span>{item.details.tags.slice(0, 3).join(', ')}</span>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="relative">
          <div 
            className={cn(
              "text-sm text-gray-600 dark:text-gray-300 leading-relaxed prose dark:prose-invert max-w-none",
              !isExpanded && "line-clamp-2"
            )}
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.description || '') }}
          />
        </div>

        {/* Expandable Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800"
            >
              {/* Full Description if truncated */}
              {/* Additional Links & Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                {item.details?.team && (
                  <div>
                    <span className="font-bold text-gray-900 dark:text-white block mb-1">Team</span>
                    <span className="text-gray-600 dark:text-gray-400">{item.details.team.join(', ')}</span>
                  </div>
                )}
                {item.details?.tags && (
                  <div>
                    <span className="font-bold text-gray-900 dark:text-white block mb-1">Technologies</span>
                    <div className="flex flex-wrap gap-1">
                      {item.details.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs text-gray-600 dark:text-gray-400">
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

        {/* Actions Footer */}
        <div className="mt-6 flex items-center justify-between">
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
            className="text-xs font-bold text-gray-400 hover:text-indigo-600 flex items-center gap-1 transition-colors"
          >
            {isExpanded ? 'Less' : 'More'}
            {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
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
    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all text-xs font-bold border border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800"
  >
    <Icon size={12} />
    {label}
  </a>
);
