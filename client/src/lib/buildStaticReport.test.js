import { describe, expect, it } from "vitest";
import { buildStaticReport } from "./buildStaticReport";
import companies from "../data/companies.json";

describe("buildStaticReport", () => {
  it("builds a full report shape from curated data", () => {
    const company = companies.find((item) => item.id === "amazon");
    const role = company.roles["sde-intern"];
    const report = buildStaticReport(company, role);

    expect(report.company).toBe("Amazon");
    expect(report.role).toBe("Software Development Engineer Intern");
    expect(report.top_projects.length).toBe(3);
    expect(report.skill_keywords.length).toBeGreaterThan(0);
    expect(report.signal_bands.strong.length).toBeGreaterThan(0);
    expect(report.gap_actions.length).toBeGreaterThan(0);
  });

  it("creates dataset recommendation when a project has dataset", () => {
    const company = companies.find((item) => item.id === "google");
    const role = company.roles["swe-intern"];
    const report = buildStaticReport(company, role);

    expect(report.dataset_rec).not.toBeNull();
    expect(report.dataset_rec.url).toContain("kaggle.com/search");
  });
});
