import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { action, resume, jobDescription, tone } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemPrompt = "";
    let userPrompt = "";

    if (action === "summary") {
      const toneGuide: Record<string, string> = {
        formal: "Use formal, professional language. Be precise and measured.",
        confident: "Use confident, assertive language. Highlight achievements boldly.",
        technical: "Use technical language. Focus on technologies, architectures, and engineering depth.",
        "story-driven": "Use narrative, story-driven language. Paint a compelling career journey.",
      };
      systemPrompt = `You are an expert resume writer. Generate a professional summary for a resume. ${toneGuide[tone] || toneGuide.formal} Keep it 2-3 sentences. Focus on measurable impact and key strengths. Return ONLY a JSON object with a "summary" field.`;
      userPrompt = `Generate a ${tone} resume summary for:\nName: ${resume.name}\nTitle: ${resume.title}\nSkills: ${resume.skills?.join(", ")}\nExperience: ${JSON.stringify(resume.experience)}\nProjects: ${JSON.stringify(resume.projects)}`;
    } else if (action === "optimize") {
      systemPrompt = `You are an expert ATS resume optimizer. Given a resume and job description, rewrite the summary to better match the job while keeping all facts accurate. Use the specified tone. Return ONLY a JSON object with a "summary" field containing the optimized summary.`;
      userPrompt = `Optimize this resume for the following job:\n\nJob Description:\n${jobDescription}\n\nCurrent Summary: ${resume.summary}\nSkills: ${resume.skills?.map((s: any) => s.name).join(", ")}\nExperience: ${JSON.stringify(resume.experience)}\nTone: ${tone}`;
    } else if (action === "explain") {
      systemPrompt = `You are a senior technical recruiter evaluating a candidate. Analyze the candidate's profile and provide a structured assessment. Return ONLY a JSON object with these fields: "strengths" (array of 3-5 strings), "weaknesses" (array of 2-3 strings, frame as areas for growth), "bestRoleFit" (string describing ideal role), "hiringDecision" (one of: "Strong Hire", "Potential Hire", "Needs Improvement"), "summary" (2-3 sentence overall assessment).`;
      userPrompt = `Evaluate this candidate:\nName: ${resume.name}\nTitle: ${resume.title}\nSummary: ${resume.summary}\nSkills: ${JSON.stringify(resume.skills)}\nExperience: ${JSON.stringify(resume.experience)}\nProjects: ${JSON.stringify(resume.projects)}\nEducation: ${JSON.stringify(resume.education)}`;
    } else {
      return new Response(JSON.stringify({ error: "Invalid action" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds in Settings." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content || "";

    // Parse JSON from response (handle markdown code blocks)
    let parsed;
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[1].trim() : content.trim());
    } catch {
      // If AI returns plain text for summary
      if (action === "summary" || action === "optimize") {
        parsed = { summary: content.trim() };
      } else {
        throw new Error("Failed to parse AI response");
      }
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-resume error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
