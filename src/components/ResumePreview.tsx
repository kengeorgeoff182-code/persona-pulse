import { useResume } from "@/context/ResumeContext";

const themeClass: Record<string, string> = {
  minimal: "resume-theme-minimal",
  corporate: "resume-theme-corporate",
  cyberpunk: "resume-theme-cyberpunk",
  hacker: "resume-theme-hacker",
};

export default function ResumePreview() {
  const { resume, mode, theme } = useResume();
  const r = resume;

  const showProjectsFirst = mode === "developer";
  const isCreative = mode === "creative";

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h2
      className="mb-3 text-xs font-bold uppercase tracking-[0.2em]"
      style={{ color: "var(--rt-accent)", fontFamily: "var(--rt-font-heading)" }}
    >
      {children}
    </h2>
  );

  const Experience = (
    <section>
      <SectionTitle>Experience</SectionTitle>
      <div className="space-y-5">
        {r.experience.map((exp) => (
          <div key={exp.id}>
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-semibold" style={{ fontFamily: "var(--rt-font-heading)" }}>
                {exp.role} <span style={{ color: "var(--rt-muted)" }}>· {exp.company}</span>
              </h3>
              <span className="shrink-0 text-xs" style={{ color: "var(--rt-muted)" }}>{exp.period}</span>
            </div>
            <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm" style={{ color: "var(--rt-text)" }}>
              {exp.bullets.filter(Boolean).map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );

  const Projects = (
    <section>
      <SectionTitle>Projects</SectionTitle>
      <div className={isCreative ? "grid grid-cols-2 gap-3" : "space-y-4"}>
        {r.projects.map((p) => (
          <div
            key={p.id}
            className="rounded-lg p-4"
            style={{ background: "var(--rt-surface)", border: "1px solid var(--rt-border)" }}
          >
            <h3 className="font-semibold" style={{ fontFamily: "var(--rt-font-heading)" }}>{p.name}</h3>
            <p className="mt-1 text-sm" style={{ color: "var(--rt-muted)" }}>{p.description}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {p.techStack.map((t, i) => (
                <span
                  key={i}
                  className="rounded px-1.5 py-0.5 text-xs"
                  style={{
                    background: "var(--rt-bg)",
                    border: "1px solid var(--rt-border)",
                    color: "var(--rt-accent)",
                    fontFamily: theme === "hacker" ? "var(--rt-font-mono)" : undefined,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
            {p.highlights.filter(Boolean).length > 0 && (
              <ul className="mt-2 list-disc space-y-0.5 pl-4 text-xs" style={{ color: "var(--rt-muted)" }}>
                {p.highlights.filter(Boolean).map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <div
      id="resume-print-area"
      className={`resume-theme ${themeClass[theme]} mx-auto w-full max-w-3xl rounded-xl p-10 shadow-lg`}
      style={{
        background: "var(--rt-bg)",
        color: "var(--rt-text)",
        fontFamily: "var(--rt-font-body)",
        border: "1px solid var(--rt-border)",
      }}
    >
      <header className="mb-8" style={{ borderBottom: "2px solid var(--rt-accent)", paddingBottom: "1.25rem" }}>
        <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--rt-font-heading)" }}>
          {theme === "hacker" ? `$ whoami → ${r.name}` : r.name}
        </h1>
        <p className="mt-1 text-lg" style={{ color: "var(--rt-accent)" }}>{r.title}</p>
        <p className="mt-2 text-sm" style={{ color: "var(--rt-muted)" }}>
          {[r.email, r.phone, r.location].filter(Boolean).join("  ·  ")}
        </p>
        {r.links.some((l) => l.label && l.url) && (
          <p className="mt-1 text-sm" style={{ color: "var(--rt-muted)" }}>
            {r.links.filter((l) => l.label && l.url).map((l) => l.label).join("  ·  ")}
          </p>
        )}
      </header>

      <div className="space-y-8">
        <section>
          <SectionTitle>{mode === "recruiter" ? "Summary" : "About"}</SectionTitle>
          <p className="text-sm leading-relaxed">{r.summary}</p>
        </section>

        {showProjectsFirst && Projects}
        {Experience}
        {!showProjectsFirst && Projects}

        <section>
          <SectionTitle>Skills</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {r.skills.map((s, i) => (
              <span
                key={i}
                className="rounded-md px-2.5 py-1 text-sm"
                style={{ background: "var(--rt-surface)", border: "1px solid var(--rt-border)" }}
              >
                {s}
              </span>
            ))}
          </div>
        </section>

        <section>
          <SectionTitle>Education</SectionTitle>
          {r.education.map((e) => (
            <div key={e.id} className="flex items-baseline justify-between">
              <p className="text-sm font-medium">
                {e.degree} <span style={{ color: "var(--rt-muted)" }}>· {e.school}</span>
              </p>
              <span className="text-xs" style={{ color: "var(--rt-muted)" }}>{e.year}</span>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
