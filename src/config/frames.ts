/**
 * FRAME SEQUENCE CONFIGURATION — edit this file in Antigravity once the JPGs
 * are copied into `public/frames/`. Nothing else needs to change.
 *
 * Source: 1080 × 1920, 20 FPS, ~14.792 s → ~296 JPG frames.
 * Files are served as-is from /frames/ (never resized or recompressed).
 */
export const FRAME_CONFIG = {
  /** Public URL folder (maps to `public/frames/`). */
  basePath: "/frames/",
  /** Filename prefix, e.g. "frame_" for frame_0001.jpg. EZGIF often uses "ezgif-frame-". */
  prefix: "ezgif-frame-",
  /** Zero-padding width of the number: 4 → 0001, 3 → 001. */
  padLength: 3,
  /** File extension including the dot. */
  extension: ".jpg",
  /** Number of the first file (1 for frame_0001.jpg, 0 for frame_0000.jpg). */
  firstNumber: 1,
  /** Total number of frames — set to the actual count in public/frames/. */
  frameCount: 296,
  /** Native frame size (used for the 9:16 stage and canvas drawing). */
  width: 1080,
  height: 1920,
} as const;

/** Builds the URL for a 0-based frame index. Replace this if your naming is irregular. */
export function frameUrl(index: number): string {
  const n = String(FRAME_CONFIG.firstNumber + index).padStart(FRAME_CONFIG.padLength, "0");
  return `${FRAME_CONFIG.basePath}${FRAME_CONFIG.prefix}${n}${FRAME_CONFIG.extension}`;
}

/**
 * LOADING / MEMORY PARAMETERS — tune after testing on real devices.
 * Full-resolution 1080×1920 frames are ~8 MB each once decoded, so the cache is bounded.
 */
export const LOADER_CONFIG = {
  mobile: { maxCached: 48, concurrency: 3, ahead: 24, behind: 10, initial: 12 },
  desktop: { maxCached: 120, concurrency: 5, ahead: 45, behind: 20, initial: 20 },
  /** Below this width (px) the mobile profile is used. */
  mobileBreakpoint: 768,
};

/**
 * SCROLL DISTANCE — how much page scroll drives the whole animation,
 * in viewport heights. Larger = slower animation per scroll.
 */
export const SCROLL_CONFIG = {
  scrollLengthVh: 900,
};
