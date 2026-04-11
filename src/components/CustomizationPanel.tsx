import React from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { ViewMode, ThemePreset, LayoutType, CardStyle, AccentStyle, ToneStyle } from '@/types/resume';
import { Briefcase, Code, Palette, Sun, Moon, Monitor, Terminal, Settings2, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const modeOptions: { value: ViewMode; label: string; icon: React.ReactNode; desc: string }[] = [
  { value: 'recruiter', label: 'Recruiter', icon: <Briefcase className="w-4 h-4" />, desc: 'ATS-optimized, clean' },
  { value: 'developer', label: 'Developer', icon: <Code className="w-4 h-4" />, desc: 'Technical deep dive' },
  { value: 'creative', label: 'Creative', icon: <Palette className="w-4 h-4" />, desc: 'Visual storytelling' },
];

const themeOptions: { value: ThemePreset; label: string; icon: React.ReactNode; colors: string[] }[] = [
  { value: 'minimal', label: 'Minimal Pro', icon: <Sun className="w-4 h-4" />, colors: ['#f8f9fa', '#3b82f6', '#1e293b'] },
  { value: 'corporate', label: 'Corporate', icon: <Monitor className="w-4 h-4" />, colors: ['#f0f4f8', '#1a6bb5', '#1a2332'] },
  { value: 'cyberpunk', label: 'Cyberpunk', icon: <Moon className="w-4 h-4" />, colors: ['#1a0d2e', '#ff3399', '#00ffcc'] },
  { value: 'hacker', label: 'Hacker', icon: <Terminal className="w-4 h-4" />, colors: ['#0d1a0d', '#00cc44', '#1a331a'] },
];

const CustomizationPanel: React.FC = () => {
  const { customization, updateCustomization } = useResume();
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Settings2 className="w-5 h-5 text-primary" />
          <span className="font-semibold text-card-foreground">Customize</span>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-6">
          {/* View Mode */}
          <Section title="View Mode">
            <div className="space-y-2">
              {modeOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => updateCustomization({ mode: opt.value })}
                  className={`w-full flex items-center gap-3 p-3 rounded-md border transition-all ${
                    customization.mode === opt.value
                      ? 'border-primary bg-accent text-accent-foreground'
                      : 'border-border hover:border-primary/50 text-card-foreground'
                  }`}
                >
                  {opt.icon}
                  <div className="text-left">
                    <div className="text-sm font-medium">{opt.label}</div>
                    <div className="text-xs text-muted-foreground">{opt.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </Section>

          {/* Theme */}
          <Section title="Theme">
            <div className="grid grid-cols-2 gap-2">
              {themeOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => updateCustomization({ theme: opt.value })}
                  className={`flex flex-col items-center gap-2 p-3 rounded-md border transition-all ${
                    customization.theme === opt.value
                      ? 'border-primary bg-accent'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex gap-1">
                    {opt.colors.map((c, i) => (
                      <div key={i} className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-card-foreground">{opt.label}</span>
                </button>
              ))}
            </div>
          </Section>

          {/* Layout */}
          <Section title="Layout">
            <div className="flex gap-2">
              {(['single', 'split', 'timeline'] as LayoutType[]).map(l => (
                <button
                  key={l}
                  onClick={() => updateCustomization({ layout: l })}
                  className={`flex-1 py-2 px-3 text-xs font-medium rounded-md border transition-all capitalize ${
                    customization.layout === l
                      ? 'border-primary bg-accent text-accent-foreground'
                      : 'border-border text-muted-foreground hover:border-primary/50'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </Section>

          {/* Card Style */}
          <Section title="Card Style">
            <div className="flex gap-2">
              {(['rounded', 'sharp', 'glass'] as CardStyle[]).map(s => (
                <button
                  key={s}
                  onClick={() => updateCustomization({ cardStyle: s })}
                  className={`flex-1 py-2 px-3 text-xs font-medium rounded-md border transition-all capitalize ${
                    customization.cardStyle === s
                      ? 'border-primary bg-accent text-accent-foreground'
                      : 'border-border text-muted-foreground hover:border-primary/50'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </Section>

          {/* Accent */}
          <Section title="Accent Style">
            <div className="flex gap-2">
              {(['underline', 'border', 'glow'] as AccentStyle[]).map(a => (
                <button
                  key={a}
                  onClick={() => updateCustomization({ accentStyle: a })}
                  className={`flex-1 py-2 px-3 text-xs font-medium rounded-md border transition-all capitalize ${
                    customization.accentStyle === a
                      ? 'border-primary bg-accent text-accent-foreground'
                      : 'border-border text-muted-foreground hover:border-primary/50'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </Section>

          {/* Tone */}
          <Section title="AI Tone">
            <div className="grid grid-cols-2 gap-2">
              {(['formal', 'confident', 'technical', 'story-driven'] as ToneStyle[]).map(t => (
                <button
                  key={t}
                  onClick={() => updateCustomization({ tone: t })}
                  className={`py-2 px-3 text-xs font-medium rounded-md border transition-all capitalize ${
                    customization.tone === t
                      ? 'border-primary bg-accent text-accent-foreground'
                      : 'border-border text-muted-foreground hover:border-primary/50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </Section>

          {/* Font Size */}
          <Section title={`Font Size: ${customization.fontSize}px`}>
            <input
              type="range"
              min={12}
              max={20}
              value={customization.fontSize}
              onChange={e => updateCustomization({ fontSize: Number(e.target.value) })}
              className="w-full accent-primary"
            />
          </Section>

          {/* Spacing */}
          <Section title="Spacing">
            <div className="flex gap-2">
              {(['compact', 'normal', 'relaxed'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => updateCustomization({ spacing: s })}
                  className={`flex-1 py-2 px-3 text-xs font-medium rounded-md border transition-all capitalize ${
                    customization.spacing === s
                      ? 'border-primary bg-accent text-accent-foreground'
                      : 'border-border text-muted-foreground hover:border-primary/50'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </Section>
        </div>
      )}
    </div>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{title}</h3>
    {children}
  </div>
);

export default CustomizationPanel;
