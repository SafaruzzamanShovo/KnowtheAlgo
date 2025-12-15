import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, BrainCircuit, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    // Check for admin session
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setIsAdmin(!!session);
      });
      
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setIsAdmin(!!session);
      });
      return () => {
        window.removeEventListener('scroll', handleScroll);
        subscription.unsubscribe();
      };
    } else {
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const handleScrollToCurriculum = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/#curriculum');
      setTimeout(() => {
        const element = document.getElementById('curriculum');
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById('curriculum');
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const navLinks = [
    { name: 'Learning Paths', action: handleScrollToCurriculum, path: '/#curriculum' },
    { name: 'Community', path: '/community' },
    { name: "Let's Collaborate", path: '/collaborate' },
  ];

  return (
    <header 
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-500",
        scrolled 
          ? "py-3 bg-white/70 dark:bg-gray-950/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm" 
          : "py-6 bg-transparent"
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group relative z-50">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-20 group-hover:opacity-50 transition-opacity rounded-full duration-500"></div>
            <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 dark:from-indigo-600 dark:to-violet-600 p-2.5 rounded-xl text-white shadow-lg group-hover:scale-105 transition-transform duration-300 border border-white/10">
              <BrainCircuit size={22} />
            </div>
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
            Knowthe<span className="text-indigo-600 dark:text-indigo-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Algo</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-2">
          <div className="flex items-center p-1 rounded-full bg-gray-100/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-800/50 backdrop-blur-sm">
            {navLinks.map((link) => {
              const isActive = link.path === location.pathname || (link.name === 'Learning Paths' && location.hash === '#curriculum');
              
              return link.action ? (
                <a
                  key={link.name}
                  href={link.path}
                  onClick={link.action}
                  className={cn(
                    "px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 relative",
                    isActive 
                      ? "text-indigo-600 dark:text-indigo-300 bg-white dark:bg-gray-800 shadow-sm" 
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-gray-800/50"
                  )}
                >
                  {link.name}
                </a>
              ) : (
                <Link 
                  key={link.name}
                  to={link.path}
                  className={cn(
                    "px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 relative",
                    isActive 
                      ? "text-indigo-600 dark:text-indigo-300 bg-white dark:bg-gray-800 shadow-sm" 
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-gray-800/50"
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
            
            {/* Admin Link - Only visible if logged in */}
            {isAdmin && (
              <Link 
                to="/admin"
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 relative flex items-center gap-1",
                  location.pathname === '/admin'
                    ? "text-indigo-600 dark:text-indigo-300 bg-white dark:bg-gray-800 shadow-sm" 
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-gray-800/50"
                )}
              >
                <ShieldCheck size={14} />
                <span>Admin</span>
              </Link>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-gray-600 dark:text-gray-300 z-50"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 w-full h-screen bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl pt-24 px-6 md:hidden flex flex-col gap-6 z-40"
          >
            {navLinks.map((link, idx) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                {link.action ? (
                  <a 
                    href={link.path}
                    onClick={link.action}
                    className="block text-3xl font-bold text-gray-900 dark:text-white py-4 border-b border-gray-100 dark:border-gray-800"
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link 
                    to={link.path} 
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-3xl font-bold text-gray-900 dark:text-white py-4 border-b border-gray-100 dark:border-gray-800"
                  >
                    {link.name}
                  </Link>
                )}
              </motion.div>
            ))}
             {isAdmin && (
               <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Link 
                  to="/admin" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-3xl font-bold text-indigo-600 dark:text-indigo-400 py-4 border-b border-gray-100 dark:border-gray-800"
                >
                  Admin Panel
                </Link>
              </motion.div>
             )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
