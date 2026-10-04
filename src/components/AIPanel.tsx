import { useState } from "react";
import { useResume } from "@/context/ResumeContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Target, UserSearch, Loader2 } from "lucide-react";

type Action = "summary" | "optimize" | "explain";

export default function AIPanel() {
  const { resume, update } = useResume();
  const [jobDesc, setJobDesc] = useState("");
  const [loading, setLoading] = useState<Action | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);

  const call = async (action: Action) => {
    setLoading(action);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("ai-resume", {
        body: { action, resume, jobDescription: jobDesc },
      });
      if (fnError) throw new Error(fnError.message);
      if (data?.error) throw new Error(data.error);
      if (action === "explain") {
        setExplanation(data.result);
      } else if (data.result) {
        update("summary", data.result);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "AI request failed. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-4 rounded-lg border border-border bg-card p-4">
      <h3 className="flex items-center gap-2 text-sm font-semibold">
        <Sparkles className="h-4 w-4" /> AI Assistant
      </h3>

      <Button className="w-full" variant="outline" disabled={loading !== null} onClick={() => call("summary")}>
        {loading === "summary" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
        Rewrite summary with AI
      </Button>

      <div className="space-y-2">
        <Textarea
          rows={4}
          placeholder="Paste a job description here…"
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
        />
        <Button
          className="w-full"
          variant="outline"
          disabled={loading !== null || !jobDesc.trim()}
          onClick={() => call("optimize")}
        >
          {loading === "optimize" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Target className="mr-2 h-4 w-4" />}
          Optimize summary for this job
        </Button>
      </div>

      <Button className="w-full" variant="outline" disabled={loading !== null} onClick={() => call("explain")}>
        {loading === "explain" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserSearch className="mr-2 h-4 w-4" />}
        Explain this candidate
      </Button>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {explanation && (
        <div className="rounded-md border border-border bg-secondary/50 p-3">
          <p className="whitespace-pre-wrap text-sm text-secondary-foreground">{explanation}</p>
          <Button variant="ghost" size="sm" className="mt-2" onClick={() => setExplanation(null)}>
            Dismiss
          </Button>
        </div>
      )}
    </div>
  );
}
