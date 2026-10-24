# Ralph & Venilda — Frame Setup & Tuning (for Antigravity)

## 1. Install the frames
1. Extract your ZIP locally.
2. Copy every JPG into `public/frames/` (no subfolders). Do not resize or recompress.
3. Edit `src/config/frames.ts`:
   | Field | Example for `frame_0001.jpg` | Example for `ezgif-frame-001.jpg` |
   |---|---|---|
   | `prefix` | `"frame_"` | `"ezgif-frame-"` |
   | `padLength` | `4` | `3` |
   | `firstNumber` | `1` | `1` |
   | `extension` | `".jpg"` | `".jpg"` |
   | `frameCount` | actual file count | actual file count |
   Count files: `ls public/frames/*.jpg | wc -l`.
   For irregular names, replace the `frameUrl()` function in the same file.
4. Run the dev server — the placeholder disappears once the first frame loads.

## 2. Tune scenes and text timing
- `src/config/scenes.ts` holds scene frame ranges and per-block `startProgress`/`endProgress`.
- The current ranges are **provisional estimates**, not verified scene boundaries.
- In development, a small `frame N/total` counter appears top-right of the stage. Scroll to each scene change, note the frame number (counter is 1-based; config is 0-based → subtract 1), and update `startFrame`/`endFrame`.
- Text is derived only from the current frame, so scrolling backwards always restores the matching text.

## 3. Scroll length & performance
- `SCROLL_CONFIG.scrollLengthVh` — total scroll distance for the animation.
- `LOADER_CONFIG` — per-device `maxCached` (decoded images kept in memory; each 1080×1920 frame ≈ 8 MB decoded), `concurrency`, `ahead`/`behind` preload window.
- Test on a real phone; lower `maxCached`/`ahead` if memory pressure or stutter appears. Smoothness depends on device and network — no zero-lag guarantee.

## 4. Other content
- All wedding details: `src/config/wedding.ts` (single source of truth).
- Livestream: set `livestreamUrl` in the same file. While empty, the button shows "Livestream link coming soon".
