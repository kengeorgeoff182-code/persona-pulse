import React, { useState } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { Experience } from '@/types/resume';
import { ChevronDown, ChevronUp, Plus, X } from 'lucide-react';

const ExperienceCard: React.FC<{ exp: Experience; index: number }> = ({ exp, index }) => {
  const { customization, editMode, updateExperience } = useResume();
  const [expanded, setExpanded] = useState(index === 0);
  const isTimeline = customization.layout === 'timeline';
  const isGlow = customization.accentStyle === 'glow' || customization.theme === 'cyberpunk' || customization.theme === 'hacker';

  const cardClass = customization.cardStyle === 'glass' ? 'glass' : customization.cardStyle === 'sharp' ? '' : 'rounded-lg';
  const borderRadius = customization.cardStyle === 'rounded' ? '0.5rem' : customization.cardStyle === 'sharp' ? '0' : '0.75rem';

  const updateDesc = (di: number, val: string) => {
    const newDesc = [...exp.description];
    newDesc[di] = val;
    updateExperience(index, { description: newDesc });
  };

  const addDesc = () => updateExperience(index, { description: [...exp.description, ''] });
  const removeDesc = (di: number) => updateExperience(index, { description: exp.description.filter((_, i) => i !== di) });

  const updateTech = (val: string) => updateExperience(index, { techStack: val.split(',').map(s => s.trim()).filter(Boolean) });

  return (
    <div className={`relative ${isTimeline ? 'pl-8' : ''}`}>
      {isTimeline && (
        <>
          <div className="absolute left-3 top-0 bottom-0 w-px" style={{ backgroundColor: 'hsl(var(--resume-border))' }} />
          <div className={`absolute left-1.5 top-4 w-4 h-4 rounded-full border-2 ${isGlow ? 'glow-border' : ''}`}
            style={{ borderColor: 'hsl(var(--resume-accent))', backgroundColor: 'hsl(var(--resume-bg))' }} />
        </>
      )}
      <div
        className={`p-4 border transition-all ${cardClass} ${isGlow ? 'glow-border' : ''}`}
        style={{ borderRadius, backgroundColor: 'hsl(var(--resume-card))', borderColor: 'hsl(var(--resume-border))' }}
      >
        <button onClick={() => setExpanded(!expanded)} className="w-full text-left">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {editMode ? (
                <div className="space-y-1" onClick={e => e.stopPropagation()}>
                  <input value={exp.role} onChange={e => updateExperience(index, { role: e.target.value })} className="font-semibold bg-transparent border-b border-dashed border-primary/30 outline-none w-full" style={{ color: 'hsl(var(--resume-heading))' }} placeholder="Role" />
                  <input value={exp.company} onChange={e => updateExperience(index, { company: e.target.value })} className="text-sm bg-transparent border-b border-dashed border-primary/30 outline-none w-full" style={{ color: 'hsl(var(--resume-accent))' }} placeholder="Company" />
                </div>
              ) : (
                <div>
                  <h3 className="font-semibold" style={{ color: 'hsl(var(--resume-heading))' }}>{exp.role}</h3>
                  <p className="text-sm" style={{ color: 'hsl(var(--resume-accent))' }}>{exp.company}</p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {editMode ? (
                <input value={exp.period} onChange={e => { e.stopPropagation(); updateExperience(index, { period: e.target.value }); }} onClick={e => e.stopPropagation()} className="text-xs bg-transparent border-b border-dashed border-primary/30 outline-none w-28 text-right" style={{ color: 'hsl(var(--resume-muted))' }} placeholder="Period" />
              ) : (
                <span className="text-xs" style={{ color: 'hsl(var(--resume-muted))' }}>{exp.period}</span>
              )}
              {expanded ? <ChevronUp className="w-4 h-4" style={{ color: 'hsl(var(--resume-muted))' }} /> : <ChevronDown className="w-4 h-4" style={{ color: 'hsl(var(--resume-muted))' }} />}
            </div>
          </div>
        </button>

        {expanded && (
          <div className="mt-3 space-y-2">
            {editMode ? (
              <div className="space-y-2">
                {exp.description.map((d, di) => (
                  <div key={di} className="flex items-start gap-2">
                    <span className="mt-1" style={{ color: 'hsl(var(--resume-accent))' }}>•</span>
                    <input value={d} onChange={e => updateDesc(di, e.target.value)} className="flex-1 text-sm bg-transparent border-b border-dashed border-primary/30 outline-none" style={{ color: 'hsl(var(--resume-text))' }} placeholder="Describe achievement..." />
                    <button onClick={() => removeDesc(di)} className="text-destructive hover:text-destructive/80 mt-1"><X className="w-3 h-3" /></button>
                  </div>
                ))}
                <button onClick={addDesc} className="text-xs flex items-center gap-1 hover:underline" style={{ color: 'hsl(var(--resume-accent))' }}>
                  <Plus className="w-3 h-3" /> Add bullet
                </button>
                <div>
                  <label className="text-xs" style={{ color: 'hsl(var(--resume-muted))' }}>Tech stack (comma-separated)</label>
                  <input value={(exp.techStack || []).join(', ')} onChange={e => updateTech(e.target.value)} className="w-full text-xs bg-transparent border-b border-dashed border-primary/30 outline-none mt-1" style={{ color: 'hsl(var(--resume-accent))' }} />
                </div>
              </div>
            ) : customization.mode === 'recruiter' ? (
              <ul className="space-y-1">
                {exp.description.map((d, i) => (
                  <li key={i} className="text-sm flex gap-2" style={{ color: 'hsl(var(--resume-text))' }}>
                    <span style={{ color: 'hsl(var(--resume-accent))' }}>•</span>{d}
                  </li>
                ))}
              </ul>
            ) : customization.mode === 'developer' ? (
              <>
                <ul className="space-y-1">
                  {exp.description.map((d, i) => (
                    <li key={i} className="text-sm" style={{ color: 'hsl(var(--resume-text))' }}>→ {d}</li>
                  ))}
                </ul>
                {exp.techStack && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {exp.techStack.map(t => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded font-mono" style={{ backgroundColor: 'hsl(var(--resume-accent) / 0.15)', color: 'hsl(var(--resume-accent))' }}>{t}</span>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-2">
                {exp.highlights && exp.highlights.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {exp.highlights.map((h, i) => (
                      <div key={i} className="text-center p-2 rounded-lg" style={{ backgroundColor: 'hsl(var(--resume-accent) / 0.1)' }}>
                        <span className="text-sm font-semibold" style={{ color: 'hsl(var(--resume-accent))' }}>{h}</span>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-sm leading-relaxed" style={{ color: 'hsl(var(--resume-text))' }}>{exp.description.join('. ')}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExperienceCard;
