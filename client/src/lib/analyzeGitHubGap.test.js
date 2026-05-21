import { describe, expect, it } from "vitest";
import { compareSkillBands, parseSkillsFromText } from "./analyzeGitHubGap";

describe("analyzeGitHubGap skill parsing", () => {
  it("extracts normalized skill labels from free text", () => {
    const skills = parseSkillsFromText(
      "Built FastAPI + Redis services, React frontend, and deployed with Docker on AWS."
    );

    expect(skills).toContain("Python");
    expect(skills).toContain("Redis");
    expect(skills).toContain("React");
    expect(skills).toContain("Docker");
    expect(skills).toContain("AWS");
  });
});

describe("analyzeGitHubGap band comparison", () => {
  it("builds strong/developing/gap bands correctly", () => {
    const bands = compareSkillBands({
      resumeSkills: ["Python", "React", "Redis"],
      repoSkills: ["Python", "Docker"],
      jdSkills: ["Python", "Redis", "AWS", "Java"]
    });

    expect(bands.strong).toEqual(["Python"]);
    expect(bands.developing).toEqual(["React", "Redis"]);
    expect(bands.gap).toEqual(["AWS", "Java"]);
  });
});
