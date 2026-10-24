import { ALL_TEXT_BLOCKS, type TextBlock } from "@/config/scenes";
import { WEDDING } from "@/config/wedding";

/** Renders a single text block's content by variant. Sizes use container units so text scales with the stage. */
function BlockContent({ block }: { block: TextBlock }) {
  switch (block.variant) {
    case "names":
      return (
        <div className="leading-tight">
          <span className="block font-script text-[14cqw]">{WEDDING.groom}</span>
          <span className="my-[0.5cqw] block font-serif text-[3.6cqw] italic tracking-[0.2em]">with</span>
          <span className="block font-script text-[14cqw]">{WEDDING.bride}</span>
        </div>
      );
    case "scripture":
      return (
        <p className="mx-auto max-w-[82cqw] font-serif text-[4.2cqw] italic leading-snug">
          “{WEDDING.scripture.text}”
          <span className="mt-[1cqw] block not-italic font-sans text-[2.8cqw] uppercase tracking-[0.25em]">
            — {WEDDING.scripture.reference}.
          </span>
        </p>
      );
    case "eyebrow":
      return <p className="font-script text-[8.5cqw] leading-tight">Save the Date</p>;
    case "date":
      return <p className="mt-[1cqw] font-serif text-[5.2cqw] font-semibold tracking-wide">{WEDDING.dateShort}</p>;
    case "time":
      return (
        <p className="mt-[1.5cqw] font-sans text-[2.8cqw] uppercase tracking-[0.25em]">
          Starts at {WEDDING.timeLabel}
        </p>
      );
    case "venueTitle":
      return <p className="font-serif text-[6cqw] font-semibold tracking-[0.3em]">JOIN US AT</p>;
    case "venue":
      return (
        <p className="mx-auto mt-[1.8cqw] max-w-[82cqw] font-serif text-[4.1cqw] leading-snug">
          {WEDDING.venue.name}, {WEDDING.venue.locality}
          <span className="mt-[0.8cqw] block font-sans text-[2.9cqw] tracking-[0.2em]">
            {WEDDING.venue.cityPin}
          </span>
        </p>
      );
    case "closingTop":
      return (
        <p className="mx-auto max-w-[80cqw] text-balance font-serif text-[3.9cqw] italic leading-snug tracking-wide">
          {WEDDING.closingTop}
        </p>
      );
    case "closingBottom":
      return (
        <p className="mx-auto max-w-[80cqw] text-balance font-serif text-[3.9cqw] italic leading-snug tracking-wide">
          {WEDDING.closingBottom}
        </p>
      );
    case "closing":
      return (
        <p className="mx-auto max-w-[78cqw] text-balance font-serif text-[4.5cqw] italic leading-snug">
          {WEDDING.closingMessage}
        </p>
      );
  }
}

/**
 * Overlay above the canvas. All blocks are always mounted (no layout shift);
 * visibility is driven solely by the scroll-selected frame.
 */
export function TextOverlay({ visible }: { visible: Set<string> }) {
  const byPos = (pos: "top" | "bottom") =>
    ALL_TEXT_BLOCKS.filter((b) => b.position === pos);

  const renderStack = (pos: "top" | "bottom") => {
    // Group blocks: couple-names and scripture get their own groups so they render on the exact same place at the bottom.
    const groups = new Map<string, TextBlock[]>();
    for (const b of byPos(pos)) {
      const key = b.id === "couple-names" ? "couple-names"
        : b.id === "scripture" ? "scripture"
        : ["save-the-date", "date", "time"].includes(b.id) ? "s2"
        : ["join-us", "venue"].includes(b.id) ? "s3" : b.id;
      groups.set(key, [...(groups.get(key) ?? []), b]);
    }
    return [...groups.entries()].map(([key, blocks]) => (
      <div
        key={key}
        className={`absolute inset-x-0 px-[6cqw] text-center ${
          pos === "top"
            ? "top-[7%]"
            : key === "closing-bottom"
              ? "bottom-[7%]"
              : "bottom-[3.5%]"
        }`}
      >
        {blocks
          .sort((a, b) => a.order - b.order)
          .map((b) => (
            <div key={b.id} className="reveal stage-text" data-visible={visible.has(b.id)}>
              <BlockContent block={b} />
            </div>
          ))}
      </div>
    ));
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden" aria-hidden="true">
      {renderStack("top")}
      {renderStack("bottom")}
    </div>
  );
}
