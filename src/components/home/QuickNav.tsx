import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code2, MessageSquare, PenTool, ArrowUpRight } from 'lucide-react';

const navItems = [
  {
    icon: Code2,
    title: "Browse All Courses",
    desc: "Explore Full Curriculum",
    link: "/courses",
    color: "bg-blue-500"
  },
  {
    icon: MessageSquare,
    title: "Join Community",
    desc: "Read Discussions",
    link: "/community",
    color: "bg-purple-500"
  },
  {
    icon: PenTool,
    title: "Let's Collaborate",
    desc: "Work Together",
    link: "/collaborate",
    color: "bg-rose-500"
  }
];

export const QuickNav = () => {
  return (
    <section className="py-24 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">What do you want to do?</h2>
          <p className="text-gray-500 dark:text-gray-400">Direct shortcuts to the most important sections.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {navItems.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link to={item.link} className="group block h-full">
                <NavCardContent item={item} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const NavCardContent = ({ item }: { item: typeof navItems[0] }) => (
  <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-indigo-500/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden h-full flex flex-col">
    <div className="flex justify-between items-start mb-4">
      <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
        <item.icon size={24} />
      </div>
      <ArrowUpRight size={20} className="text-gray-300 group-hover:text-indigo-500 transition-colors" />
    </div>
    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{item.title}</h3>
    <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
  </div>
);
