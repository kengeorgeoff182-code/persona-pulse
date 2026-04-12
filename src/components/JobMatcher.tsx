import React, { useState } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { Search, Target, Sparkles, AlertTriangle, Wand2, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface MatchResult {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  suggestions: string[];
}

const JobMatcher: React.FC = () => {
  const { resume, setResume, customization } = useResume();
  const [jobDesc, setJobDesc] = useState('');
  const [result, setResult] = useState<MatchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [optimizing, setOptimizing] = useState(false);

  const analyzeMatch = () => {
    if (!jobDesc.trim()) return;
    setLoading(true);

    setTimeout(() => {
      const jdLower = jobDesc.toLowerCase();
      const allSkills = resume.skills.map(s => s.name);
      const matched = allSkills.filter(s => jdLower.includes(s.toLowerCase()));
      const missing: string[] = [];

      const commonSkills = ['React', 'TypeScript', 'Python', 'Java', 'Go', 'Rust', 'Kubernetes', 'Docker', 'AWS', 'GCP', 'Azure', 'Node.js', 'PostgreSQL', 'MongoDB', 'Redis', 'GraphQL', 'REST', 'CI/CD', 'Terraform'];
      commonSkills.forEach(s => {
        if (jdLower.includes(s.toLowerCase()) && !allSkills.some(sk => sk.toLowerCase() === s.toLowerCase())) {
          missing.push(s);
        }
      });

      const score = allSkills.length > 0 ? Math.round((matched.length / Math.max(matched.length + missing.length, 1)) * 100) : 0;

      setResult({
        score: Math.min(score + 15, 100),
        matchedSkills: matched,
        missingSkills: missing.slice(0, 5),
        suggestions: missing.length > 0
          ? [`Consider highlighting experience with ${missing.slice(0, 2).join(' and ')}`, 'Tailor your summary to mention key requirements', 'Add relevant projects or certifications']
          : ['Great match! Your skills align well with this role.'],
      });
      setLoading(false);
    }, 800);
  };

  const optimizeResume = async () => {
    if (!jobDesc.trim()) return;
    setOptimizing(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-resume', {
        body: {
          action: 'optimize',
          resume: {
            name: resume.name,
            title: resume.title,
            summary: resume.summary,
            skills: resume.skills.map(s => ({ name: s.name, level: s.level })),
            experience: resume.experience.map(e => ({ role: e.role, company: e.company, period: e.period, description: e.description })),
            projects: resume.projects.map(p => ({ name: p.name, description: p.description, techStack: p.techStack })),
          },
          jobDescription: jobDesc,
          tone: customization.tone,
        },
      });
      if (error) throw error;
      if (data.summary) {
        setResume({ ...resume, summary: data.summary });
        toast.success('Resume optimized for this job!');
      }
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || 'Failed to optimize resume');
    } finally {
      setOptimizing(false);
    }
  };

  const scoreColor = (score: number) => {
    if (score >= 75) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-orange-500';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Target className="w-5 h-5 text-primary" />
        <h2 className="font-semibold text-card-foreground">Job Matcher</h2>
      </div>

      <textarea
        value={jobDesc}
        onChange={e => setJobDesc(e.target.value)}
        placeholder="Paste a job description to see how well you match..."
        className="w-full h-28 p-3 text-sm rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
      />

      <div className="flex gap-2">
        <button
          onClick={analyzeMatch}
          disabled={!jobDesc.trim() || loading}
          className="flex-1 py-2 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : <Search className="w-4 h-4" />}
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
        <button
          onClick={optimizeResume}
          disabled={!jobDesc.trim() || optimizing}
          className="flex-1 py-2 px-4 rounded-md bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {optimizing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
          {optimizing ? 'Optimizing...' : 'AI Optimize'}
        </button>
      </div>

      {result && (
        <div className="space-y-3">
          <div className="text-center p-4 rounded-lg bg-secondary">
            <div className={`text-3xl font-bold ${scoreColor(result.score)}`}>{result.score}%</div>
            <div className="text-xs text-muted-foreground mt-1">Match Score</div>
            <div className="w-full h-2 rounded-full bg-muted mt-2">
              <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${result.score}%` }} />
            </div>
          </div>

          {result.matchedSkills.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-semibold text-muted-foreground uppercase">Matched Skills</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {result.matchedSkills.map(s => (
                  <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-600">{s}</span>
                ))}
              </div>
            </div>
          )}

          {result.missingSkills.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
                <span className="text-xs font-semibold text-muted-foreground uppercase">Skills to Add</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {result.missingSkills.map(s => (
                  <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-destructive/10 text-destructive">{s}</span>
                ))}
              </div>
            </div>
          )}

          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase">Suggestions</span>
            <ul className="mt-1 space-y-1">
              {result.suggestions.map((s, i) => (
                <li key={i} className="text-xs text-muted-foreground">→ {s}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobMatcher;
