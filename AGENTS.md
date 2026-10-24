<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules
- Wedding details live only in `src/config/wedding.ts`; components read from it to avoid inconsistent copies.
- Frame naming/loading params live in `src/config/frames.ts`, scene/text timing in `src/config/scenes.ts`; keep them separate from canvas/scroll logic so they can be tuned without code changes.
- Frames are served from `public/frames/` and drawn on one canvas via the bounded `FrameLoader`; never import frames into the bundle or render one DOM node per frame.
- Text overlays are derived purely from the scroll-selected frame (no timers) so reverse scrolling stays in sync.
