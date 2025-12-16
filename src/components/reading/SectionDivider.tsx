import React from 'react';
import { motion } from 'framer-motion';

export const SectionDivider = () => {
  return (
    <div className="flex items-center justify-center py-16 opacity-50">
      <motion.div 
        initial={{ width: 0, opacity: 0 }}
        whileInView={{ width: 100, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent w-24"
      />
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="mx-4 w-1.5 h-1.5 rounded-full bg-indigo-500"
      />
      <motion.div 
        initial={{ width: 0, opacity: 0 }}
        whileInView={{ width: 100, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent w-24"
      />
    </div>
  );
};
