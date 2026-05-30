const DEFAULT_TITLE = "Career Signal — Role intelligence for CS students";
const DEFAULT_DESCRIPTION =
  "Pick a company and role. Get project ideas, JD keywords, and interview framing.";

function setMeta(property, content, isName = false) {
  const attr = isName ? "name" : "property";
  let tag = document.querySelector(`meta[${attr}="${property}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, property);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

export function updateReportMeta(report, shareUrl) {
  if (!report) {
    resetPageMeta();
    return;
  }

  const title = `${report.company} ${report.role} | Career Signal`;
  const description = report.headline || report.signal_summary?.slice(0, 160) || DEFAULT_DESCRIPTION;

  document.title = title;
  setMeta("description", description, true);
  setMeta("og:title", title);
  setMeta("og:description", description);
  setMeta("og:type", "website");
  setMeta("og:url", shareUrl || window.location.href);
  setMeta("twitter:card", "summary_large_image", true);
  setMeta("twitter:title", title, true);
  setMeta("twitter:description", description, true);
}

export function resetPageMeta() {
  document.title = DEFAULT_TITLE;
  setMeta("description", DEFAULT_DESCRIPTION, true);
  setMeta("og:title", DEFAULT_TITLE);
  setMeta("og:description", DEFAULT_DESCRIPTION);
}
