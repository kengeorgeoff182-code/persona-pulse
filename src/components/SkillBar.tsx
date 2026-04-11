import React, { useState } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { Skill } from '@/types/resume';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

const SkillBar: React.FC<{ skill: Skill; showDetails: boolean }> = ({ skill, showDetails }) => {
  const { customization } = useResume();
  const [expanded, setExpanded] = useState(false);
  const isGlow = customization.accentStyle === 'glow' || customization.theme === 'cyberpunk' || customization.theme === 'hacker';

  return (
    <div className="group">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left"
      >
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium" style={{ color: 'hsl(var(--resume-text))' }}>
            {skill.name}
          </span>
          {showDetails && (
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: 'hsl(var(--resume-muted))' }}>{skill.level}%</span>
              {expanded ? <ChevronUp className="w-3 h-3" style={{ color: 'hsl(var(--resume-muted))' }} /> : <ChevronDown className="w-3 h-3" style={{ color: 'hsl(var(--resume-muted))' }} />}
            </div>
          )}
        </div>
        <div className="w-full h-2 rounded-full" style={{ backgroundColor: 'hsl(var(--resume-border))' }}>
          <div
            className={`h-full rounded-full transition-all duration-700 ${isGlow ? 'glow-border' : ''}`}
            style={{
              width: `${skill.level}%`,
              backgroundColor: 'hsl(var(--resume-accent))',
            }}
          />
        </div>
      </button>

      {expanded && showDetails && (
        <div className="mt-2 pl-2 border-l-2 space-y-1" style={{ borderColor: 'hsl(var(--resume-accent) / 0.3)' }}>
          {skill.context && (
            <p className="text-xs" style={{ color: 'hsl(var(--resume-muted))' }}>{skill.context}</p>
          )}
          {skill.projects.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {skill.projects.map(p => (
                <span key={p} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'hsl(var(--resume-accent) / 0.15)', color: 'hsl(var(--resume-accent))' }}>
                  {p}
                </span>
              ))}
            </div>
          )}
          {skill.githubLinks?.map(link => (
            <a key={link} href={link} target="_blank" rel="noopener noreferrer" className="text-xs flex items-center gap-1 hover:underline" style={{ color: 'hsl(var(--resume-accent))' }}>
              <ExternalLink className="w-3 h-3" /> {link}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default SkillBar;
