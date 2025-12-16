import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, BookOpen, Download, ArrowDown, MapPin, Link as LinkIcon } from 'lucide-react';
import { AboutSettings } from '../../types';

interface PortfolioHeroProps {
  settings: AboutSettings;
}

export const PortfolioHero: React.FC<PortfolioHeroProps> = ({ settings }) => {
  return (
    <section id="profile" className="relative min-h-[85vh] flex items-center justify-center py-20 overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-white dark:bg-gray-950">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(0,0,0,0))]"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-12">
            
            {/* Left Column: Profile Card */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full md:w-1/3 flex-shrink-0"
            >
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl relative overflow-hidden group">
                {/* Glow Effect */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-500/30 transition-colors duration-500"></div>
                
                <div className="relative">
                  <div className="w-full aspect-square rounded-2xl overflow-hidden mb-6 ring-1 ring-gray-100 dark:ring-gray-700 shadow-inner">
                    <img 
                      src={settings.image} 
                      alt={settings.name} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-1">{settings.name}</h2>
                  <p className="text-indigo-600 dark:text-indigo-400 font-medium mb-4">{settings.role}</p>
                  
                  <div className="space-y-2 mb-6 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} />
                      <span>San Francisco, CA</span> {/* Could be dynamic if added to settings */}
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={14} />
                      <a href={settings.socials?.email} className="hover:text-indigo-600 transition-colors">
                        {settings.socials?.email?.replace('mailto:', '') || 'Contact Me'}
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-center">
                    {settings.socials?.github && <SocialButton href={settings.socials.github} icon={Github} />}
                    {settings.socials?.linkedin && <SocialButton href={settings.socials.linkedin} icon={Linkedin} />}
                    {settings.socials?.scholar && <SocialButton href={settings.socials.scholar} icon={BookOpen} />}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Bio & Content */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex-1 text-center md:text-left pt-4"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                Available for opportunities
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 leading-tight tracking-tight">
                Building the future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Intelligent Systems</span>.
              </h1>

              <div className="prose prose-lg dark:prose-invert text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-none" dangerouslySetInnerHTML={{ __html: settings.bio }} />

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <a 
                  href="#projects"
                  className="px-8 py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold hover:translate-y-[-2px] hover:shadow-lg transition-all flex items-center gap-2"
                >
                  View Work <ArrowDown size={18} />
                </a>
                {settings.resume_link && (
                  <a 
                    href={settings.resume_link}
                    target="_blank"
                    rel="noreferrer"
                    className="px-8 py-3.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                  >
                    <Download size={18} /> Resume
                  </a>
                )}
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
};

const SocialButton = ({ href, icon: Icon }: { href: string, icon: any }) => (
  <a 
    href={href}
    target="_blank"
    rel="noreferrer"
    className="p-3 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all border border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800"
  >
    <Icon size={20} />
  </a>
);
