import React, { useState } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { Search, Target, Sparkles, AlertTriangle } from 'lucide-react';

interface MatchResult {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  suggestions: string[];
}

const JobMatcher: React.FC = () => {
  const { resume } = useResume();
  const [jobDesc, setJobDesc] = useState('');
  const [result, setResult] = useState<MatchResult | null>(null);
  const [loading, setLoading] = useState(false);

  const analyzeMatch = () => {
    if (!jobDesc.trim()) return;
    setLoading(true);

    // Client-side matching (AI version will come with Cloud)
    setTimeout(() => {
      const jdLower = jobDesc.toLowerCase();
      const allSkills = resume.skills.map(s => s.name);
      const matched = allSkills.filter(s => jdLower.includes(s.toLowerCase()));
      const missing: string[] = [];

      // Common skills detection
      const commonSkills = ['React', 'TypeScript', 'Python', 'Java', 'Go', 'Rust', 'Kubernetes', 'Docker', 'AWS', 'GCP', 'Azure', 'Node.js', 'PostgreSQL', 'MongoDB', 'Redis', 'GraphQL', 'REST', 'CI/CD', 'Terraform'];
      commonSkills.forEach(s => {
        if (jdLower.includes(s.toLowerCase()) && !allSkills.some(sk => sk.toLowerCase() === s.toLowerCase())) {
          missing.push(s);
        }
      });

      const score = allSkills.length > 0 ? Math.round((matched.length / Math.max(matched.length + missing.length, 1)) * 100) : 0;

      setResult({
        score: Math.min(score + 15, 100), // baseline bonus
        matchedSkills: matched,
        missingSkills: missing.slice(0, 5),
        suggestions: missing.length > 0
          ? [`Consider highlighting experience with ${missing.slice(0, 2).join(' and ')}`, 'Tailor your summary to mention key requirements', 'Add relevant projects or certifications']
          : ['Great match! Your skills align well with this role.'],
      });
      setLoading(false);
    }, 800);
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

      <button
        onClick={analyzeMatch}
        disabled={!jobDesc.trim() || loading}
        className="w-full py-2 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
        ) : (
          <Search className="w-4 h-4" />
        )}
        {loading ? 'Analyzing...' : 'Analyze Match'}
      </button>

      {result && (
        <div className="space-y-3">
          {/* Score */}
          <div className="text-center p-4 rounded-lg bg-secondary">
            <div className="text-3xl font-bold text-primary">{result.score}%</div>
            <div className="text-xs text-muted-foreground mt-1">Match Score</div>
          </div>

          {/* Matched */}
          {result.matchedSkills.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-semibold text-muted-foreground uppercase">Matched Skills</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {result.matchedSkills.map(s => (
                  <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground">{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Missing */}
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

          {/* Suggestions */}
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
