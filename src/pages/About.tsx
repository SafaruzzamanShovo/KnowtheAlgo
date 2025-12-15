import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Github, Linkedin, Mail, Code2, BookOpen, Briefcase, 
  GraduationCap, Award, Users, Zap, UserCircle, Building2, 
  Trophy, ArrowRight, Download, ExternalLink, Calendar, Layers,
  MapPin, Star, Sparkles
} from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { usePortfolio } from '../hooks/usePortfolio';
import { PortfolioItem } from '../types';

// --- Components ---

const TabButton = ({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) => (
  <button
    onClick={onClick}
    className={`relative px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
      active 
        ? 'text-white bg-gray-900 dark:bg-white dark:text-gray-900 shadow-lg' 
        : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white bg-gray-100 dark:bg-gray-800'
    }`}
  >
    {label}
    {active && (
      <motion.div
        layoutId="activeTab"
        className="absolute inset-0 rounded-full bg-inherit -z-10"
      />
    )}
  </button>
);

const SectionTitle = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="mb-10">
    <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
      <span className="w-2 h-8 bg-indigo-600 rounded-full"></span>
      {title}
    </h2>
    {subtitle && <p className="text-gray-500 dark:text-gray-400 mt-2 ml-5">{subtitle}</p>}
  </div>
);

