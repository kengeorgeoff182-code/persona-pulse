import React from 'react';
import { useResume } from '@/contexts/ResumeContext';
import ResumeHeader from './ResumeHeader';
import ExperienceCard from './ExperienceCard';
import ProjectCard from './ProjectCard';
import SkillBar from './SkillBar';
import { GraduationCap, Plus, Trash2 } from 'lucide-react';

const ResumeView: React.FC = () => {
  const {
    resume, customization, editMode, updateField,
    addSkill, removeSkill, addExperience, removeExperience,
    addProject, removeProject, addEducation, removeEducation,
    updateEducation,
  } = useResume();

  const spacingClass = customization.spacing === 'compact' ? 'space-y-3' : customization.spacing === 'relaxed' ? 'space-y-8' : 'space-y-5';

  const sectionTitle = (title: string, onAdd?: () => void) => {
    const isGlow = customization.theme === 'cyberpunk' || customization.theme === 'hacker';
    const prefix = customization.theme === 'hacker' ? '## ' : '';
    return (
      <div className="flex items-center justify-between">
        <h2 className={`text-lg font-bold uppercase tracking-wider ${isGlow ? 'glow-text' : ''}`}
          style={{
            color: 'hsl(var(--resume-heading))',
            ...(customization.accentStyle === 'underline' ? { borderBottom: '2px solid hsl(var(--resume-accent))', paddingBottom: '0.25rem' } : {}),
          }}
        >
          {prefix}{title}
        </h2>
        {editMode && onAdd && (
          <button onClick={onAdd} className="flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-primary/10 hover:bg-primary/20 transition-colors" style={{ color: 'hsl(var(--resume-accent))' }}>
            <Plus className="w-3 h-3" /> Add
          </button>
        )}
      </div>
    );
  };

  const renderSection = (key: string) => {
    switch (key) {
      case 'summary':
        return (
          <div key={key}>
            {sectionTitle('Summary')}
            {editMode ? (
              <textarea
                value={resume.summary}
                onChange={e => updateField('summary', e.target.value)}
                className="w-full text-sm leading-relaxed mt-2 bg-transparent border border-dashed border-primary/30 rounded-md p-2 outline-none resize-none min-h-[80px]"
                style={{ color: 'hsl(var(--resume-text))' }}
                placeholder="Write a professional summary..."
              />
            ) : (
              <p className="text-sm leading-relaxed mt-2" style={{ color: 'hsl(var(--resume-text))' }}>
                {customization.theme === 'hacker' ? `> ${resume.summary}` : resume.summary}
              </p>
            )}
          </div>
        );
      case 'experience':
        return (
          <div key={key} className="space-y-3">
            {sectionTitle('Experience', addExperience)}
            {resume.experience.map((exp, i) => (
              <div key={i} className="relative group">
                {editMode && (
                  <button onClick={() => removeExperience(i)} className="absolute -right-2 -top-2 z-10 p-1 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
                <ExperienceCard exp={exp} index={i} />
              </div>
            ))}
          </div>
        );
      case 'skills':
        return (
          <div key={key}>
            {sectionTitle('Skills', addSkill)}
            <div className={`mt-2 ${customization.layout === 'split' ? 'grid grid-cols-2 gap-3' : 'space-y-3'}`}>
              {resume.skills.map((skill, i) => (
                <div key={i} className="relative group">
                  {editMode && (
                    <button onClick={() => removeSkill(i)} className="absolute -right-2 -top-2 z-10 p-1 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                  <SkillBar skill={skill} showDetails={customization.mode !== 'recruiter'} index={i} />
                </div>
              ))}
            </div>
          </div>
        );
      case 'projects':
        if (!editMode && customization.mode === 'recruiter' && resume.projects.length > 3) {
          return (
            <div key={key} className="space-y-3">
              {sectionTitle('Key Projects', addProject)}
              {resume.projects.slice(0, 2).map((p, i) => (
                <ProjectCard key={i} project={p} index={i} />
              ))}
            </div>
          );
        }
        return (
          <div key={key} className="space-y-3">
            {sectionTitle('Projects', addProject)}
            {resume.projects.map((p, i) => (
              <div key={i} className="relative group">
                {editMode && (
                  <button onClick={() => removeProject(i)} className="absolute -right-2 -top-2 z-10 p-1 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
                <ProjectCard project={p} index={i} />
              </div>
            ))}
          </div>
        );
      case 'education':
        return (
          <div key={key}>
            {sectionTitle('Education', addEducation)}
            {resume.education.map((edu, i) => (
              <div key={i} className="flex items-start gap-3 mt-2 relative group">
                {editMode && (
                  <button onClick={() => removeEducation(i)} className="absolute -right-2 -top-2 z-10 p-1 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
                <GraduationCap className="w-5 h-5 mt-0.5 shrink-0" style={{ color: 'hsl(var(--resume-accent))' }} />
                {editMode ? (
                  <div className="flex-1 space-y-1">
                    <input value={edu.degree} onChange={e => updateEducation(i, { degree: e.target.value })} className="font-medium text-sm bg-transparent border-b border-dashed border-primary/30 outline-none w-full" style={{ color: 'hsl(var(--resume-heading))' }} placeholder="Degree" />
                    <input value={edu.institution} onChange={e => updateEducation(i, { institution: e.target.value })} className="text-sm bg-transparent border-b border-dashed border-primary/30 outline-none w-full" style={{ color: 'hsl(var(--resume-text))' }} placeholder="Institution" />
                    <div className="flex gap-2">
                      <input value={edu.period} onChange={e => updateEducation(i, { period: e.target.value })} className="text-xs bg-transparent border-b border-dashed border-primary/30 outline-none" style={{ color: 'hsl(var(--resume-muted))' }} placeholder="Period" />
                      <input value={edu.gpa || ''} onChange={e => updateEducation(i, { gpa: e.target.value })} className="text-xs bg-transparent border-b border-dashed border-primary/30 outline-none" style={{ color: 'hsl(var(--resume-muted))' }} placeholder="GPA" />
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-medium text-sm" style={{ color: 'hsl(var(--resume-heading))' }}>{edu.degree}</h3>
                    <p className="text-sm" style={{ color: 'hsl(var(--resume-text))' }}>{edu.institution}</p>
                    <p className="text-xs" style={{ color: 'hsl(var(--resume-muted))' }}>
                      {edu.period}{edu.gpa ? ` • GPA: ${edu.gpa}` : ''}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

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
