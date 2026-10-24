import { describe, expect, it } from "vitest";
import { buildIcs, weddingStartUtcStamp, googleCalendarUrl } from "@/lib/calendar";

describe("wedding calendar event", () => {
  it("starts at 5:30 PM IST on 1 Jan 2027 (12:00 UTC)", () => {
    expect(weddingStartUtcStamp()).toBe("20270101T120000Z");
  });

  it("has no invented end time", () => {
    expect(buildIcs()).not.toContain("DTEND");
    expect(buildIcs()).not.toContain("DURATION");
  });

  it("uses the approved venue as location", () => {
    expect(buildIcs()).toContain("Varamballi\\, Brahmavara\\, Udupi – 576213");
    expect(googleCalendarUrl()).toContain("ctz=Asia%2FKolkata");
  });
});
