import React from 'react';
import { AboutSettings, PortfolioItem } from '../../types';

interface CVTemplateProps {
  settings: AboutSettings;
  items: PortfolioItem[];
}

// This component is rendered off-screen or in a hidden div for PDF generation
export const CVTemplate: React.FC<CVTemplateProps> = ({ settings, items }) => {
  const education = items.filter(i => i.section === 'education');
  const experience = items.filter(i => i.section === 'experience');
  const projects = items.filter(i => i.section === 'project').slice(0, 4);
  const research = items.filter(i => i.section === 'research').slice(0, 3);
  const skills = settings.skills;

  return (
    <div id="cv-template" className="bg-white text-gray-900 p-12 max-w-[800px] mx-auto hidden">
      {/* Header */}
      <header className="border-b-2 border-gray-900 pb-6 mb-6">
        <h1 className="text-3xl font-bold uppercase tracking-wide mb-2">{settings.name}</h1>
        <div className="text-lg font-medium text-gray-600 mb-4">{settings.role}</div>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          {settings.socials?.email && <span>{settings.socials.email.replace('mailto:', '')}</span>}
          {settings.socials?.linkedin && <span>{settings.socials.linkedin}</span>}
          {settings.socials?.github && <span>{settings.socials.github}</span>}
        </div>
      </header>

      {/* Summary */}
      <section className="mb-6">
        <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-300 mb-3 pb-1">Professional Summary</h2>
        <p className="text-sm leading-relaxed text-gray-700">{settings.bio}</p>
      </section>

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-300 mb-3 pb-1">Experience</h2>
          <div className="space-y-4">
            {experience.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-base">{exp.title}</h3>
                  <span className="text-xs text-gray-500 font-medium">{exp.period}</span>
                </div>
                <div className="text-sm font-medium text-gray-700 mb-1">{exp.organization}</div>
                <p className="text-sm text-gray-600 leading-snug">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-300 mb-3 pb-1">Key Projects</h2>
          <div className="space-y-4">
            {projects.map(proj => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-base">{proj.title}</h3>
                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">{proj.details?.type}</span>
                </div>
                <p className="text-sm text-gray-600 leading-snug mb-1">{proj.description}</p>
                <div className="text-xs text-gray-500 italic">Tech: {proj.details?.tags?.join(', ')}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      <section className="mb-6">
        <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-300 mb-3 pb-1">Technical Skills</h2>
        <div className="text-sm text-gray-700 leading-relaxed">
          {skills.join(' • ')}
        </div>
      </section>

      {/* Education */}
      {education.length > 0 && (
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-300 mb-3 pb-1">Education</h2>
          <div className="space-y-3">
            {education.map(edu => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-base">{edu.organization}</h3>
                  <span className="text-xs text-gray-500">{edu.period}</span>
                </div>
                <div className="text-sm text-gray-700">{edu.title}</div>
                <div className="text-xs text-gray-600">{edu.subtitle}</div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
