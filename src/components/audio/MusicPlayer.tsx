import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { WEDDING } from "@/config/wedding";

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const audio = new Audio(WEDDING.music.src);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0.6;
    audioRef.current = audio;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onCanPlay = () => setIsLoaded(true);

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("canplaythrough", onCanPlay);

    // Attempt autoplay immediately upon opening
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // Autoplay blocked by browser policy.
          // Listen for the visitor's first gesture anywhere (scroll, tap, click) to start audio smoothly.
          setIsPlaying(false);

          const startAudioOnGesture = () => {
            if (audioRef.current && audioRef.current.paused) {
              audioRef.current
                .play()
                .then(() => {
                  setIsPlaying(true);
                })
                .catch(() => {});
            }
            cleanupGestureListeners();
          };

          const gestureEvents = ["pointerdown", "touchstart", "click", "keydown", "scroll"];
          const cleanupGestureListeners = () => {
            gestureEvents.forEach((evt) => {
              window.removeEventListener(evt, startAudioOnGesture);
            });
          };

          gestureEvents.forEach((evt) => {
            window.addEventListener(evt, startAudioOnGesture, { once: true, passive: true });
          });
        });
    }

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("canplaythrough", onCanPlay);
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, []);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
  };

  return (
    <button
      type="button"
      onClick={toggleMusic}
      className="group fixed top-4 right-4 sm:top-6 sm:right-6 z-50 flex items-center gap-2 rounded-full bg-paper/85 px-3.5 py-2 sm:px-4 sm:py-2.5 shadow-md backdrop-blur-md border border-navy/15 text-navy transition-all duration-300 hover:bg-paper hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
      aria-label={isPlaying ? "Mute background music" : "Play background music"}
      title={isPlaying ? "Mute music" : "Play music"}
    >
      <span className="relative flex h-5 w-5 items-center justify-center">
        {isPlaying ? (
          <>
            <Volume2 className="h-4 w-4 text-navy transition-transform duration-300 group-hover:scale-110" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-navy/40 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-navy" />
            </span>
          </>
        ) : (
          <VolumeX className="h-4 w-4 text-navy/60 transition-transform duration-300 group-hover:scale-110" />
        )}
      </span>

      <span className="font-sans text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-navy">
        {isPlaying ? "Music On" : "Music Off"}
      </span>

      {/* Gentle animated equalizer wave when music is playing */}
      {isPlaying && (
        <span className="flex items-end gap-0.5 h-3 ml-0.5" aria-hidden="true">
          <span className="w-0.5 bg-navy rounded-full animate-[pulse_0.8s_ease-in-out_infinite] h-2.5" />
          <span className="w-0.5 bg-navy rounded-full animate-[pulse_1.2s_ease-in-out_infinite_0.2s] h-3" />
          <span className="w-0.5 bg-navy rounded-full animate-[pulse_0.9s_ease-in-out_infinite_0.4s] h-1.5" />
        </span>
      )}
    </button>
  );
}
