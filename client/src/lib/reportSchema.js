/** Required fields for a static Signal Report consumed by the UI. */
export const REPORT_REQUIRED_KEYS = [
  "company",
  "role",
  "headline",
  "signal_summary",
  "top_projects",
  "skill_keywords",
  "dataset_rec",
  "course_rec",
  "framing_tip",
  "signal_bands",
  "company_meta",
  "gap_actions"
];

export function validateReportSchema(report) {
  if (!report || typeof report !== "object") {
    return { ok: false, missing: REPORT_REQUIRED_KEYS };
  }

  const missing = REPORT_REQUIRED_KEYS.filter((key) => !(key in report));
  if (missing.length) return { ok: false, missing };

  if (!Array.isArray(report.top_projects) || report.top_projects.length < 1) {
    return { ok: false, missing: ["top_projects (non-empty array)"] };
  }

  if (!report.signal_bands?.strong || !report.signal_bands?.developing || !report.signal_bands?.gap) {
    return { ok: false, missing: ["signal_bands.strong/developing/gap"] };
  }

  return { ok: true, missing: [] };
}
