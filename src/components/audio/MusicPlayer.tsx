import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { WEDDING } from "@/config/wedding";

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const userToggledRef = useRef(false);
  // Music is ON by default
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

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

    const startAudio = () => {
      if (userToggledRef.current) return;
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
      }
    };

    const handleLoaderComplete = () => {
      setIsVisible(true);
      startAudio();
    };

    // Show button and play music right after loading screen finishes
    window.addEventListener("wedding-loader-done", handleLoaderComplete);
    window.addEventListener("user-start-audio", handleLoaderComplete);

    // Fallback user interaction listeners (in case mobile browser requires a touch to unmute)
    window.addEventListener("pointerdown", startAudio, { once: true, passive: true });
    window.addEventListener("touchstart", startAudio, { once: true, passive: true });
    window.addEventListener("click", startAudio, { once: true, passive: true });
    window.addEventListener("keydown", startAudio, { once: true, passive: true });
    window.addEventListener("scroll", startAudio, { once: true, passive: true });

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("canplaythrough", onCanPlay);
      window.removeEventListener("wedding-loader-done", handleLoaderComplete);
      window.removeEventListener("user-start-audio", handleLoaderComplete);
      window.removeEventListener("pointerdown", startAudio);
      window.removeEventListener("touchstart", startAudio);
      window.removeEventListener("click", startAudio);
      window.removeEventListener("keydown", startAudio);
      window.removeEventListener("scroll", startAudio);
      audio.pause();
      audio.src = "";
      audioRef.current = null;
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
  );
}
