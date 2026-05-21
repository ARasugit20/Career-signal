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

function buildLinkedInPost(report) {
  const projects = (report.top_projects || [])
    .slice(0, 3)
    .map((project, index) => `${index + 1}. ${project.title}`)
    .join("\n");

  const liveDemo = import.meta.env.VITE_LIVE_DEMO_URL || "[add-live-demo-url]";
  return `I just generated my Career Signal report for ${report.company} (${report.role}).

${report.headline}

Top projects to build:
${projects}

Framing tip: ${report.framing_tip}

Try it: ${liveDemo}
#softwareengineering #careers #buildinpublic`;
}

export default function ReportActions({ report }) {
  const shareSummary = useMemo(() => buildShareSummary(report), [report]);
  const linkedInPost = useMemo(() => buildLinkedInPost(report), [report]);

  async function copyShareText() {
    await navigator.clipboard.writeText(shareSummary);
  }

  async function copyShareLink() {
    await navigator.clipboard.writeText(window.location.href);
  }

  async function copyLinkedInPost() {
    await navigator.clipboard.writeText(linkedInPost);
  }

  function downloadShareCard() {
    const content = `# Career Signal Share Card

Company: ${report.company}
Role: ${report.role}

${report.headline}

## Top Projects
${(report.top_projects || [])
  .slice(0, 3)
  .map((project) => `- ${project.title}: ${project.why}`)
  .join("\n")}

## Framing Tip
${report.framing_tip}
`;

    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${report.company}-${report.role}-share-card.md`
      .toLowerCase()
      .replace(/\s+/g, "-");
    a.click();
    URL.revokeObjectURL(url);
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
      <button
        type="button"
        onClick={copyLinkedInPost}
        className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-indigo-400 hover:text-indigo-300"
      >
        Copy LinkedIn post
      </button>
      <button
        type="button"
        onClick={downloadShareCard}
        className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-indigo-400 hover:text-indigo-300"
      >
        Download share card
      </button>
    </div>
  );
}
