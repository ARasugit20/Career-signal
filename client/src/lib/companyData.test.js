import { describe, expect, it } from "vitest";
import companies from "../data/companies.json";

describe("company dataset scale", () => {
  it("has at least 25 companies with two roles each", () => {
    expect(companies.length).toBeGreaterThanOrEqual(25);
    for (const company of companies) {
      const roleCount = Object.keys(company.roles || {}).length;
      expect(roleCount, `${company.id} should have 2 roles`).toBeGreaterThanOrEqual(2);
    }
  });

  it("includes curated expansion companies", () => {
    const ids = new Set(companies.map((c) => c.id));
    ["palantir", "airbnb", "uber", "coinbase", "nvidia"].forEach((id) => {
      expect(ids.has(id), `missing ${id}`).toBe(true);
    });
  });
});
