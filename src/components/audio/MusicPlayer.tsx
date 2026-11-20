import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { WEDDING } from "@/config/wedding";

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const userToggledRef = useRef(false);
  // Music is ON by default
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.6;

    const playAudio = () => {
      if (userToggledRef.current) return;
      if (audio.paused) {
        audio
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Browser autoplay policy prevented cold sound without gesture.
            // Will automatically play on the very first touch/scroll/click.
          });
      }
    };

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("canplaythrough", playAudio);
    audio.addEventListener("loadeddata", playAudio);

    // Try playing immediately upon mount
    playAudio();

    const handleLoaderComplete = () => {
      setIsVisible(true);
      playAudio();
    };

    // Trigger right when loading screen completes
    window.addEventListener("wedding-loader-done", handleLoaderComplete);
    window.addEventListener("user-start-audio", handleLoaderComplete);

    // Capture any user gesture anywhere on screen (first touch, scroll, swipe, click)
    const gestureEvents = ["pointerdown", "touchstart", "scroll", "wheel", "click", "keydown"] as const;
    gestureEvents.forEach((evt) => {
      window.addEventListener(evt, playAudio, { once: true, passive: true });
    });

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("canplaythrough", playAudio);
      audio.removeEventListener("loadeddata", playAudio);
      window.removeEventListener("wedding-loader-done", handleLoaderComplete);
      window.removeEventListener("user-start-audio", handleLoaderComplete);
      gestureEvents.forEach((evt) => {
        window.removeEventListener(evt, playAudio);
      });
    };
  }, []);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    userToggledRef.current = true;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={WEDDING.music.src}
        loop
        autoPlay
        playsInline
        preload="auto"
      />
      <button
        type="button"
        onClick={toggleMusic}
        className={`group fixed top-4 sm:top-6 inset-x-0 mx-auto w-fit z-50 flex items-center justify-center rounded-full bg-paper/90 p-2.5 sm:p-3 shadow-md backdrop-blur-md border border-navy/15 text-navy transition-all duration-700 ease-out hover:bg-paper hover:shadow-lg hover:scale-110 active:scale-95 cursor-pointer ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
        aria-label={isPlaying ? "Mute background music" : "Play background music"}
        title={isPlaying ? "Mute music" : "Play music"}
      >
        <span className="relative flex h-5 w-5 items-center justify-center">
          {isPlaying ? (
            <>
              <Volume2 className="h-4.5 w-4.5 text-navy transition-transform duration-300 group-hover:scale-110" />
              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-navy/40 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-navy" />
              </span>
            </>
          ) : (
            <VolumeX className="h-4.5 w-4.5 text-navy/60 transition-transform duration-300 group-hover:scale-110" />
          )}
        </span>

        {/* Gentle animated equalizer wave when music is playing */}
        {isPlaying && (
          <span className="flex items-end gap-0.5 h-3.5 ml-1 pr-0.5" aria-hidden="true">
            <span className="w-0.5 bg-navy rounded-full animate-[pulse_0.8s_ease-in-out_infinite] h-2.5" />
            <span className="w-0.5 bg-navy rounded-full animate-[pulse_1.2s_ease-in-out_infinite_0.2s] h-3.5" />
            <span className="w-0.5 bg-navy rounded-full animate-[pulse_0.9s_ease-in-out_infinite_0.4s] h-2" />
          </span>
        )}
      </button>
    </>
  );
}
