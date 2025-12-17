import React from 'react';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { SEOHead } from '../components/seo/SEOHead';
import { AcademicLanding } from '../components/portfolio/AcademicLanding';

export const About = () => {
  const { aboutSettings, loading } = useSiteSettings();

  if (loading) {
    return (
       <div className="min-h-screen flex items-center justify-center bg-zinc-950">
         <div className="animate-spin w-6 h-6 border-2 border-zinc-600 border-t-transparent rounded-full"></div>
       </div>
    );
  }

  return (
    // Dark background for Modern Architectural look
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 sm:p-8 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
       <SEOHead 
         title={`${aboutSettings.name} - Portfolio`}
         description={aboutSettings.bio}
         image={aboutSettings.image}
         type="profile"
       />
       
       <main className="w-full">
         <AcademicLanding settings={aboutSettings} />
       </main>
    </div>
  );
};
