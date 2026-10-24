import { useEffect, useRef, useState, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
  scale?: number;
  /** When false (default), element re-animates smoothly as you scroll back and forth */
  once?: boolean;
}

/**
 * High-performance scroll-driven reveal component using IntersectionObserver.
 * Smoothly lifts, scales, and fades elements into view as the user scrolls.
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
  yOffset = 36,
  scale = 0.96,
  once = false,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  return (
    <div
      ref={ref}
      style={{
        transitionProperty: "opacity, transform, filter",
        transitionDuration: "750ms",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        transitionDelay: `${delay}ms`,
        transform: isVisible ? "none" : `translateY(${yOffset}px) scale(${scale})`,
        opacity: isVisible ? 1 : 0,
        filter: isVisible ? "none" : "blur(3px)",
        willChange: "transform, opacity, filter",
      }}
      className={className}
    >
      {children}
    </div>
  );
}
