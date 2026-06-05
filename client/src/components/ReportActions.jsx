import { useMemo, useState } from "react";
import { buildShareUrl } from "../lib/shareUrl";

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

export default function ReportActions({ report, companyId, roleId }) {
  const [copied, setCopied] = useState("");
  const shareSummary = useMemo(() => buildShareSummary(report), [report]);
  const linkedInPost = useMemo(() => buildLinkedInPost(report), [report]);
  const shareUrl = useMemo(() => {
    if (companyId && roleId) return buildShareUrl(companyId, roleId);
    return window.location.href;
  }, [companyId, roleId]);

  async function copyWithFeedback(text, label) {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 2000);
  }

  async function copyShareText() {
    await copyWithFeedback(shareSummary, "summary");
  }

  async function copyShareLink() {
    await copyWithFeedback(shareUrl, "link");
  }

  async function copyLinkedInPost() {
    await copyWithFeedback(linkedInPost, "linkedinpost");
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
    <div className="space-y-2">
      {copied && (
        <p className="text-xs text-emerald-300">
          Copied{" "}
          {copied === "link"
            ? "share link"
            : copied === "linkedinpost"
              ? "LinkedIn post"
              : copied}{" "}
          to clipboard.
        </p>
      )}
      <p className="break-all text-xs text-slate-400">{shareUrl}</p>
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
    </div>
  );
}
