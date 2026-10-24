/**
 * SINGLE SOURCE OF TRUTH for all approved wedding details.
 * Both the cinematic invitation and the lower page sections read from here.
 * Do not add parents' names or parentage details.
 */
export const WEDDING = {
  bride: "Venilda",
  groom: "Ralph",
  eventTitle: "Ralph & Venilda Wedding",
  scripture: {
    text: "What God has yoked together let no man put apart.",
    reference: "Matthew 19:6",
  },
  dateShort: "January 1st, 2027",
  dateLong: "Friday, January 1, 2027",
  timeLabel: "5:30 PM",
  /** Start time in the venue's local time zone (India, IST = UTC+05:30). No end time is defined. */
  startLocal: { year: 2027, month: 1, day: 1, hour: 17, minute: 30 },
  timeZone: "Asia/Kolkata",
  utcOffsetMinutes: 330,
  venue: {
    name: "St. Mary's Syrian (S.M.S) Community Hall",
    locality: "Varamballi, Brahmavara",
    cityPin: "Udupi – 576213",
  },
  closingTop: "Come share our joy, laughter and happiness",
  closingBottom: "as we begin this wonderful journey together.",
  closingMessage:
    "Come share our joy, laughter and happiness as we begin this wonderful journey together.",
  /**
   * LIVESTREAM: no URL has been supplied yet.
   * Paste the real livestream link here (e.g. "https://youtube.com/live/...").
   * While empty, the "Watch Live Wedding" button shows a "link coming soon" state.
   */
  livestreamUrl: "" as string,
} as const;

export const venueFullAddress = () =>
  `${WEDDING.venue.name}, ${WEDDING.venue.locality}, ${WEDDING.venue.cityPin}`;

/** Map search link (search query only — no coordinates are assumed). */
export const directionsUrl = () =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${WEDDING.venue.name}, Varamballi, Brahmavara, Udupi 576213`,
  )}`;
