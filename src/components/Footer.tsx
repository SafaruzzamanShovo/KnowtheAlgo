import React from 'react';
import { Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="py-8 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
      <div className="container mx-auto px-4 text-center">
        <p className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 text-sm font-medium">
          Made with <Heart size={14} className="text-red-500 fill-red-500" /> by Safaruzzaman Shovo
        </p>
        <p className="text-xs text-gray-400 mt-2">
          &copy; {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </footer>
  );
};
