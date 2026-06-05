import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { buildAppUrl, buildShareUrl, getTabFromUrl } from "./shareUrl";

describe("shareUrl", () => {
  beforeEach(() => {
    vi.stubGlobal("window", {
      location: {
        pathname: "/",
        search: "?tab=gap",
        origin: "https://career-signal.vercel.app"
      }
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("reads valid tab from URL", () => {
    expect(getTabFromUrl("?tab=outreach")).toBe("outreach");
    expect(getTabFromUrl("?tab=invalid")).toBe("signal");
  });

  it("builds app URL with tab param", () => {
    expect(buildAppUrl({ tab: "gap" })).toBe("/?tab=gap");
    expect(buildAppUrl({ tab: "signal" })).toBe("/");
  });

  it("preserves tab when building share URL", () => {
    window.location.search = "?tab=gap";
    const url = buildShareUrl("amazon", "sde-intern");
    expect(url).toContain("company=amazon");
    expect(url).toContain("role=sde-intern");
    expect(url).toContain("tab=gap");
  });
});
