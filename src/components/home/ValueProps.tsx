import React from 'react';
import { motion } from 'framer-motion';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import { DynamicIcon } from '../DynamicIcon';

export const ValueProps = () => {
  const { valueProps } = useSiteSettings();

  return (
    <section className="py-12 border-y border-gray-100 dark:border-gray-900 bg-gray-50/50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {valueProps.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col items-center text-center md:items-start md:text-left p-4 rounded-2xl hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
                <DynamicIcon name={item.icon} size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
