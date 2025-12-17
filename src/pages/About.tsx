import React from 'react';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { SEOHead } from '../components/seo/SEOHead';
import { AcademicLanding } from '../components/portfolio/AcademicLanding';

export const About = () => {
  const { aboutSettings, loading } = useSiteSettings();

  if (loading) {
    return (
       <div className="min-h-screen flex items-center justify-center bg-[#F5F5F4]">
         <div className="animate-spin w-6 h-6 border-2 border-slate-400 border-t-transparent rounded-full"></div>
       </div>
    );
  }

  return (
    // Warm off-white background for academic feel
    <div className="min-h-screen bg-[#F5F5F4] dark:bg-[#F5F5F4] flex items-center justify-center p-4 sm:p-8 font-sans selection:bg-slate-200 selection:text-slate-900">
       <SEOHead 
         title={`${aboutSettings.name} - Academic Profile`}
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
