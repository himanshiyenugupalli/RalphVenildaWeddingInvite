import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { WEDDING } from "@/config/wedding";

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const userToggledRef = useRef(false);
  // Strictly false initially so UI never fakes playing state when browser blocks sound
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.6;
    let loaderDone = false;

    const tryPlay = () => {
      if (userToggledRef.current) return;
      if (audio.paused) {
        audio
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            // Browser autoplay blocked cold sound without gesture.
            // Keep state false so UI never pretends sound is playing when it's silent.
            setIsPlaying(false);
          });
      }
    };

    // Strictly sync UI state with actual audio playback
    const onPlaying = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("play", onPlaying);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onPause);

    const handleLoaderComplete = () => {
      loaderDone = true;
      setIsVisible(true);
      tryPlay();
    };

    // When loading screen completes, reveal button and start music
    window.addEventListener("wedding-loader-done", handleLoaderComplete);
    window.addEventListener("user-start-audio", handleLoaderComplete);

    // Any interaction (scroll, touch, click, swipe) starts audio immediately if blocked earlier
    const handleGesture = () => {
      if (userToggledRef.current) return;
      if (!loaderDone) return;
      if (audio.paused) {
        tryPlay();
      }
    };

    window.addEventListener("pointerdown", handleGesture, { passive: true });
    window.addEventListener("touchstart", handleGesture, { passive: true });
    window.addEventListener("click", handleGesture, { passive: true });
    window.addEventListener("scroll", handleGesture, { passive: true });
    window.addEventListener("wheel", handleGesture, { passive: true });
    window.addEventListener("keydown", handleGesture, { passive: true });

    return () => {
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("play", onPlaying);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onPause);
      window.removeEventListener("wedding-loader-done", handleLoaderComplete);
      window.removeEventListener("user-start-audio", handleLoaderComplete);
      window.removeEventListener("pointerdown", handleGesture);
      window.removeEventListener("touchstart", handleGesture);
      window.removeEventListener("click", handleGesture);
      window.removeEventListener("scroll", handleGesture);
      window.removeEventListener("wheel", handleGesture);
      window.removeEventListener("keydown", handleGesture);
    };
  }, []);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      userToggledRef.current = false;
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    } else {
      userToggledRef.current = true;
      audio.pause();
      setIsPlaying(false);
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={WEDDING.music.src}
        loop
        playsInline
        preload="auto"
      />
      <button
        type="button"
        onClick={toggleMusic}
        className={`group fixed top-4 sm:top-6 inset-x-0 mx-auto w-fit z-50 flex items-center justify-center rounded-full bg-paper/95 p-2.5 sm:p-3 shadow-md backdrop-blur-md border border-navy/20 text-navy transition-all duration-700 ease-out hover:bg-paper hover:shadow-lg hover:scale-110 active:scale-95 cursor-pointer ${
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
            <VolumeX className="h-4.5 w-4.5 text-navy/70 transition-transform duration-300 group-hover:scale-110" />
          )}
        </span>

        {/* Gentle animated equalizer wave ONLY when music is ACTUALLY playing */}
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
