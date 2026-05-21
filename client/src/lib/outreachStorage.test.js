import { describe, expect, it } from "vitest";
import {
  exportOutreachEntries,
  getFollowUpsDueThisWeek,
  importOutreachEntries
} from "./outreachStorage";

describe("outreachStorage helpers", () => {
  it("exports and imports outreach entries", () => {
    const entries = [
      {
        id: "1",
        company: "Amazon",
        followUpDate: "2026-05-25"
      }
    ];

    const serialized = exportOutreachEntries(entries);
    const restored = importOutreachEntries(serialized);

    expect(restored).toEqual(entries);
  });

  it("calculates follow-ups due this week", () => {
    const entries = [
      { id: "1", followUpDate: "2026-05-22" },
      { id: "2", followUpDate: "2026-06-15" }
    ];
    const due = getFollowUpsDueThisWeek(entries, new Date("2026-05-21"));
    expect(due.map((item) => item.id)).toEqual(["1"]);
  });
});
