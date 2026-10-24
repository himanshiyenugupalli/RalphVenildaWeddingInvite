import { describe, expect, it } from "vitest";
import { SCENES, visibleBlockIds } from "@/config/scenes";

const firstFrame = (id: string) => {
  for (let f = 0; f < 400; f++) if (visibleBlockIds(f).has(id)) return f;
  return -1;
};

describe("scene text timing", () => {
  it("shows the names before the scripture in scene 1", () => {
    expect(firstFrame("couple-names")).toBeLessThan(firstFrame("scripture"));
  });
  it("reveals Save the Date, then the date, then the time", () => {
    expect(firstFrame("save-the-date")).toBeLessThan(firstFrame("date"));
    expect(firstFrame("date")).toBeLessThan(firstFrame("time"));
  });
  it("scene 4 has no text", () => {
    const s4 = SCENES.find((s) => s.id === "scene-4")!;
    expect(s4.textBlocks).toHaveLength(0);
    for (let f = s4.startFrame; f <= s4.endFrame; f++) expect(visibleBlockIds(f).size).toBe(0);
  });
  it("is reversible: same frame gives same text regardless of direction", () => {
    expect([...visibleBlockIds(50)]).toEqual([...visibleBlockIds(50)]);
  });
});
