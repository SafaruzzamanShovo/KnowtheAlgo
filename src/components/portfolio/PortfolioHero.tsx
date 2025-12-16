import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, BookOpen, Download, ArrowDown } from 'lucide-react';
import { AboutSettings } from '../../types';

interface PortfolioHeroProps {
  settings: AboutSettings;
}

export const PortfolioHero: React.FC<PortfolioHeroProps> = ({ settings }) => {
  return (
    <section id="profile" className="relative min-h-[90vh] flex items-center justify-center pt-20 pb-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100/40 via-transparent to-transparent dark:from-indigo-900/20"></div>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white dark:from-gray-950 to-transparent"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          
          {/* Profile Image with Ring Animation */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="relative mb-8 group"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
            <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full p-1.5 bg-white dark:bg-gray-800 shadow-2xl ring-1 ring-gray-100 dark:ring-gray-700">
              <img 
                src={settings.image} 
                alt={settings.name} 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-2 right-2 bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-full border-4 border-white dark:border-gray-950 shadow-lg"
            >
              OPEN TO WORK
            </motion.div>
          </motion.div>

          {/* Name & Title */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white tracking-tight mb-4">
              {settings.name}
            </h1>
            <p className="text-xl md:text-2xl text-indigo-600 dark:text-indigo-400 font-medium mb-8">
              {settings.role}
            </p>
          </motion.div>

          {/* Bio */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mb-10"
          >
            {settings.bio}
          </motion.p>

          {/* Actions */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-12"
          >
            <a 
              href={settings.socials?.email}
              className="px-8 py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-bold hover:scale-105 transition-transform shadow-xl shadow-gray-900/10 flex items-center gap-2"
            >
              <Mail size={18} /> Contact Me
            </a>
            {settings.resume_link && (
              <a 
                href={settings.resume_link}
                target="_blank"
                rel="noreferrer"
                className="px-8 py-3.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-full font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <Download size={18} /> Resume
              </a>
            )}
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-6 text-gray-400"
          >
            {settings.socials?.github && <SocialIcon href={settings.socials.github} icon={<Github size={24} />} label="GitHub" />}
            {settings.socials?.linkedin && <SocialIcon href={settings.socials.linkedin} icon={<Linkedin size={24} />} label="LinkedIn" />}
            {settings.socials?.scholar && <SocialIcon href={settings.socials.scholar} icon={<BookOpen size={24} />} label="Scholar" />}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ delay: 1, duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-400"
        >
          <ArrowDown size={24} />
        </motion.div>
      </div>
    </section>
  );
};

const SocialIcon = ({ href, icon, label }: { href: string, icon: any, label: string }) => (
  <a 
    href={href}
    target="_blank"
    rel="noreferrer"
    className="hover:text-indigo-600 dark:hover:text-white transition-colors hover:scale-110 transform duration-200"
    title={label}
  >
    {icon}
  </a>
);
