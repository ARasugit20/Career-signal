import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const paths = [
  path.join(__dirname, "../client/src/data/companies.json"),
  path.join(__dirname, "../server/data/companies.json")
];

const SECOND_ROLE_CONFIG = {
  "swe-intern": {
    key: "swe-fulltime",
    title: "Software Engineer I",
    signalShift: {
      strong: ["Production ownership", "End-to-end feature delivery", "Code review discipline"],
      developing: ["Cross-service debugging", "Observability and SLO thinking"],
      gap_risk: ["Large-scale incident response", "Cost-aware architecture trade-offs"]
    },
    framing: "Frame every story around measurable production impact and how you reduced risk for the team."
  },
  "sde-intern": {
    key: "sde-fulltime",
    title: "Software Development Engineer I",
    signalShift: {
      strong: ["Production backend services", "Ownership of end-to-end features"],
      developing: ["Service observability", "Cross-team API contracts"],
      gap_risk: ["Large-scale distributed debugging", "Cost-aware architecture decisions"]
    },
    framing: "Lead with ownership metrics: latency, error rate, or cost saved — not just features shipped."
  }
};

function cloneRole(baseRole, config, companyName) {
  const projects = (baseRole.top_projects || []).map((p, i) => ({
    ...p,
    title: i === 0 ? `${p.title} (Production Hardening)` : p.title,
    why: p.why.replace(/\.$/, "") + ` — positioned for full-time ${companyName} hiring bar.`,
    interview_angle:
      (p.interview_angle || "") +
      " Emphasize on-call readiness, rollback strategy, and post-launch metrics."
  }));

  return {
    title: config.title,
    signals: {
      strong: config.signalShift.strong,
      developing: config.signalShift.developing,
      gap_risk: config.signalShift.gap_risk
    },
    jd_keywords: [
      ...(baseRole.jd_keywords || []).slice(0, 6),
      "production systems",
      "ownership",
      "on-call",
      "code reviews",
      "system design"
    ],
    top_projects: projects,
    course_rec: baseRole.course_rec,
    framing_tip: config.framing
  };
}

function addSecondRoles(companies) {
  let added = 0;
  for (const company of companies) {
    const roleKeys = Object.keys(company.roles || {});
    if (roleKeys.length !== 1) continue;

    const internKey = roleKeys[0];
    const config = SECOND_ROLE_CONFIG[internKey];
    if (!config) {
      console.warn(`No template for ${company.id} role key ${internKey}`);
      continue;
    }
    if (company.roles[config.key]) continue;

    company.roles[config.key] = cloneRole(company.roles[internKey], config, company.name);
    added++;
  }
  return added;
}

for (const filePath of paths) {
  const companies = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const count = addSecondRoles(companies);
  fs.writeFileSync(filePath, JSON.stringify(companies, null, 2) + "\n");
  console.log(`${filePath}: added ${count} second roles`);
}
