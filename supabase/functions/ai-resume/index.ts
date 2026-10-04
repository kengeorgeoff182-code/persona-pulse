import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PROMPTS: Record<string, string> = {
  summary:
    "Rewrite the professional summary for this resume. Make it specific, recruiter-friendly, and under 60 words. Return ONLY the new summary text, no quotes or preamble.",
  optimize:
    "Rewrite the professional summary to align with the provided job description. Mirror the job's key terminology honestly — never invent skills the resume doesn't show. Under 70 words. Return ONLY the new summary text.",
  explain:
    "You are a recruiter. In under 120 words, explain this candidate: their strongest signals, likely seniority, best-fit roles, and one risk or gap. Be concrete and reference actual items from the resume.",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { action, resume, jobDescription } = await req.json();
    const instruction = PROMPTS[action];
    if (!instruction) {
      return new Response(JSON.stringify({ error: "Unknown action" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("AI gateway key is not configured");

    const userContent =
      `RESUME (JSON):\n${JSON.stringify(resume)}` +
      (jobDescription ? `\n\nJOB DESCRIPTION:\n${jobDescription}` : "");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: instruction },
          { role: "user", content: userContent },
        ],
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) throw new Error("Rate limit reached — please try again in a moment.");
      if (status === 402) throw new Error("AI credits exhausted. Please top up your workspace credits.");
      throw new Error(`AI gateway error (${status})`);
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content?.trim() ?? "";
    if (!result) throw new Error("AI returned an empty response");

    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
