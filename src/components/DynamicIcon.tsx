import React from 'react';
import * as LucideIcons from 'lucide-react';
import { LucideProps } from 'lucide-react';

interface DynamicIconProps extends LucideProps {
  name: string;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, ...props }) => {
  // Access the icon from the LucideIcons object using the name key
  // We cast to any because we're dynamically accessing exports
  const IconComponent = (LucideIcons as any)[name];

  if (!IconComponent) {
    // Fallback if icon not found
    return <LucideIcons.HelpCircle {...props} />;
  }

  return <IconComponent {...props} />;
};
