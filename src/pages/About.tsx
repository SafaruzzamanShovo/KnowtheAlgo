import React from 'react';
import { Github, Linkedin, Mail, BookOpen, Download, ExternalLink } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { usePortfolio } from '../hooks/usePortfolio';

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

  const sections = [
    { id: 'news', title: 'News & Updates' },
    { id: 'research', title: 'Research Experience' },
    { id: 'project', title: 'Projects' },
    { id: 'experience', title: 'Work Experience' },
    { id: 'education', title: 'Education' },
    { id: 'honor', title: 'Honors & Awards' },
    { id: 'leadership', title: 'Leadership' }
  ];

  const getItems = (section: string) => items.filter(i => i.section === section);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Hero Section */}
        <section className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-16 border-b border-gray-100 dark:border-gray-800 pb-12">
          <img 
            src={aboutSettings.image} 
            alt={aboutSettings.name} 
            className="w-40 h-40 rounded-2xl object-cover shadow-lg flex-shrink-0"
          />
          <div className="text-center md:text-left flex-1">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{aboutSettings.name}</h1>
            <p className="text-xl text-indigo-600 dark:text-indigo-400 font-medium mb-4">{aboutSettings.role}</p>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed max-w-2xl text-lg">
              {aboutSettings.bio}
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center md:justify-start items-center">
              {aboutSettings.socials?.email && (
                <a href={aboutSettings.socials.email} className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" title="Email">
                  <Mail size={24} />
                </a>
              )}
              {aboutSettings.socials?.github && (
                <a href={aboutSettings.socials.github} className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" title="GitHub">
                  <Github size={24} />
                </a>
              )}
              {aboutSettings.socials?.linkedin && (
                <a href={aboutSettings.socials.linkedin} className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" title="LinkedIn">
                  <Linkedin size={24} />
                </a>
              )}
              {aboutSettings.socials?.scholar && (
                <a href={aboutSettings.socials.scholar} className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" title="Google Scholar">
                  <BookOpen size={24} />
                </a>
              )}
              {aboutSettings.resume_link && (
                <a 
                  href={aboutSettings.resume_link} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-medium hover:opacity-90 transition-opacity ml-2"
                >
                  <Download size={18} /> Resume
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Portfolio Sections */}
        <div className="space-y-16">
          {sections.map(section => {
            const sectionItems = getItems(section.id);
            if (sectionItems.length === 0) return null;

            return (
              <section key={section.id}>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                  {section.title}
                  <div className="h-px bg-gray-200 dark:bg-gray-800 flex-1"></div>
                </h2>
                
                <div className="space-y-8">
                  {sectionItems.map(item => (
                    <div key={item.id} className="group">
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                          {item.title}
                        </h3>
                        {item.period && (
                          <span className="text-sm font-medium text-gray-500 whitespace-nowrap font-mono">{item.period}</span>
                        )}
                      </div>
                      
                      <div className="text-base font-medium text-indigo-600 dark:text-indigo-400 mb-3">
                        {item.subtitle} {item.organization && <span className="text-gray-400 dark:text-gray-600">• {item.organization}</span>}
                      </div>

                      {item.description && (
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4 max-w-3xl">
                          {item.description}
                        </p>
                      )}

                      {/* Details / Tags / Links */}
                      {(item.details?.tags || item.details?.links) && (
                        <div className="flex flex-wrap gap-4 items-center mt-2">
                          {item.details.tags && (
                            <div className="flex flex-wrap gap-2">
                              {item.details.tags.map(tag => (
                                <span key={tag} className="px-2.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-md font-medium">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                          
                          {item.details.links && (
                            <div className="flex gap-3">
                              {Object.entries(item.details.links).map(([key, url]) => (
                                <a 
                                  key={key} 
                                  href={url} 
                                  className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline uppercase tracking-wide"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {key} <ExternalLink size={10} />
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
};
