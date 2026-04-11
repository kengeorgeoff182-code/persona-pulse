import React, { useState } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { Project } from '@/types/resume';
import { ExternalLink, Github, ChevronDown, ChevronUp, Code } from 'lucide-react';

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const { customization } = useResume();
  const [expanded, setExpanded] = useState(false);
  const isGlow = customization.accentStyle === 'glow' || customization.theme === 'cyberpunk' || customization.theme === 'hacker';

  const cardClass = customization.cardStyle === 'glass'
    ? 'glass'
    : customization.cardStyle === 'sharp'
      ? ''
      : 'rounded-lg';
  const borderRadius = customization.cardStyle === 'rounded' ? '0.5rem' : customization.cardStyle === 'sharp' ? '0' : '0.75rem';

  return (
    <div
      className={`p-4 border transition-all ${cardClass} ${isGlow ? 'glow-border' : ''}`}
      style={{ borderRadius, backgroundColor: 'hsl(var(--resume-card))', borderColor: 'hsl(var(--resume-border))' }}
    >
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold" style={{ color: 'hsl(var(--resume-heading))' }}>{project.name}</h3>
            <p className="text-sm mt-1" style={{ color: 'hsl(var(--resume-text))' }}>{project.description}</p>
          </div>
          {expanded ? <ChevronUp className="w-4 h-4 shrink-0" style={{ color: 'hsl(var(--resume-muted))' }} /> : <ChevronDown className="w-4 h-4 shrink-0" style={{ color: 'hsl(var(--resume-muted))' }} />}
        </div>
      </button>

      <div className="flex flex-wrap gap-1 mt-2">
        {project.techStack.map(t => (
          <span key={t} className="text-xs px-2 py-0.5 rounded font-mono" style={{ backgroundColor: 'hsl(var(--resume-accent) / 0.15)', color: 'hsl(var(--resume-accent))' }}>
            {t}
          </span>
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

      {expanded && (
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
