import React from 'react';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { usePortfolio } from '../hooks/usePortfolio';
import { PortfolioNav } from '../components/portfolio/PortfolioNav';
import { PortfolioHero } from '../components/portfolio/PortfolioHero';
import { ResearchSection } from '../components/portfolio/ResearchSection';
import { ProjectsGrid } from '../components/portfolio/ProjectsGrid';
import { TimelineSection } from '../components/portfolio/TimelineSection';
import { SkillsSection } from '../components/portfolio/SkillsSection';
import { AchievementsSection } from '../components/portfolio/AchievementsSection';
import { RecruiterModeProvider, useRecruiterMode } from '../context/RecruiterModeContext';
import { RecruiterToggle } from '../components/portfolio/RecruiterToggle';
import { QuickScanHeader } from '../components/portfolio/QuickScanHeader';
import { AISummarySection } from '../components/portfolio/AISummarySection';
import { SEOHead } from '../components/seo/SEOHead';
import { CVTemplate } from '../components/portfolio/CVTemplate';

// Wrapper to provide context
export const About = () => (
  <RecruiterModeProvider>
    <AboutContent />
  </RecruiterModeProvider>
);

const AboutContent = () => {
  const { aboutSettings, loading: settingsLoading } = useSiteSettings();
  const { items, getSection, loading: portfolioLoading } = usePortfolio();
  const { isRecruiterMode } = useRecruiterMode();

  // Prevent flash of default content
  if (settingsLoading || portfolioLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 font-sans selection:bg-indigo-500 selection:text-white">
      <SEOHead 
        title={`${aboutSettings.name} - Portfolio`}
        description={aboutSettings.bio}
        image={aboutSettings.image}
        type="profile"
        keywords={aboutSettings.skills}
        author={aboutSettings.name}
      />

      <RecruiterToggle />
      
      {/* Hidden CV Template for Export */}
      <CVTemplate settings={aboutSettings} items={items} />

      {isRecruiterMode ? (
        <>
          <QuickScanHeader settings={aboutSettings} items={items} />
          <AISummarySection settings={aboutSettings} items={items} />
          <main className="space-y-4">
             {/* Reordered for Recruiters: Skills -> Projects -> Research -> Exp */}
             <SkillsSection skills={aboutSettings.skills || []} />
             <ProjectsGrid items={getSection('project')} />
             <ResearchSection items={getSection('research')} />
             <TimelineSection 
              experience={getSection('experience')} 
              education={getSection('education')} 
            />
            <AchievementsSection 
              honors={getSection('honor')} 
              leadership={getSection('leadership')} 
            />
          </main>
        </>
      ) : (
        <>
          <PortfolioNav />
          <main>
            <PortfolioHero settings={aboutSettings} />
            <ResearchSection items={getSection('research')} />
            <ProjectsGrid items={getSection('project')} />
            <TimelineSection 
              experience={getSection('experience')} 
              education={getSection('education')} 
            />
            <AchievementsSection 
              honors={getSection('honor')} 
              leadership={getSection('leadership')} 
            />
            <SkillsSection skills={aboutSettings.skills || []} />
          </main>
        </>
      )}
    </div>
  );
};
