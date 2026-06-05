import SkillPill from "./SkillPill";

export default function ProjectCard({ project, index }) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-indigo-300">
        Project {index + 1}
      </p>
      <h4 className="text-lg font-semibold text-slate-100">{project.title}</h4>
      <p className="mt-2 text-sm text-slate-300">{project.why}</p>
      {(project.tech_stack || []).length > 0 && (
        <div className="mt-3">
          <p className="mb-2 text-xs font-semibold text-slate-400">Tech stack</p>
          <div className="flex flex-wrap gap-1.5">
            {project.tech_stack.map((tech) => (
              <SkillPill key={tech} keyword={tech} />
            ))}
          </div>
        </div>
      )}
      <p className="mt-3 text-sm text-slate-300">
        <span className="font-semibold text-slate-200">Interview angle: </span>
        {project.interview_angle}
      </p>
      {project.dataset && (
        <p className="mt-3 text-sm text-slate-300">
          <span className="font-semibold text-slate-200">Dataset: </span>
          {project.dataset}
        </p>
      )}
    </article>
  );
}
