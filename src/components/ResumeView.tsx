import React from 'react';
import { useResume } from '@/contexts/ResumeContext';
import ResumeHeader from './ResumeHeader';
import ExperienceCard from './ExperienceCard';
import ProjectCard from './ProjectCard';
import SkillBar from './SkillBar';
import { GraduationCap } from 'lucide-react';

const ResumeView: React.FC = () => {
  const { resume, customization } = useResume();

  const spacingClass = customization.spacing === 'compact' ? 'space-y-3' : customization.spacing === 'relaxed' ? 'space-y-8' : 'space-y-5';

  const sectionTitle = (title: string) => {
    const isGlow = customization.theme === 'cyberpunk' || customization.theme === 'hacker';
    const prefix = customization.theme === 'hacker' ? '## ' : '';
    return (
      <h2 className={`text-lg font-bold uppercase tracking-wider ${isGlow ? 'glow-text' : ''}`}
        style={{
          color: 'hsl(var(--resume-heading))',
          ...(customization.accentStyle === 'underline' ? { borderBottom: '2px solid hsl(var(--resume-accent))', paddingBottom: '0.25rem' } : {}),
        }}
      >
        {prefix}{title}
      </h2>
    );
  };

  const renderSection = (key: string) => {
    switch (key) {
      case 'summary':
        return (
          <div key={key}>
            {sectionTitle('Summary')}
            <p className="text-sm leading-relaxed mt-2" style={{ color: 'hsl(var(--resume-text))' }}>
              {customization.theme === 'hacker' ? `> ${resume.summary}` : resume.summary}
            </p>
          </div>
        );
      case 'experience':
        return (
          <div key={key} className="space-y-3">
            {sectionTitle('Experience')}
            {resume.experience.map((exp, i) => (
              <ExperienceCard key={i} exp={exp} index={i} />
            ))}
          </div>
        );
      case 'skills':
        return (
          <div key={key}>
            {sectionTitle('Skills')}
            <div className={`mt-2 ${customization.layout === 'split' ? 'grid grid-cols-2 gap-3' : 'space-y-3'}`}>
              {resume.skills.map((skill, i) => (
                <SkillBar key={i} skill={skill} showDetails={customization.mode !== 'recruiter'} />
              ))}
            </div>
          </div>
        );
      case 'projects':
        if (customization.mode === 'recruiter' && resume.projects.length > 3) {
          return (
            <div key={key} className="space-y-3">
              {sectionTitle('Key Projects')}
              {resume.projects.slice(0, 2).map((p, i) => (
                <ProjectCard key={i} project={p} />
              ))}
            </div>
          );
        }
        return (
          <div key={key} className="space-y-3">
            {sectionTitle('Projects')}
            {resume.projects.map((p, i) => (
              <ProjectCard key={i} project={p} />
            ))}
          </div>
        );
      case 'education':
        return (
          <div key={key}>
            {sectionTitle('Education')}
            {resume.education.map((edu, i) => (
              <div key={i} className="flex items-start gap-3 mt-2">
                <GraduationCap className="w-5 h-5 mt-0.5 shrink-0" style={{ color: 'hsl(var(--resume-accent))' }} />
                <div>
                  <h3 className="font-medium text-sm" style={{ color: 'hsl(var(--resume-heading))' }}>{edu.degree}</h3>
                  <p className="text-sm" style={{ color: 'hsl(var(--resume-text))' }}>{edu.institution}</p>
                  <p className="text-xs" style={{ color: 'hsl(var(--resume-muted))' }}>
                    {edu.period}{edu.gpa ? ` • GPA: ${edu.gpa}` : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  // Split layout: skills on left, rest on right
  if (customization.layout === 'split') {
    const leftSections = ['skills'];
    const rightSections = customization.sectionOrder.filter(s => !leftSections.includes(s));

    return (
      <div
        className="p-6 md:p-8 min-h-screen"
        style={{
          backgroundColor: 'hsl(var(--resume-bg))',
          fontSize: `${customization.fontSize}px`,
          fontFamily: customization.theme === 'hacker' ? "'JetBrains Mono', monospace" : `'${customization.fontFamily}', sans-serif`,
        }}
      >
        <ResumeHeader />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className={`md:col-span-1 ${spacingClass}`}>
            {leftSections.map(renderSection)}
          </div>
          <div className={`md:col-span-2 ${spacingClass}`}>
            {rightSections.map(renderSection)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-6 md:p-8 min-h-screen ${spacingClass}`}
      style={{
        backgroundColor: 'hsl(var(--resume-bg))',
        fontSize: `${customization.fontSize}px`,
        fontFamily: customization.theme === 'hacker' ? "'JetBrains Mono', monospace" : `'${customization.fontFamily}', sans-serif`,
      }}
    >
      <ResumeHeader />
      {customization.sectionOrder.map(renderSection)}
    </div>
  );
};

export default ResumeView;
