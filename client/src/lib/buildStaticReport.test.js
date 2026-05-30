import { describe, expect, it } from "vitest";
import { buildStaticReport } from "./buildStaticReport";
import { validateReportSchema } from "./reportSchema";
import companies from "../data/companies.json";

const PAIRS = [
  ["amazon", "sde-intern"],
  ["palantir", "swe-intern"],
  ["coinbase", "swe-fulltime"]
];

describe("buildStaticReport", () => {
  it.each(PAIRS)("returns valid schema for %s / %s", (companyId, roleId) => {
    const company = companies.find((item) => item.id === companyId);
    const role = company.roles[roleId];
    const report = buildStaticReport(company, role);
    const validation = validateReportSchema(report);

    expect(validation.ok).toBe(true);
    expect(report.top_projects.length).toBeGreaterThanOrEqual(3);
    expect(report.skill_keywords.length).toBeGreaterThan(0);
  });

  it("creates dataset recommendation when a project has dataset", () => {
    const company = companies.find((item) => item.id === "google");
    const role = company.roles["swe-intern"];
    const report = buildStaticReport(company, role);

    expect(report.dataset_rec).not.toBeNull();
    expect(report.dataset_rec.url).toContain("kaggle.com/search");
  });
});
