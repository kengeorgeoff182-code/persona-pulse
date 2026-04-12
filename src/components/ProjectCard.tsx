import React, { useState } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { Project } from '@/types/resume';
import { ExternalLink, Github, ChevronDown, ChevronUp, Code } from 'lucide-react';

const ProjectCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
  const { customization, editMode, updateProject } = useResume();
  const [expanded, setExpanded] = useState(false);
  const isGlow = customization.accentStyle === 'glow' || customization.theme === 'cyberpunk' || customization.theme === 'hacker';

  const cardClass = customization.cardStyle === 'glass' ? 'glass' : customization.cardStyle === 'sharp' ? '' : 'rounded-lg';
  const borderRadius = customization.cardStyle === 'rounded' ? '0.5rem' : customization.cardStyle === 'sharp' ? '0' : '0.75rem';

  const updateTech = (val: string) => updateProject(index, { techStack: val.split(',').map(s => s.trim()).filter(Boolean) });

  return (
    <div
      className={`p-4 border transition-all ${cardClass} ${isGlow ? 'glow-border' : ''}`}
      style={{ borderRadius, backgroundColor: 'hsl(var(--resume-card))', borderColor: 'hsl(var(--resume-border))' }}
    >
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {editMode ? (
              <div className="space-y-1" onClick={e => e.stopPropagation()}>
                <input value={project.name} onChange={e => updateProject(index, { name: e.target.value })} className="font-semibold bg-transparent border-b border-dashed border-primary/30 outline-none w-full" style={{ color: 'hsl(var(--resume-heading))' }} placeholder="Project name" />
                <textarea value={project.description} onChange={e => updateProject(index, { description: e.target.value })} className="text-sm mt-1 bg-transparent border border-dashed border-primary/30 outline-none w-full resize-none rounded p-1" style={{ color: 'hsl(var(--resume-text))' }} placeholder="Description" rows={2} />
              </div>
            ) : (
              <div>
                <h3 className="font-semibold" style={{ color: 'hsl(var(--resume-heading))' }}>{project.name}</h3>
                <p className="text-sm mt-1" style={{ color: 'hsl(var(--resume-text))' }}>{project.description}</p>
              </div>
            )}
          </div>
          {!editMode && (expanded ? <ChevronUp className="w-4 h-4 shrink-0" style={{ color: 'hsl(var(--resume-muted))' }} /> : <ChevronDown className="w-4 h-4 shrink-0" style={{ color: 'hsl(var(--resume-muted))' }} />)}
        </div>
      </button>

      {editMode ? (
        <div className="mt-2 space-y-2">
          <div>
            <label className="text-xs" style={{ color: 'hsl(var(--resume-muted))' }}>Tech stack (comma-separated)</label>
            <input value={project.techStack.join(', ')} onChange={e => updateTech(e.target.value)} className="w-full text-xs bg-transparent border-b border-dashed border-primary/30 outline-none mt-1" style={{ color: 'hsl(var(--resume-accent))' }} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input value={project.githubUrl || ''} onChange={e => updateProject(index, { githubUrl: e.target.value })} className="text-xs bg-transparent border-b border-dashed border-primary/30 outline-none" style={{ color: 'hsl(var(--resume-accent))' }} placeholder="GitHub URL" />
            <input value={project.demoUrl || ''} onChange={e => updateProject(index, { demoUrl: e.target.value })} className="text-xs bg-transparent border-b border-dashed border-primary/30 outline-none" style={{ color: 'hsl(var(--resume-accent))' }} placeholder="Demo URL" />
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-1 mt-2">
            {project.techStack.map(t => (
              <span key={t} className="text-xs px-2 py-0.5 rounded font-mono" style={{ backgroundColor: 'hsl(var(--resume-accent) / 0.15)', color: 'hsl(var(--resume-accent))' }}>{t}</span>
            ))}
          </div>
          <div className="flex gap-3 mt-2">
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-xs flex items-center gap-1 hover:underline" style={{ color: 'hsl(var(--resume-accent))' }}>
                <Github className="w-3 h-3" /> Source
              </a>
            )}
            {project.demoUrl && (
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="text-xs flex items-center gap-1 hover:underline" style={{ color: 'hsl(var(--resume-accent))' }}>
                <ExternalLink className="w-3 h-3" /> Demo
              </a>
            )}
          </div>
        </>
      )}

      {expanded && !editMode && (
        <div className="mt-3 space-y-3 border-t pt-3" style={{ borderColor: 'hsl(var(--resume-border))' }}>
          {project.architecture && customization.mode !== 'recruiter' && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'hsl(var(--resume-muted))' }}>Architecture</h4>
              <p className="text-sm" style={{ color: 'hsl(var(--resume-text))' }}>{project.architecture}</p>
            </div>
          )}
          {project.challenges && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'hsl(var(--resume-muted))' }}>Challenges</h4>
              <p className="text-sm" style={{ color: 'hsl(var(--resume-text))' }}>{project.challenges}</p>
            </div>
          )}
          {project.codeSnippet && customization.mode === 'developer' && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-1" style={{ color: 'hsl(var(--resume-muted))' }}>
                <Code className="w-3 h-3" /> Code
              </h4>
              <pre className="text-xs p-3 rounded overflow-x-auto font-mono" style={{ backgroundColor: 'hsl(var(--resume-bg))', color: 'hsl(var(--resume-accent))' }}>
                {project.codeSnippet}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
