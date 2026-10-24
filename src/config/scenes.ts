/**
 * SCENE & TEXT TIMING CONFIGURATION
 *
 * ⚠ The frame boundaries below are PROVISIONAL estimates for ~296 frames.
 * They have NOT been verified against the real animation. After installing the
 * JPGs, preview the page (the dev frame counter shows the current frame) and
 * adjust startFrame / endFrame for each scene.
 *
 * Each text block appears while the scene's local progress (0 → 1 across
 * startFrame…endFrame) is between startProgress and endProgress.
 * Everything is derived from the scroll-selected frame, so scrolling
 * backwards restores the earlier text state exactly.
 */
import { WEDDING } from "./wedding";

export type TextPosition = "top" | "bottom";

export type TextBlock = {
  id: string;
  position: TextPosition;
  startProgress: number;
  endProgress: number;
  /** Visual style key — see InvitationTextBlock. */
  variant: "names" | "scripture" | "eyebrow" | "date" | "time" | "venueTitle" | "venue" | "closing" | "closingTop" | "closingBottom";
  /** Order within the same position stack (smaller = higher on screen). */
  order: number;
};

export type Scene = {
  id: string;
  startFrame: number;
  endFrame: number;
  textBlocks: TextBlock[];
};

export const SCENES: Scene[] = [
  {
    id: "scene-1",
    startFrame: 0,
    endFrame: 70,
    textBlocks: [
      // 1st Ralph and Venilda appears at the very bottom…
      { id: "couple-names", position: "bottom", variant: "names", order: 0, startProgress: 0.05, endProgress: 0.45 },
      // …then disappears, after which scripture appears on the exact same place.
      { id: "scripture", position: "bottom", variant: "scripture", order: 1, startProgress: 0.50, endProgress: 0.95 },
    ],
  },
  {
    id: "scene-2",
    startFrame: 71,
    endFrame: 135,
    textBlocks: [
      { id: "save-the-date", position: "top", variant: "eyebrow", order: 0, startProgress: 0.08, endProgress: 0.93 },
      { id: "date", position: "top", variant: "date", order: 1, startProgress: 0.3, endProgress: 0.93 },
      { id: "time", position: "top", variant: "time", order: 2, startProgress: 0.52, endProgress: 0.93 },
    ],
  },
  {
    id: "scene-3",
    startFrame: 136,
    endFrame: 200,
    textBlocks: [
      { id: "join-us", position: "bottom", variant: "venueTitle", order: 0, startProgress: 0.1, endProgress: 0.93 },
      { id: "venue", position: "bottom", variant: "venue", order: 1, startProgress: 0.28, endProgress: 0.93 },
    ],
  },
  // Scene 4 — original animation only, no text.
  { id: "scene-4", startFrame: 201, endFrame: 240, textBlocks: [] },
  {
    id: "scene-5",
    startFrame: 241,
    endFrame: 295,
    textBlocks: [
      // Top: Come share our joy, laughter and happiness
      { id: "closing-top", position: "top", variant: "closingTop", order: 0, startProgress: 0.15, endProgress: 1.01 },
      // Bottom: as we begin this wonderful journey together.
      { id: "closing-bottom", position: "bottom", variant: "closingBottom", order: 0, startProgress: 0.15, endProgress: 1.01 },
    ],
  },
];

/** Returns ids of text blocks visible at a given (0-based) frame. Pure — used by the overlay and tests. */
export function visibleBlockIds(frame: number, scenes: Scene[] = SCENES): Set<string> {
  const ids = new Set<string>();
  for (const s of scenes) {
    if (frame < s.startFrame || frame > s.endFrame) continue;
    const span = Math.max(1, s.endFrame - s.startFrame);
    const p = (frame - s.startFrame) / span;
    for (const b of s.textBlocks) if (p >= b.startProgress && p < b.endProgress) ids.add(b.id);
  }
  return ids;
}

export const ALL_TEXT_BLOCKS = SCENES.flatMap((s) => s.textBlocks);

export { WEDDING };
