import React from 'react';
import { 
  Github, Linkedin, Mail, BookOpen, Download, ExternalLink, 
  MapPin, Calendar, Briefcase, Award, Zap, Layers, GraduationCap, 
  Newspaper, ArrowUpRight
} from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { usePortfolio } from '../hooks/usePortfolio';
import { motion } from 'framer-motion';

export const About = () => {
  const { aboutSettings, loading: settingsLoading } = useSiteSettings();
  const { items, loading: portfolioLoading } = usePortfolio();

  if (settingsLoading || portfolioLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const getItems = (section: string) => items.filter(i => i.section === section);

  const sections = [
    { id: 'news', title: 'Latest Updates', icon: Newspaper, layout: 'list' },
    { id: 'experience', title: 'Work Experience', icon: Briefcase, layout: 'timeline' },
    { id: 'education', title: 'Education', icon: GraduationCap, layout: 'timeline' },
    { id: 'project', title: 'Selected Projects', icon: Zap, layout: 'grid' },
    { id: 'research', title: 'Research', icon: BookOpen, layout: 'grid' },
    { id: 'honor', title: 'Honors & Awards', icon: Award, layout: 'compact' },
    { id: 'leadership', title: 'Leadership', icon: Layers, layout: 'compact' }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-12 items-start">
          
          {/* --- LEFT COLUMN: Sticky Profile --- */}
          <aside className="lg:sticky lg:top-28">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-sm"
            >
              <div className="relative mb-6 group">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <img 
                  src={aboutSettings.image} 
                  alt={aboutSettings.name} 
                  className="relative w-full aspect-square object-cover rounded-2xl shadow-md"
                />
              </div>

              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
                {aboutSettings.name}
              </h1>
              <p className="text-lg text-indigo-600 dark:text-indigo-400 font-medium mb-4">
                {aboutSettings.role}
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6 text-sm">
                {aboutSettings.bio}
              </p>

              {/* Skills Tags */}
              {aboutSettings.skills && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {aboutSettings.skills.map(skill => (
                    <span key={skill} className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-semibold rounded-md">
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              {/* Social Links */}
              <div className="flex flex-col gap-3">
                {aboutSettings.resume_link && (
                  <a 
                    href={aboutSettings.resume_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity mb-2"
                  >
                    <Download size={16} /> Download Resume
                  </a>
                )}
                
                <div className="flex items-center justify-between px-1">
                  {aboutSettings.socials?.github && (
                    <a href={aboutSettings.socials.github} className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors" title="GitHub"><Github size={20} /></a>
                  )}
                  {aboutSettings.socials?.linkedin && (
                    <a href={aboutSettings.socials.linkedin} className="p-2 text-gray-500 hover:text-[#0077b5] transition-colors" title="LinkedIn"><Linkedin size={20} /></a>
                  )}
                  {aboutSettings.socials?.scholar && (
                    <a href={aboutSettings.socials.scholar} className="p-2 text-gray-500 hover:text-indigo-600 transition-colors" title="Google Scholar"><BookOpen size={20} /></a>
                  )}
                  {aboutSettings.socials?.email && (
                    <a href={aboutSettings.socials.email} className="p-2 text-gray-500 hover:text-red-500 transition-colors" title="Email"><Mail size={20} /></a>
                  )}
                </div>
              </div>
            </motion.div>
          </aside>

          {/* --- RIGHT COLUMN: Content Feed --- */}
          <div className="space-y-12">
            {sections.map((section, sectionIdx) => {
              const sectionItems = getItems(section.id);
              if (sectionItems.length === 0) return null;

              return (
                <motion.section 
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: sectionIdx * 0.1 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm text-indigo-600 dark:text-indigo-400">
                      <section.icon size={20} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {section.title}
                    </h2>
                  </div>

                  {/* --- LAYOUT: TIMELINE (Experience/Education) --- */}
                  {section.layout === 'timeline' && (
                    <div className="relative border-l-2 border-gray-200 dark:border-gray-800 ml-4 space-y-8 pl-8 py-2">
                      {sectionItems.map((item) => (
                        <div key={item.id} className="relative group">
                          {/* Timeline Dot */}
                          <div className="absolute -left-[39px] top-1.5 w-5 h-5 rounded-full border-4 border-white dark:border-gray-950 bg-gray-300 dark:bg-gray-700 group-hover:bg-indigo-600 transition-colors"></div>
                          
                          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-indigo-500/30 transition-all hover:shadow-lg">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                              <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{item.title}</h3>
                                <div className="text-indigo-600 dark:text-indigo-400 font-medium text-sm">
                                  {item.organization}
                                </div>
                              </div>
                              {item.period && (
                                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-bold rounded-full whitespace-nowrap">
                                  {item.period}
                                </span>
                              )}
                            </div>
                            
                            {item.subtitle && <div className="text-sm text-gray-500 mb-3 italic">{item.subtitle}</div>}
                            
                            {item.description && (
                              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                                {item.description}
                              </p>
                            )}

                            {item.details?.tags && (
                              <div className="flex flex-wrap gap-2">
                                {item.details.tags.map(tag => (
                                  <span key={tag} className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded border border-gray-100 dark:border-gray-700">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* --- LAYOUT: GRID (Projects/Research) --- */}
                  {section.layout === 'grid' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {sectionItems.map((item) => (
                        <div key={item.id} className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col h-full">
                          <div className="flex justify-between items-start mb-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${item.details?.imageGradient || 'from-gray-700 to-gray-900'}`}>
                              {section.id === 'research' ? <BookOpen size={18} /> : <Zap size={18} />}
                            </div>
                            <div className="flex gap-2">
                              {item.details?.links && Object.entries(item.details.links).map(([key, url]) => (
                                <a 
                                  key={key} 
                                  href={url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                                  title={key}
                                >
                                  <ArrowUpRight size={16} />
                                </a>
                              ))}
                            </div>
                          </div>

                          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 transition-colors">
                            {item.title}
                          </h3>
                          
                          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6 flex-1">
                            {item.description}
                          </p>

                          <div className="flex flex-wrap gap-2 mt-auto">
                            {item.details?.tags?.slice(0, 3).map(tag => (
                              <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-md font-medium">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* --- LAYOUT: LIST (News) --- */}
                  {section.layout === 'list' && (
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800 overflow-hidden">
                      {sectionItems.map((item) => (
                        <div key={item.id} className="p-5 flex items-start gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                          <div className="flex-shrink-0 w-14 text-center">
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">{item.period?.split(' ')[0]}</div>
                            <div className="text-lg font-bold text-gray-900 dark:text-white">{item.period?.split(' ')[1]}</div>
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 dark:text-white text-base">{item.title}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs font-medium px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                                {item.subtitle}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* --- LAYOUT: COMPACT (Honors/Leadership) --- */}
                  {section.layout === 'compact' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {sectionItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
                          <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center text-yellow-600 dark:text-yellow-500 flex-shrink-0">
                            <Award size={20} />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 dark:text-white text-sm">{item.title}</h4>
                            <p className="text-xs text-gray-500">{item.organization} • {item.period}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </motion.section>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
};
