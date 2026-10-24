import { useEffect, useRef, useState } from "react";
import { FRAME_CONFIG, LOADER_CONFIG, SCROLL_CONFIG, frameUrl } from "@/config/frames";
import { visibleBlockIds } from "@/config/scenes";
import { WEDDING, venueFullAddress } from "@/config/wedding";
import { FrameLoader, type LoaderStatus } from "@/lib/frame-loader";
import { TextOverlay } from "./TextOverlay";

const profileFor = () =>
  window.innerWidth < LOADER_CONFIG.mobileBreakpoint ? LOADER_CONFIG.mobile : LOADER_CONFIG.desktop;

/** Maps scroll progress (0–1) to a frame index. Replace for custom easing/mapping. */
export function progressToFrame(progress: number, count = FRAME_CONFIG.frameCount) {
  const p = Math.min(1, Math.max(0, progress));
  return Math.min(count - 1, Math.floor(p * count));
}

export function CinematicInvitation() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loaderRef = useRef<FrameLoader | null>(null);
  const frameRef = useRef(0);
  const drawnRef = useRef<HTMLImageElement | null>(null);
  const [frame, setFrame] = useState(0);
  const [status, setStatus] = useState<LoaderStatus>("probing");
  const [isDev] = useState(() => import.meta.env.DEV);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const section = sectionRef.current!;
    const ctx = canvas.getContext("2d", { alpha: false })!;
    const loader = new FrameLoader(FRAME_CONFIG.frameCount, profileFor());
    loaderRef.current = loader;
    let raf = 0;
    let alive = true;

    const draw = (force = false) => {
      const img = loader.nearest(frameRef.current);
      if (!img || !img.complete || img.naturalWidth === 0) return;
      if (!force && img === drawnRef.current) return;
      drawnRef.current = img;
      if (canvas.width > 0 && canvas.height > 0) {
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
    };

    const sizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      // Fallback width if layout hasn't settled yet on mobile
      const fallbackW = canvas.parentElement?.clientWidth || window.innerWidth;
      const clientW = rect.width > 0 ? rect.width : fallbackW;
      // Never exceed native frame resolution.
      const w = Math.min(Math.round(clientW * dpr), FRAME_CONFIG.width);
      if (w > 0) {
        canvas.width = w;
        canvas.height = Math.round((w * FRAME_CONFIG.height) / FRAME_CONFIG.width);
        draw(true);
      }
    };

    const update = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const progress = total > 0 ? -rect.top / total : 0;
      const f = progressToFrame(progress);
      if (f !== frameRef.current) {
        frameRef.current = f;
        loader.setCurrent(f);
        setFrame(f);
        draw();
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      loader.setProfile(profileFor());
      sizeCanvas();
      onScroll();
    };

    loader.onFrameLoaded = (i) => {
      // Redraw if newly loaded frame is close to current position or if nothing has drawn yet
      if (!drawnRef.current || Math.abs(i - frameRef.current) <= 8) {
        draw(true);
      }
    };

    loader.probe().then((ok) => {
      if (!alive) return;
      setStatus(ok ? "ready" : "missing");
      if (ok) {
        sizeCanvas();
        update();
        loader.setCurrent(frameRef.current);
        loader.preload(20);
      }
    });

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    const ro = new ResizeObserver(() => sizeCanvas());
    ro.observe(canvas);
    update();

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
      loader.dispose();
    };
  }, []);

  const visible = visibleBlockIds(frame);

  return (
    <section
      ref={sectionRef}
      aria-label="Animated wedding invitation"
      className="relative bg-paper"
      style={{
        height: `${SCROLL_CONFIG.scrollLengthVh}vh`,
        minHeight: `${SCROLL_CONFIG.scrollLengthVh}svh`,
      }}
    >
      {/* Accessible text version of the invitation */}
      <div className="sr-only">
        <h1>
          {WEDDING.groom} with {WEDDING.bride}
        </h1>
        <p>
          “{WEDDING.scripture.text}” — {WEDDING.scripture.reference}.
        </p>
        <p>
          Save the Date: {WEDDING.dateShort}. Wedding Begins at {WEDDING.timeLabel}.
        </p>
        <p>Join us at {venueFullAddress()}.</p>
        <p>{WEDDING.closingMessage}</p>
      </div>

      <div className="sticky top-0 flex h-screen min-h-svh w-full items-center justify-center overflow-hidden bg-paper">
        <div className="portrait-stage">
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="absolute inset-0 block h-full w-full"
          />

          {status !== "ready" && <StagePlaceholder status={status} />}

          <TextOverlay visible={visible} />
        </div>
      </div>
    </section>
  );
}

function StagePlaceholder({ status }: { status: LoaderStatus }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-baby-soft p-[8cqw] text-center">
      <div className="absolute inset-[4cqw] border border-dashed border-navy/30" />
      {status === "probing" ? (
        <p className="font-sans text-[3.4cqw] uppercase tracking-[0.3em] text-navy-soft">Loading…</p>
      ) : (
        <div className="relative max-w-[80cqw] font-sans text-navy-soft">
          <p className="text-[3cqw] font-semibold uppercase tracking-[0.3em] text-navy">
            Development placeholder
          </p>
          <p className="mt-[3cqw] text-[3.4cqw] leading-relaxed">
            Frame sequence not installed. This is not the final animation.
          </p>
          <p className="mt-[3cqw] text-[3cqw] leading-relaxed">
            Add the JPG frames to <code className="font-mono">public/frames/</code> — expected first
            file: <code className="font-mono break-all">{frameUrl(0)}</code>. Adjust the naming in{" "}
            <code className="font-mono">src/config/frames.ts</code>.
          </p>
        </div>
      )}
    </div>
  );
}
