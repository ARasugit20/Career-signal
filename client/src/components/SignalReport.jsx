import ProjectCard from "./ProjectCard";
import SkillPill from "./SkillPill";
import SignalStrengthBar from "./SignalStrengthBar";

export default function SignalReport({ report }) {
  if (!report) return null;

  return (
    <section className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl md:p-7">
      <header>
        <p className="text-xs uppercase tracking-wider text-indigo-300">Signal Report</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-100">
          {report.company} — {report.role}
        </h2>
        <p className="mt-3 text-slate-200">{report.headline}</p>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">{report.signal_summary}</p>
      </header>

      <div>
        <p className="mb-2 text-sm font-semibold text-slate-200">Signal strength categories</p>
        <SignalStrengthBar />
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-slate-200">Top projects to build</p>
        <div className="grid gap-3 md:grid-cols-3">
          {(report.top_projects || []).map((project, index) => (
            <ProjectCard key={`${project.title}-${index}`} project={project} index={index} />
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-slate-200">JD keyword signal</p>
        <div className="flex flex-wrap gap-2">
          {(report.skill_keywords || []).map((keyword) => (
            <SkillPill key={keyword} keyword={keyword} />
          ))}
        </div>
      </div>

      {report.dataset_rec && (
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
          <p className="text-sm font-semibold text-slate-200">Dataset recommendation</p>
          <p className="mt-2 text-sm text-slate-300">
            <span className="font-semibold text-slate-200">{report.dataset_rec.name}</span> —{" "}
            {report.dataset_rec.project_angle}
          </p>
          <a
            href={report.dataset_rec.url}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block text-sm text-indigo-300 underline"
          >
            Open dataset
          </a>
        </div>
      )}

      {report.course_rec && (
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
          <p className="text-sm font-semibold text-slate-200">Course recommendation</p>
          <p className="mt-2 text-sm text-slate-300">
            <span className="font-semibold text-slate-200">{report.course_rec.title}</span> —{" "}
            {report.course_rec.why}
          </p>
          <a
            href={report.course_rec.url}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block text-sm text-indigo-300 underline"
          >
            Open course
          </a>
        </div>
      )}

      <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-4">
        <p className="text-sm font-semibold text-indigo-200">Interview framing tip</p>
        <p className="mt-1 text-sm text-indigo-100">{report.framing_tip}</p>
      </div>
    </section>
  );
}
