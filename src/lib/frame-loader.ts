/**
 * Bounded, progressive frame loader.
 * - Loads the frames nearest the current frame first (ahead weighted over behind).
 * - Limits concurrent requests.
 * - Keeps at most `maxCached` decoded images; evicts those farthest from the current frame.
 * - Never modifies the source files: images are fetched and drawn as-is.
 */
import { frameUrl } from "@/config/frames";

export type LoaderProfile = {
  maxCached: number;
  concurrency: number;
  ahead: number;
  behind: number;
  initial: number;
};

export type LoaderStatus = "probing" | "ready" | "missing";

export class FrameLoader {
  private cache = new Map<number, HTMLImageElement>();
  private inflight = new Map<number, HTMLImageElement>();
  private failed = new Set<number>();
  private current = 0;
  private disposed = false;
  onFrameLoaded?: (index: number) => void;

  constructor(
    private count: number,
    private profile: LoaderProfile,
  ) {}

  setProfile(p: LoaderProfile) {
    this.profile = p;
    this.pump();
  }

  /** Checks whether the first frame exists. Resolves false when frames are not installed. */
  async probe(): Promise<boolean> {
    const ok = await this.load(0);
    return ok;
  }

  get(index: number): HTMLImageElement | undefined {
    return this.cache.get(index);
  }

  /** Nearest loaded frame — used while the exact frame is still loading. */
  nearest(index: number): HTMLImageElement | undefined {
    const exact = this.cache.get(index);
    if (exact) return exact;
    for (let d = 1; d < this.count; d++) {
      const a = this.cache.get(index - d) ?? this.cache.get(index + d);
      if (a) return a;
      if (index - d < 0 && index + d >= this.count) break;
    }
    return undefined;
  }

  setCurrent(index: number) {
    this.current = index;
    this.pump();
  }

  private wanted(): number[] {
    const { ahead, behind } = this.profile;
    const out: number[] = [];
    const c = this.current;
    // Interleave: current, +1, -1, +2, +3, -2 … (ahead is prioritised ~2:1 over behind).
    let b = 1;
    for (let i = 0; i <= ahead; i++) {
      out.push(c + i);
      if (i > 0 && i % 2 === 0 && b <= behind) out.push(c - b++);
    }
    while (b <= behind) out.push(c - b++);
    return out.filter((i, k, arr) => i >= 0 && i < this.count && arr.indexOf(i) === k);
  }

  /** Preload an initial batch of frames immediately */
  preload(count = this.profile.initial) {
    const n = Math.min(count, this.count);
    for (let i = 0; i < n; i++) {
      if (!this.cache.has(i) && !this.inflight.has(i) && !this.failed.has(i)) {
        void this.load(i).then(() => this.pump());
      }
    }
  }

  private pump() {
    if (this.disposed) return;
    const wanted = this.wanted();
    const wantedSet = new Set(wanted);
    // Only cancel requests that drifted far out of the active window (>35 frames away).
    // This prevents mobile scroll events from cancelling in-flight downloads before they finish.
    for (const [i, img] of this.inflight) {
      if (!wantedSet.has(i) && Math.abs(i - this.current) > 35) {
        img.src = "";
        this.inflight.delete(i);
      }
    }
    for (const i of wanted) {
      if (this.inflight.size >= this.profile.concurrency) break;
      if (this.cache.has(i) || this.inflight.has(i) || this.failed.has(i)) continue;
      void this.load(i).then(() => this.pump());
    }
    this.evict();
  }

  private evict() {
    const max = this.profile.maxCached;
    if (this.cache.size <= max) return;
    const keys = [...this.cache.keys()].sort(
      (a, b) => Math.abs(b - this.current) - Math.abs(a - this.current),
    );
    for (const k of keys.slice(0, this.cache.size - max)) {
      const img = this.cache.get(k);
      if (img) img.src = ""; // release decoded memory
      this.cache.delete(k);
    }
  }

  private load(i: number): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      this.inflight.set(i, img);
      const done = (ok: boolean) => {
        if (this.inflight.get(i) !== img) return resolve(false); // cancelled
        this.inflight.delete(i);
        if (this.disposed) return resolve(false);
        if (ok) {
          this.cache.set(i, img);
          this.onFrameLoaded?.(i);
        } else {
          this.failed.add(i);
        }
        resolve(ok);
      };
      img.onload = () => {
        done(true);
      };
      img.onerror = () => done(false);
      img.src = frameUrl(i);
    });
  }

  get failedCount() {
    return this.failed.size;
  }

  dispose() {
    this.disposed = true;
    for (const img of this.inflight.values()) img.src = "";
    for (const img of this.cache.values()) img.src = "";
    this.inflight.clear();
    this.cache.clear();
  }
}
