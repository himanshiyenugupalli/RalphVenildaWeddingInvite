import { WEDDING, venueFullAddress } from "@/config/wedding";

const pad = (n: number) => String(n).padStart(2, "0");

/** Wedding start converted from venue local time (IST) to a UTC basic-format stamp, e.g. 20270101T120000Z. */
export function weddingStartUtcStamp(): string {
  const { year, month, day, hour, minute } = WEDDING.startLocal;
  const ms = Date.UTC(year, month - 1, day, hour, minute) - WEDDING.utcOffsetMinutes * 60_000;
  const d = new Date(ms);
  return (
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`
  );
}

const escapeIcs = (s: string) => s.replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;");

/** ICS content. Only a start time is given — no end time is invented. */
export function buildIcs(): string {
  const start = weddingStartUtcStamp();
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Ralph & Venilda//Wedding Invitation//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:ralph-venilda-wedding-${start}@invitation`,
    `DTSTAMP:${start}`,
    `DTSTART:${start}`,
    `SUMMARY:${escapeIcs(WEDDING.eventTitle)}`,
    `LOCATION:${escapeIcs(venueFullAddress())}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function googleCalendarUrl(): string {
  const start = weddingStartUtcStamp();
  const p = new URLSearchParams({
    action: "TEMPLATE",
    text: WEDDING.eventTitle,
    dates: `${start}/${start}`,
    ctz: WEDDING.timeZone,
    location: venueFullAddress(),
  });
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
}

export function downloadIcs() {
  const blob = new Blob([buildIcs()], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "ralph-venilda-wedding.ics";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
