import { useEffect, useState } from "react";
import { WEDDING } from "@/config/wedding";

interface WeddingLoaderProps {
  progress: number;
  loadedCount?: number;
  totalCount?: number;
  isReady: boolean;
  onEnter: () => void;
  fadeOut: boolean;
}

export function WeddingLoader({
  progress,
  isReady,
  onEnter,
  fadeOut,
}: WeddingLoaderProps) {
  const [autoEntered, setAutoEntered] = useState(false);

  // Optional auto-enter after a short delay once 100% loaded
  useEffect(() => {
    if (isReady && !autoEntered) {
      const timer = setTimeout(() => {
        setAutoEntered(true);
        onEnter();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isReady, autoEntered, onEnter]);

  return (
    <div
      className={`fixed inset-0 z-40 flex flex-col items-center justify-center bg-paper px-6 transition-all duration-700 ${
        fadeOut ? "opacity-0 pointer-events-none scale-102" : "opacity-100 scale-100"
      }`}
      aria-label="Loading Wedding Invitation"
    >
      <div className="relative mb-5 sm:mb-6">
        <img
          src="/monogram.jpg"
          alt="Ralph & Venilda Monogram"
          className="h-28 w-28 sm:h-36 sm:w-36 rounded-3xl object-contain shadow-md border border-[#c4a460]/30 bg-paper p-2 transition-transform duration-500 hover:scale-105"
        />
        {/* Subtle decorative pulsing halo */}
        <div className="absolute inset-0 -z-10 rounded-3xl bg-[#c4a460]/15 blur-xl animate-pulse" />
      </div>

      <h1 className="font-script text-4xl sm:text-5xl text-navy text-center leading-tight">
        {WEDDING.groom} &amp; {WEDDING.bride}
      </h1>

      {!isReady ? (
        <div className="mt-7 flex flex-col items-center w-full max-w-xs">
          <div className="flex w-full items-center justify-between text-xs font-sans tracking-[0.18em] text-navy/70 mb-2">
            <span className="font-serif italic text-base text-navy/85">Wedding Loading…</span>
            <span className="font-sans font-medium text-navy">{progress}%</span>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-navy/10">
            <div
              className="h-full bg-gradient-to-r from-baby via-navy to-[#c4a460] transition-all duration-200 ease-out rounded-full"
              style={{ width: `${Math.max(4, progress)}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="mt-8 flex flex-col items-center animate-[fadeIn_0.5s_ease-out]">
          <button
            type="button"
            onClick={onEnter}
            className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-navy px-8 py-3.5 font-sans text-xs uppercase tracking-[0.25em] text-paper transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:bg-navy-soft active:translate-y-0 active:scale-95 shadow-md cursor-pointer"
          >
            <span>Open Invitation</span>
            <span className="text-sm">✦</span>
          </button>
        </div>
      )}
    </div>
  );
}