export const About = () => {
  const { aboutSettings } = useSiteSettings();
  const { items } = usePortfolio();
  
  // State for Tabs
  const [researchTab, setResearchTab] = useState<'ongoing' | 'completed'>('ongoing');
  const [projectTab, setProjectTab] = useState<'Industry' | 'Course'>('Industry');

  // Filter Data
  const newsUpdates = items.filter(i => i.section === 'news');
  const research = items.filter(i => i.section === 'research');
  const projects = items.filter(i => i.section === 'project');
  const experience = items.filter(i => i.section === 'experience');
  const education = items.filter(i => i.section === 'education');
  const honors = items.filter(i => i.section === 'honor');
  const leadership = items.filter(i => i.section === 'leadership');

  // Filtered Lists based on Tabs
  const filteredResearch = research.filter(r => (r.details?.status || 'ongoing') === researchTab);
  const filteredProjects = projects.filter(p => (p.details?.type || 'Industry') === projectTab);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 font-sans selection:bg-indigo-500 selection:text-white pb-24">
      
      {/* --- Hero Section --- */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-16">
            
            {/* Left: Bio & Actions */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1 text-center lg:text-left"
            >
              <div className="inline-block px-3 py-1 mb-6 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider border border-indigo-100 dark:border-indigo-800">
                Portfolio & Resume
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
                {aboutSettings.name}
              </h1>
              <p className="text-xl text-indigo-600 dark:text-indigo-400 font-medium mb-6">
                {aboutSettings.role}
              </p>
              
              {/* Short Bio (4-5 lines) */}
              <div className="prose dark:prose-invert max-w-xl mx-auto lg:mx-0 mb-8 text-gray-600 dark:text-gray-300 leading-relaxed">
                {aboutSettings.bio}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <a 
                  href={aboutSettings.socials?.email || '#'}
                  className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-gray-900/20 flex items-center gap-2"
                >
                  <Mail size={18} /> Contact Me
                </a>
                {aboutSettings.resume_link && (
                  <a 
                    href={aboutSettings.resume_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center gap-2"
                  >
                    <Download size={18} /> Download CV
                  </a>
                )}
              </div>

              {/* Social Links */}
              <div className="mt-8 flex items-center justify-center lg:justify-start gap-4 text-gray-400">
                {aboutSettings.socials?.github && <SocialLink href={aboutSettings.socials.github} icon={<Github size={20} />} />}
                {aboutSettings.socials?.linkedin && <SocialLink href={aboutSettings.socials.linkedin} icon={<Linkedin size={20} />} />}
                {aboutSettings.socials?.scholar && <SocialLink href={aboutSettings.socials.scholar} icon={<BookOpen size={20} />} />}
              </div>
            </motion.div>

            {/* Right: Image & Updates */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="w-full max-w-sm flex flex-col gap-6"
            >
              {/* Aesthetic Image (Squircle/Cornering) */}
              <div className="relative group mx-auto lg:mx-0">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-[2.5rem] rotate-6 opacity-20 group-hover:rotate-3 transition-transform duration-500"></div>
                <div className="relative rounded-[2.5rem] overflow-hidden border-4 border-white dark:border-gray-800 shadow-2xl aspect-square w-72 h-72 lg:w-80 lg:h-80 mx-auto">
                  <img 
                    src={aboutSettings.image} 
                    alt={aboutSettings.name} 
                    className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
                  />
                </div>
              </div>

              {/* Scrollable Updates Widget */}
              {newsUpdates.length > 0 && (
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg p-5 mx-auto w-full max-w-xs lg:max-w-full">
                  <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100 dark:border-gray-800">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Latest Updates</span>
                  </div>
                  <div className="max-h-40 overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
                    {newsUpdates.map((news) => (
                      <div key={news.id} className="text-sm border-l-2 border-gray-100 dark:border-gray-800 pl-3 py-1 hover:border-indigo-500 transition-colors">
                        <div className="font-bold text-gray-900 dark:text-white leading-tight mb-1">{news.title}</div>
                        <div className="text-xs text-gray-500">{news.period} • {news.subtitle}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 max-w-6xl space-y-24">
        
        {/* --- Research Experience (Polished) --- */}
        <section>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <SectionTitle title="Research Experience" />
            <div className="flex bg-gray-100 dark:bg-gray-900 p-1.5 rounded-full self-start md:self-auto">
              <TabButton active={researchTab === 'ongoing'} onClick={() => setResearchTab('ongoing')} label="Ongoing" />
              <TabButton active={researchTab === 'completed'} onClick={() => setResearchTab('completed')} label="Completed" />
            </div>
          </div>

          <div className="grid gap-6">
            <AnimatePresence mode="wait">
              {filteredResearch.length > 0 ? (
                filteredResearch.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="group relative bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-8 hover:shadow-2xl transition-all duration-300 overflow-hidden"
                  >
                    {/* Decorative Gradient Blob */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/10 transition-colors"></div>

                    <div className="relative z-10 flex flex-col lg:flex-row gap-8">
                      {/* Image / Logo Area */}
                      <div className="flex-shrink-0">
                        <div className="w-24 h-24 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm">
                          {item.details?.image ? (
                            <img src={item.details.image} alt={item.organization} className="w-full h-full object-cover" />
                          ) : (
                            <Building2 className="text-gray-300" size={40} />
                          )}
                        </div>
                      </div>

                      {/* Main Content */}
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                          <div>
                             <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors leading-tight">
                              {item.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-2 text-sm font-medium text-gray-500">
                               <Briefcase size={14} /> {item.subtitle} <span className="text-gray-300">•</span> <span className="text-indigo-600 dark:text-indigo-400">{item.organization}</span>
                            </div>
                          </div>
                          <span className={`self-start md:self-auto px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border ${
                            researchTab === 'ongoing' 
                              ? 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/30' 
                              : 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30'
                          }`}>
                            {item.period}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8 text-base">
                          {item.description}
                        </p>

                        {/* Metadata Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-800 flex items-center gap-4">
                              <div className="p-2.5 bg-white dark:bg-gray-800 rounded-lg shadow-sm text-indigo-500">
                                <UserCircle size={20} />
                              </div>
                              <div>
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Advisor</div>
                                <div className="text-sm font-bold text-gray-900 dark:text-white">{item.details?.advisor || 'N/A'}</div>
                              </div>
                           </div>
                           <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-800 flex items-center gap-4">
                              <div className="p-2.5 bg-white dark:bg-gray-800 rounded-lg shadow-sm text-indigo-500">
                                <Users size={20} />
                              </div>
                              <div>
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Team</div>
                                <div className="text-sm font-bold text-gray-900 dark:text-white">{item.details?.team?.join(', ') || 'N/A'}</div>
                              </div>
                           </div>
                        </div>

                        {/* Links for Completed */}
                        {researchTab === 'completed' && (item.details?.links?.scholar || item.details?.links?.paper) && (
                          <div className="mt-8 flex gap-3">
                            {item.details.links.scholar && (
                              <a href={item.details.links.scholar} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity shadow-lg shadow-gray-900/10">
                                <BookOpen size={16} /> Google Scholar
                              </a>
                            )}
                            {item.details.links.paper && (
                              <a href={item.details.links.paper} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <ExternalLink size={16} /> Read Paper
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
                  No {researchTab} research items found.
                </div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* --- Projects Section --- */}
        <section>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <SectionTitle title="Projects" />
            <div className="flex bg-gray-100 dark:bg-gray-900 p-1.5 rounded-full self-start md:self-auto">
              <TabButton active={projectTab === 'Industry'} onClick={() => setProjectTab('Industry')} label="Industry / Competition" />
              <TabButton active={projectTab === 'Course'} onClick={() => setProjectTab('Course')} label="Course Projects" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatePresence mode="wait">
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-xl hover:border-indigo-500/30 transition-all flex flex-col"
                  >
                    {/* Header Gradient */}
                    <div className={`h-2 w-full bg-gradient-to-r ${project.details?.imageGradient || 'from-gray-500 to-gray-600'}`}></div>
                    
                    <div className="p-8 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-6">
                        <div className={`p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white`}>
                          <Code2 size={24} />
                        </div>
                        <div className="flex gap-2">
                          {project.details?.links?.github && (
                            <a href={project.details.links.github} className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors" title="View Code">
                              <Github size={20} />
                            </a>
                          )}
                          {project.details?.links?.demo && (
                            <a href={project.details.links.demo} className="p-2 text-gray-400 hover:text-indigo-600 transition-colors" title="Live Demo">
                              <ExternalLink size={20} />
                            </a>
                          )}
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 flex-1">
                        {project.description}
                      </p>

                      <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex flex-wrap gap-2">
                          {project.details?.tags?.map(t => (
                            <span key={t} className="px-2 py-1 text-xs font-bold text-gray-500 bg-gray-50 dark:bg-gray-800 rounded border border-gray-100 dark:border-gray-700">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-2 text-center py-12 text-gray-500 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
                  No {projectTab} projects found.
                </div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* --- Experience & Education (Side-by-Side) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Work Experience */}
          {experience.length > 0 && (
            <section>
              <SectionTitle title="Work Experience" />
              <div className="space-y-6">
                {experience.map((job) => (
                  <div key={job.id} className="group bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-indigo-500/30 hover:shadow-lg transition-all">
                    <div className="flex gap-5">
                      {/* Company Logo Placeholder */}
                      <div className="flex-shrink-0">
                        <div className="w-14 h-14 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 border border-gray-200 dark:border-gray-700 group-hover:border-indigo-200 dark:group-hover:border-indigo-800 transition-colors">
                          {job.details?.image ? (
                             <img src={job.details.image} alt={job.organization} className="w-full h-full object-cover rounded-xl" />
                          ) : (
                             <Building2 size={20} />
                          )}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                          {job.title}
                        </h3>
                        <div className="text-sm font-medium text-gray-500 mb-2">{job.organization}</div>
                        <span className="inline-block text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded mb-3">
                          {job.period}
                        </span>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                          {job.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section>
              <SectionTitle title="Education" />
              <div className="space-y-6">
                {education.map((edu) => (
                  <div key={edu.id} className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-purple-500/30 transition-colors flex gap-5">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/30">
                        <GraduationCap size={20} />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{edu.organization}</h3>
                      <div className="text-purple-600 dark:text-purple-400 font-medium text-sm mb-1">{edu.title}</div>
                      <div className="text-xs text-gray-500 mb-3">{edu.period} • {edu.subtitle}</div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{edu.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* --- Honors & Leadership (Distinct Sections) --- */}
        {(honors.length > 0 || leadership.length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Honors */}
            {honors.length > 0 && (
              <section>
                <SectionTitle title="Honors & Awards" />
                <div className="space-y-4">
                  {honors.map(item => (
                    <div key={item.id} className="bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-amber-400/50 hover:shadow-lg transition-all group">
                      <div className="flex gap-4">
                        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-500 rounded-lg h-fit group-hover:scale-110 transition-transform">
                          <Trophy size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-amber-600 transition-colors">{item.title}</h4>
                          <p className="text-sm text-gray-500 mb-1">{item.organization}</p>
                          <span className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-gray-600 dark:text-gray-400">{item.period}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Leadership */}
            {leadership.length > 0 && (
              <section>
                <SectionTitle title="Leadership" />
                <div className="space-y-4">
                  {leadership.map(item => (
                    <div key={item.id} className="bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-400/50 hover:shadow-lg transition-all group">
                      <div className="flex gap-4">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-500 rounded-lg h-fit group-hover:scale-110 transition-transform">
                          <Users size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{item.title}</h4>
                          <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium mb-2">{item.organization}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

// --- Sub-components ---

const SocialLink = ({ href, icon }: { href: string, icon: any }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 dark:hover:text-white transition-colors">
    {icon}
  </a>
);
