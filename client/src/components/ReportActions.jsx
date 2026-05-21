import { useMemo } from "react";

function buildShareSummary(report) {
  const projectTitles = (report.top_projects || [])
    .slice(0, 3)
    .map((project) => `- ${project.title}`)
    .join("\n");

  return `Career Signal Report: ${report.company} - ${report.role}

${report.headline}

Top projects:
${projectTitles}

Framing tip:
${report.framing_tip}`;
}

export default function ReportActions({ report }) {
  const shareSummary = useMemo(() => buildShareSummary(report), [report]);

  async function copyShareText() {
    await navigator.clipboard.writeText(shareSummary);
  }

  async function copyShareLink() {
    await navigator.clipboard.writeText(window.location.href);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={copyShareText}
        className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-indigo-400 hover:text-indigo-300"
      >
        Copy report summary
      </button>
      <button
        type="button"
        onClick={copyShareLink}
        className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-indigo-400 hover:text-indigo-300"
      >
        Copy share link
      </button>
    </div>
  );
}
