import React, { useState } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { Skill } from '@/types/resume';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

const SkillBar: React.FC<{ skill: Skill; showDetails: boolean; index: number }> = ({ skill, showDetails, index }) => {
  const { customization, editMode, updateSkill } = useResume();
  const [expanded, setExpanded] = useState(false);
  const isGlow = customization.accentStyle === 'glow' || customization.theme === 'cyberpunk' || customization.theme === 'hacker';

  return (
    <div className="group">
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left">
        <div className="flex items-center justify-between mb-1">
          {editMode ? (
            <input
              value={skill.name}
              onChange={e => { e.stopPropagation(); updateSkill(index, { name: e.target.value }); }}
              onClick={e => e.stopPropagation()}
              className="text-sm font-medium bg-transparent border-b border-dashed border-primary/30 outline-none"
              style={{ color: 'hsl(var(--resume-text))' }}
              placeholder="Skill name"
            />
          ) : (
            <span className="text-sm font-medium" style={{ color: 'hsl(var(--resume-text))' }}>{skill.name}</span>
          )}
          {(showDetails || editMode) && (
            <div className="flex items-center gap-2">
              {editMode ? (
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={skill.level}
                  onChange={e => { e.stopPropagation(); updateSkill(index, { level: Number(e.target.value) }); }}
                  onClick={e => e.stopPropagation()}
                  className="text-xs w-12 bg-transparent border-b border-dashed border-primary/30 outline-none text-right"
                  style={{ color: 'hsl(var(--resume-muted))' }}
                />
              ) : (
                <span className="text-xs" style={{ color: 'hsl(var(--resume-muted))' }}>{skill.level}%</span>
              )}
              {expanded ? <ChevronUp className="w-3 h-3" style={{ color: 'hsl(var(--resume-muted))' }} /> : <ChevronDown className="w-3 h-3" style={{ color: 'hsl(var(--resume-muted))' }} />}
            </div>
          )}
        </div>
        <div className="w-full h-2 rounded-full" style={{ backgroundColor: 'hsl(var(--resume-border))' }}>
          <div
            className={`h-full rounded-full transition-all duration-700 ${isGlow ? 'glow-border' : ''}`}
            style={{ width: `${skill.level}%`, backgroundColor: 'hsl(var(--resume-accent))' }}
          />
        </div>
      </button>

      {expanded && (showDetails || editMode) && (
        <div className="mt-2 pl-2 border-l-2 space-y-1" style={{ borderColor: 'hsl(var(--resume-accent) / 0.3)' }}>
          {editMode ? (
            <input
              value={skill.context || ''}
              onChange={e => updateSkill(index, { context: e.target.value })}
              className="text-xs bg-transparent border-b border-dashed border-primary/30 outline-none w-full"
              style={{ color: 'hsl(var(--resume-muted))' }}
              placeholder="Context (e.g., how you used this skill)"
            />
          ) : skill.context ? (
            <p className="text-xs" style={{ color: 'hsl(var(--resume-muted))' }}>{skill.context}</p>
          ) : null}
          {editMode ? (
            <input
              value={skill.projects.join(', ')}
              onChange={e => updateSkill(index, { projects: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
              className="text-xs bg-transparent border-b border-dashed border-primary/30 outline-none w-full"
              style={{ color: 'hsl(var(--resume-accent))' }}
              placeholder="Related projects (comma-separated)"
            />
          ) : skill.projects.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {skill.projects.map(p => (
                <span key={p} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'hsl(var(--resume-accent) / 0.15)', color: 'hsl(var(--resume-accent))' }}>{p}</span>
              ))}
            </div>
          ) : null}
          {!editMode && skill.githubLinks?.map(link => (
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
