function toDatasetUrl(datasetName) {
  if (!datasetName) return null;
  const slug = encodeURIComponent(datasetName);
  return `https://www.kaggle.com/search?q=${slug}`;
}

const INDUSTRY_HEADLINE_BUILDERS = {
  finance: (companyName, roleTitle, strongest) =>
    strongest.length >= 2
      ? `${companyName} screens for ${roleTitle} candidates who can demonstrate ${strongest[0].toLowerCase()} with audit-ready rigor and ${strongest[1].toLowerCase()}.`
      : `${companyName} expects regulated-environment discipline and measurable impact for ${roleTitle}.`,
  insurance: (companyName, roleTitle, strongest) =>
    `${companyName} values ${roleTitle} hires who connect engineering decisions to risk, compliance, and customer trust${
      strongest[0] ? ` — especially ${strongest[0].toLowerCase()}` : ""
    }.`,
  fintech: (companyName, roleTitle, strongest) =>
    `${companyName} looks for ${roleTitle} engineers who ship secure, observable systems${
      strongest[0] ? ` with proof of ${strongest[0].toLowerCase()}` : ""
    }.`,
  "fintech-crypto": (companyName, roleTitle) =>
    `${companyName} prioritizes ${roleTitle} candidates who understand custody, latency, and failure modes in production trading systems.`,
  "aerospace-defense": (companyName, roleTitle) =>
    `${companyName} expects ${roleTitle} candidates to emphasize traceability, reliability, and mission-critical engineering judgment.`,
  saas: (companyName, roleTitle, strongest) =>
    `${companyName} hires ${roleTitle} engineers who show multi-tenant product thinking${
      strongest[0] ? ` and ${strongest[0].toLowerCase()}` : ""
    }.`,
  observability: (companyName, roleTitle) =>
    `${companyName} screens for ${roleTitle} builders who think in metrics, SLOs, and operability from day one.`,
  semiconductors: (companyName, roleTitle) =>
    `${companyName} values ${roleTitle} candidates who bridge software with performance, hardware constraints, and systems depth.`,
  tech: (companyName, roleTitle, strongest, tier) =>
    tier === "FAANG+" || tier === "FAANG"
      ? `${companyName} expects ${roleTitle} candidates to show scale-aware design and ${(strongest[0] || "production ownership").toLowerCase()} at billion-user complexity.`
      : `${companyName} prioritizes ${roleTitle} candidates who ship ${(strongest[0] || "production-ready features").toLowerCase()} with clear trade-off stories.`,
  default: (companyName, roleTitle, strongest) =>
    strongest.length >= 2
      ? `${companyName} prioritizes candidates who can ship ${strongest[0].toLowerCase()} and communicate ${strongest[1].toLowerCase()}.`
      : `${companyName} prioritizes candidates who can ship production-ready work for ${roleTitle}.`
};

function buildHeadline(companyData, roleTitle, roleData) {
  const strongest = roleData.signals?.strong || [];
  const industry = companyData.industry || "tech";
  const builder =
    INDUSTRY_HEADLINE_BUILDERS[industry] || INDUSTRY_HEADLINE_BUILDERS.default;
  return builder(companyData.name, roleTitle, strongest, companyData.tier);
}

function buildSummary(companyData, roleData) {
  const strong = roleData.signals?.strong || [];
  const developing = roleData.signals?.developing || [];
  const gap = roleData.signals?.gap_risk || [];
  const tier = companyData.tier || "target";
  const industry = companyData.industry || "tech";

  const opener =
    industry === "finance" || industry === "fintech" || industry === "fintech-crypto"
      ? `For a ${tier} ${industry} target, recruiters want evidence of ${strong.slice(0, 2).join(" and ").toLowerCase()} tied to business outcomes.`
      : industry === "aerospace-defense"
        ? `Defense hiring at ${tier} tier weights traceability and ${strong[0]?.toLowerCase() || "systems rigor"} over flashy demos.`
        : `The profile that gets interviews at this ${tier} ${industry} company shows proof of ${strong.slice(0, 2).join(" and ").toLowerCase()}.`;

  const developingLine = developing.length
    ? `Your next edge comes from leveling up ${developing[0].toLowerCase()}.`
    : "Your next edge comes from showing depth through end-to-end project execution.";

  const gapLine = gap.length
    ? `A common miss is not showing evidence of ${gap[0].toLowerCase()}.`
    : "Avoid generic tutorial clones by grounding every project in a concrete business constraint.";

  return [opener, developingLine, gapLine].join(" ");
}

function toTopProjects(roleData) {
  return (roleData.top_projects || []).map((project) => ({
    title: project.title,
    why: project.why,
    tech_stack: project.tech || [],
    dataset: project.dataset || null,
    interview_angle: project.interview_angle
  }));
}

function pickDatasetRecommendation(roleData) {
  const withDataset = (roleData.top_projects || []).find((project) => project.dataset);
  if (!withDataset) return null;

  return {
    name: withDataset.dataset,
    url: toDatasetUrl(withDataset.dataset),
    project_angle: withDataset.why
  };
}

function gapMapsToProject(gap, projects) {
  const gapLower = gap.toLowerCase();
  return projects.find((project) => {
    const haystack = `${project.title} ${project.why} ${(project.tech || []).join(" ")}`.toLowerCase();
    const tokens = gapLower.split(/\s+/).filter((t) => t.length > 4);
    return tokens.some((token) => haystack.includes(token));
  });
}

function buildGapAction(gap, projects) {
  const match = gapMapsToProject(gap, projects);
  if (match) {
    return `You're missing evidence of ${gap.toLowerCase()} — the ${match.title} project in this report directly addresses that gap. Ship one feature from it with metrics and a short write-up.`;
  }
  const fallback = projects[0];
  if (fallback) {
    return `Close the ${gap.toLowerCase()} gap by extending ${fallback.title}: add one measurable feature that proves the skill in production-like conditions.`;
  }
  return `Build one scoped project feature that proves ${gap.toLowerCase()} with before/after metrics.`;
}

function buildGapActions(roleData) {
  const projects = roleData.top_projects || [];
  return (roleData.signals?.gap_risk || []).map((gap) => ({
    gap,
    action: buildGapAction(gap, projects)
  }));
}

export function buildStaticReport(companyData, roleData) {
  return {
    company: companyData.name,
    role: roleData.title,
    headline: buildHeadline(companyData, roleData.title, roleData),
    signal_summary: buildSummary(companyData, roleData),
    top_projects: toTopProjects(roleData),
    skill_keywords: roleData.jd_keywords || [],
    dataset_rec: pickDatasetRecommendation(roleData),
    course_rec: roleData.course_rec || null,
    framing_tip: roleData.framing_tip,
    signal_bands: {
      strong: roleData.signals?.strong || [],
      developing: roleData.signals?.developing || [],
      gap: roleData.signals?.gap_risk || []
    },
    company_meta: {
      tier: companyData.tier,
      industry: companyData.industry,
      source_notes:
        roleData.source_notes?.join?.(" · ") ||
        roleData.source_notes ||
        companyData.source_notes ||
        null
    },
    gap_actions: buildGapActions(roleData)
  };
}
