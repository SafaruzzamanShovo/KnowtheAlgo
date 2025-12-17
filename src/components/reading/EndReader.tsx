import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Share2, Check, Twitter, Facebook, Linkedin, Mail, Link as LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { copyToClipboard } from '../../lib/utils';

interface RelatedTopic {
  id: string;
  title: string;
  subjectId: string;
}

interface EndReaderProps {
  relatedTopics?: RelatedTopic[];
}

export const EndReader: React.FC<EndReaderProps> = ({ relatedTopics = [] }) => {
  const [copied, setCopied] = useState(false);
  const url = window.location.href;
  const title = document.title;

  const handleCopyLink = async () => {
    const success = await copyToClipboard(url);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareLinks = [
    { 
      icon: Twitter, 
      label: 'Twitter', 
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      color: 'hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
    },
    { 
      icon: Facebook, 
      label: 'Facebook', 
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      color: 'hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20'
    },
    { 
      icon: Linkedin, 
      label: 'LinkedIn', 
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      color: 'hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20'
    },
    { 
      icon: Mail, 
      label: 'Email', 
      href: `mailto:?subject=${encodeURIComponent(title)}&body=Check this out: ${encodeURIComponent(url)}`,
      color: 'hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-24 pt-12 border-t border-gray-100 dark:border-gray-800"
    >
      <div className="flex flex-col items-center text-center mb-16">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mb-6 animate-pulse">
          <CheckCircle2 size={32} />
        </div>
        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">You've reached the end</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Great job! Share your progress or keep learning.</p>
        
        {/* Share Buttons */}
        <div className="flex flex-wrap justify-center gap-3">
          <button 
            onClick={handleCopyLink}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-95 text-sm"
          >
            {copied ? <Check size={16} /> : <LinkIcon size={16} />}
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
          
          {shareLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2.5 rounded-full bg-gray-50 dark:bg-gray-900 text-gray-400 transition-all ${item.color} border border-gray-100 dark:border-gray-800`}
              title={`Share on ${item.label}`}
            >
              <item.icon size={18} />
            </a>
          ))}
        </div>
      </div>

      {/* Up Next Suggestions */}
      {relatedTopics.length > 0 && (
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800"></div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Up Next in Module</span>
            <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800"></div>
          </div>
          
          <div className="grid gap-4">
            {relatedTopics.map((topic, idx) => (
              <Link 
                key={topic.id}
                to={`/learn/${topic.subjectId}/${topic.id}`}
                className="group block bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 hover:border-indigo-500/50 hover:shadow-xl transition-all relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs text-indigo-600 dark:text-indigo-400 font-bold mb-1 uppercase tracking-wide">
                      {idx === 0 ? 'Next Topic' : 'Coming Up'}
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                      {topic.title}
                    </h4>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 group-hover:bg-indigo-600 group-hover:text-white transition-all flex-shrink-0">
                    <ArrowRight size={20} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};
