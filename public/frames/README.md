# Frame sequence goes here

Copy the extracted JPG frames (1080 × 1920, 20 FPS, ~296 files) directly into this folder.
Do not resize or recompress them.

Then open `src/config/frames.ts` and set:
- `prefix`, `padLength`, `extension`, `firstNumber` to match the filenames
  (e.g. `ezgif-frame-001.jpg` → prefix `"ezgif-frame-"`, padLength `3`, firstNumber `1`)
- `frameCount` to the number of files

Until the first frame is found, the site shows a "Development placeholder".
See `FRAMES_SETUP.md` in the project root for full details.
