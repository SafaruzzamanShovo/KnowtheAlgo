import React from 'react';
import { motion } from 'framer-motion';
import { Info, AlertTriangle, CheckCircle2, Flame } from 'lucide-react';

type CalloutType = 'note' | 'warning' | 'tip' | 'danger';

interface CalloutProps {
  type?: CalloutType;
  children: React.ReactNode;
}

const styles = {
  note: {
    bg: 'bg-blue-50 dark:bg-blue-900/10',
    border: 'border-blue-500',
    icon: <Info className="text-blue-500" size={20} />,
    title: 'Note',
    text: 'text-blue-900 dark:text-blue-100'
  },
  warning: {
    bg: 'bg-amber-50 dark:bg-amber-900/10',
    border: 'border-amber-500',
    icon: <AlertTriangle className="text-amber-500" size={20} />,
    title: 'Warning',
    text: 'text-amber-900 dark:text-amber-100'
  },
  tip: {
    bg: 'bg-emerald-50 dark:bg-emerald-900/10',
    border: 'border-emerald-500',
    icon: <CheckCircle2 className="text-emerald-500" size={20} />,
    title: 'Pro Tip',
    text: 'text-emerald-900 dark:text-emerald-100'
  },
  danger: {
    bg: 'bg-red-50 dark:bg-red-900/10',
    border: 'border-red-500',
    icon: <Flame className="text-red-500" size={20} />,
    title: 'Critical',
    text: 'text-red-900 dark:text-red-100'
  }
};

export const Callout: React.FC<CalloutProps> = ({ type = 'note', children }) => {
  const style = styles[type] || styles.note;

  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className={`${style.bg} border-l-4 ${style.border} p-5 rounded-r-xl my-6 flex gap-4 shadow-sm`}
    >
      <div className="flex-shrink-0 mt-0.5">
        {style.icon}
      </div>
      <div className="flex-1">
        <h5 className={`font-bold text-sm uppercase tracking-wide mb-1 opacity-80 ${style.text}`}>
          {style.title}
        </h5>
        <div className={`text-base leading-relaxed ${style.text} opacity-90`}>
          {children}
        </div>
      </div>
    </motion.div>
  );
};
