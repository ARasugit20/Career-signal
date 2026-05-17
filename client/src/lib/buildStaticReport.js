function toDatasetUrl(datasetName) {
  if (!datasetName) return null;
  const slug = encodeURIComponent(datasetName);
  return `https://www.kaggle.com/search?q=${slug}`;
}

function buildHeadline(companyName, roleTitle, roleData) {
  const strongest = roleData.signals?.strong || [];
  if (strongest.length >= 2) {
    return `${companyName} prioritizes candidates who can ship ${strongest[0].toLowerCase()} and communicate ${strongest[1].toLowerCase()}.`;
  }
  return `${companyName} prioritizes candidates who can ship production-ready work for ${roleTitle}.`;
}

function buildSummary(roleData) {
  const strong = roleData.signals?.strong || [];
  const developing = roleData.signals?.developing || [];
  const gap = roleData.signals?.gap_risk || [];

  return [
    `The profile that gets interviews shows proof of ${strong.slice(0, 2).join(" and ").toLowerCase()}.`,
    developing.length
      ? `Your next edge comes from leveling up ${developing[0].toLowerCase()}.`
      : "Your next edge comes from showing depth through end-to-end project execution.",
    gap.length
      ? `A common miss is not showing evidence of ${gap[0].toLowerCase()}.`
      : "Avoid generic tutorial clones by grounding every project in a concrete business constraint."
  ].join(" ");
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

function buildGapActions(roleData) {
  return (roleData.signals?.gap_risk || []).map((gap) => ({
    gap,
    action: `Build one scoped project feature that proves ${gap.toLowerCase()}.`
  }));
}

export function buildStaticReport(companyData, roleData) {
  return {
    company: companyData.name,
    role: roleData.title,
    headline: buildHeadline(companyData.name, roleData.title, roleData),
    signal_summary: buildSummary(roleData),
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
      industry: companyData.industry
    },
    gap_actions: buildGapActions(roleData)
  };
}
