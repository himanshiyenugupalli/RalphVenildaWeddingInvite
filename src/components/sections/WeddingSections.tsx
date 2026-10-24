import { CalendarPlus, MapPin, Video } from "lucide-react";
import { WEDDING, directionsUrl } from "@/config/wedding";
import { downloadIcs, googleCalendarUrl } from "@/lib/calendar";
import { Reveal } from "@/components/ui/Reveal";

const btn =
  "group inline-flex items-center justify-center gap-2.5 rounded-full bg-navy px-8 py-3.5 font-sans text-sm uppercase tracking-[0.2em] text-paper transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:bg-navy-soft active:translate-y-0 active:scale-95 shadow-sm";
const btnGhost =
  "group inline-flex items-center justify-center gap-2.5 rounded-full border-2 border-navy px-8 py-3.5 font-sans text-sm uppercase tracking-[0.2em] text-navy transition-all duration-300 hover:-translate-y-1 hover:bg-baby/30 hover:shadow-md active:translate-y-0 active:scale-95";

function Ornament() {
  return (
    <div className="ornament my-6" aria-hidden="true">
      <span className="text-xs">✦</span>
    </div>
  );
}

function Heading({ id, eyebrow, title }: { id: string; eyebrow: string; title: string }) {
  return (
    <header className="text-center">
      <p className="font-sans text-xs uppercase tracking-[0.4em] text-navy-soft">{eyebrow}</p>
      <h2 id={id} className="mt-3 font-serif text-4xl font-medium text-navy md:text-5xl">
        {title}
      </h2>
      <Ornament />
    </header>
  );
}

export function SaveTheDateSection() {
  return (
    <section aria-labelledby="std" className="bg-baby-soft px-6 py-24">
      <div className="mx-auto max-w-xl text-center">
        <Reveal delay={0}>
          <Heading id="std" eyebrow="Ralph & Venilda" title="Save the Date" />
        </Reveal>
        <Reveal delay={120}>
          <p className="font-script text-5xl text-navy md:text-6xl">{WEDDING.dateShort}</p>
        </Reveal>
        <Reveal delay={240}>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button type="button" onClick={downloadIcs} className={btn}>
              <CalendarPlus className="h-4 w-4" aria-hidden="true" /> Save to Calendar
            </button>
            <a href={googleCalendarUrl()} target="_blank" rel="noopener noreferrer" className={btnGhost}>
              Google Calendar
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function WeddingDetailsSection() {
  return (
    <section aria-labelledby="details" className="bg-paper px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal delay={0}>
          <Heading id="details" eyebrow="The Celebration" title="Wedding Details" />
        </Reveal>
        <dl className="grid gap-10 sm:grid-cols-2">
          <Reveal delay={140}>
            <div className="rounded-2xl border border-navy/10 bg-baby-soft/30 p-8 transition-transform duration-300 hover:-translate-y-1">
              <dt className="font-sans text-xs uppercase tracking-[0.35em] text-navy-soft">Date</dt>
              <dd className="mt-3 font-serif text-2xl text-navy">{WEDDING.dateLong}</dd>
            </div>
          </Reveal>
          <Reveal delay={240}>
            <div className="rounded-2xl border border-navy/10 bg-baby-soft/30 p-8 transition-transform duration-300 hover:-translate-y-1">
              <dt className="font-sans text-xs uppercase tracking-[0.35em] text-navy-soft">Time</dt>
              <dd className="mt-3 font-serif text-2xl text-navy">{WEDDING.timeLabel}</dd>
            </div>
          </Reveal>
        </dl>
      </div>
    </section>
  );
}

export function VenueSection() {
  return (
    <section aria-labelledby="venue" className="bg-baby-soft px-6 py-24">
      <div className="mx-auto max-w-xl text-center">
        <Reveal delay={0}>
          <Heading id="venue" eyebrow="Where" title="Venue & Location" />
        </Reveal>
        <Reveal delay={140}>
          <address className="font-serif text-2xl not-italic leading-relaxed text-navy">
            {WEDDING.venue.name}
            <br />
            {WEDDING.venue.locality}
            <br />
            {WEDDING.venue.cityPin}
          </address>
        </Reveal>
        <Reveal delay={260}>
          <a href={directionsUrl()} target="_blank" rel="noopener noreferrer" className={`${btn} mt-10`}>
            <MapPin className="h-4 w-4" aria-hidden="true" /> Get Directions
          </a>
        </Reveal>
      </div>
    </section>
  );
}

export function LiveWeddingSection() {
  const url = WEDDING.livestreamUrl;
  return (
    <section aria-labelledby="live" className="bg-paper px-6 py-24">
      <div className="mx-auto max-w-xl text-center">
        <Reveal delay={0}>
          <Heading id="live" eyebrow="From Afar" title="Live Wedding" />
        </Reveal>
        <Reveal delay={140}>
          <p className="font-serif text-xl leading-relaxed text-navy-soft">
            Can't be with us in person? Join the celebration remotely.
          </p>
        </Reveal>
        <Reveal delay={260}>
          {url ? (
            <a href={url} target="_blank" rel="noopener noreferrer" className={`${btn} mt-10`}>
              <Video className="h-4 w-4" aria-hidden="true" /> Watch Live Wedding
            </a>
          ) : (
            <div className="mt-10 flex flex-col items-center gap-3">
              <button type="button" disabled aria-disabled="true" className={`${btn} cursor-not-allowed opacity-50`}>
                <Video className="h-4 w-4" aria-hidden="true" /> Watch Live Wedding
              </button>
              <p className="font-sans text-xs uppercase tracking-[0.3em] text-navy-soft">
                Livestream link coming soon
              </p>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-navy px-6 py-14 text-center text-paper">
      <Reveal delay={0}>
        <p className="font-script text-4xl">
          {WEDDING.groom} &amp; {WEDDING.bride}
        </p>
      </Reveal>
      <Reveal delay={140}>
        <p className="mt-3 font-sans text-xs uppercase tracking-[0.4em] opacity-80">{WEDDING.dateShort}</p>
      </Reveal>
    </footer>
  );
}
