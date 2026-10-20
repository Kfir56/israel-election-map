// Seat polls for the 26th Knesset election, newest first.
// Collected 19 Oct 2026 from the poll archive at skarim.org, which links each
// poll to its publisher; several were cross-checked against the original
// article (`article`). Parties missing from a poll were below the threshold.
import { KNESSET_SEATS } from "@/data/parties";

export type Poll = {
  id: string;
  date: string; // ISO date the poll was published
  outlet: string;
  pollster: string;
  source: string; // where we read the numbers
  article?: string; // the publisher's own article, when we checked it
  seats: Record<string, number>;
};

export const polls: Poll[] = [
  {
    id: "ch12-2026-10-19",
    date: "2026-10-19",
    outlet: "חדשות 12",
    pollster: "מנו גבע",
    source: "https://www.skarim.org/polls/channel-12-2026-10-19",
    seats: { yashar: 24, likud: 21, together: 14, dems: 9, joint: 9, yb: 8, otzma: 8, shas: 8, utj: 7, rzp: 7, raam: 5 },
  },
  {
    id: "ch14-2026-10-19",
    date: "2026-10-19",
    outlet: "ערוץ 14",
    pollster: "NEXT DATA (שלמה פילבר)",
    source: "https://www.skarim.org/polls/channel-14-2026-10-19",
    seats: { likud: 30, yashar: 19, together: 10, dems: 10, shas: 10, joint: 8, utj: 8, otzma: 7, rzp: 7, yb: 6, raam: 5 },
  },
  {
    id: "ch13-2026-10-19",
    date: "2026-10-19",
    outlet: "חדשות 13",
    pollster: "יצחק כ״ץ / המדד",
    source: "https://www.skarim.org/polls/channel-13-2026-10-19",
    seats: { yashar: 20, likud: 18, together: 14, dems: 9, joint: 9, yb: 8, otzma: 7, shas: 7, utj: 7, rzp: 7, raam: 6, reservists: 4, amcha: 4 },
  },
  {
    id: "ch14-2026-10-18",
    date: "2026-10-18",
    outlet: "ערוץ 14",
    pollster: "NEXT DATA (שלמה פילבר)",
    source: "https://www.skarim.org/polls/channel-14-2026-10-18",
    seats: { likud: 29, yashar: 22, together: 10, shas: 10, dems: 8, utj: 8, otzma: 7, joint: 7, rzp: 7, yb: 6, raam: 6 },
  },
  {
    id: "i24-2026-10-18",
    date: "2026-10-18",
    outlet: "i24NEWS",
    pollster: "דיירקט פולס (צוריאל שרון)",
    source: "https://www.skarim.org/polls/i24news-2026-10-18",
    article: "https://www.i24news.tv/he/news/israel-elections-2026/polls/artc-81805",
    seats: { likud: 25, yashar: 21, together: 13, otzma: 10, dems: 9, joint: 8, shas: 8, utj: 8, yb: 6, raam: 6, rzp: 6 },
  },
  {
    id: "kan-2026-10-18",
    date: "2026-10-18",
    outlet: "כאן 11",
    pollster: "דודי חסיד",
    source: "https://www.skarim.org/polls/kan-news-2026-10-18",
    seats: { yashar: 23, likud: 21, together: 12, dems: 9, yb: 8, otzma: 8, joint: 8, shas: 8, utj: 7, rzp: 7, raam: 5, reservists: 4 },
  },
  {
    id: "maariv-2026-10-16",
    date: "2026-10-16",
    outlet: "מעריב",
    pollster: "מנחם לזר",
    source: "https://www.skarim.org/polls/maariv-2026-10-16",
    seats: { yashar: 21, likud: 18, together: 13, dems: 9, yb: 8, otzma: 8, joint: 8, utj: 8, shas: 7, raam: 6, rzp: 6, reservists: 4, amcha: 4 },
  },
  {
    id: "ih-2026-10-15",
    date: "2026-10-15",
    outlet: "ישראל היום",
    pollster: "דודי חסיד",
    source: "https://www.skarim.org/polls/israel-hayom-2026-10-15",
    seats: { yashar: 24, likud: 21, together: 12, otzma: 9, joint: 9, dems: 8, yb: 8, shas: 7, utj: 7, rzp: 6, raam: 5, reservists: 4 },
  },
  {
    id: "zman-2026-10-15",
    date: "2026-10-15",
    outlet: "זמן ישראל",
    pollster: "יוסי טאטיקה",
    source: "https://www.skarim.org/polls/zman-israel-2026-10-15",
    article: "https://www.timesofisrael.com/liveblog_entry/toi-poll-eisenkot-opens-up-big-lead-on-netanyahu-but-both-blocs-short-of-majority/",
    seats: { yashar: 26, likud: 20, together: 11, yb: 9, dems: 8, joint: 8, shas: 8, utj: 8, otzma: 7, rzp: 6, raam: 5, reservists: 4 },
  },
  {
    id: "ch14-2026-10-14",
    date: "2026-10-14",
    outlet: "ערוץ 14",
    pollster: "NEXT DATA (שלמה פילבר)",
    source: "https://www.skarim.org/polls/channel-14-2026-10-14",
    seats: { likud: 29, yashar: 20, together: 11, shas: 10, joint: 9, dems: 8, otzma: 8, utj: 8, rzp: 7, yb: 5, raam: 5 },
  },
  {
    id: "ch13-2026-10-14",
    date: "2026-10-14",
    outlet: "חדשות 13",
    pollster: "המדד (שמואל רוזנר ונח סלפקוב) ויצחק כ״ץ",
    source: "https://www.skarim.org/polls/channel-13-2026-10-14",
    article: "https://www.walla.co.il/news/politics/383957465",
    seats: { yashar: 20, likud: 18, together: 12, dems: 9, yb: 9, joint: 9, otzma: 8, utj: 8, shas: 7, raam: 6, rzp: 6, reservists: 4, amcha: 4 },
  },
  {
    id: "i24-2026-10-13",
    date: "2026-10-13",
    outlet: "i24NEWS",
    pollster: "דיירקט פולס (צוריאל שרון)",
    source: "https://www.skarim.org/polls/i24news-2026-10-13",
    seats: { likud: 27, yashar: 21, together: 13, dems: 9, otzma: 9, utj: 8, yb: 7, joint: 7, shas: 7, raam: 6, rzp: 6 },
  },
  {
    id: "ch16-2026-10-13",
    date: "2026-10-13",
    outlet: "ערוץ 16",
    pollster: "יצחק כ״ץ",
    source: "https://www.skarim.org/polls/channel-16-2026-10-13",
    seats: { yashar: 21, likud: 18, together: 13, dems: 9, otzma: 9, joint: 8, utj: 8, yb: 7, shas: 7, rzp: 6, reservists: 5, raam: 5, amcha: 4 },
  },
];

export const AVERAGE_ID = "average";

// Mean of all polls above, rounded so the seats still add up to 120
// (largest remainder).
export const averageSeats: Record<string, number> = (() => {
  const totals: Record<string, number> = {};
  for (const p of polls) for (const [id, s] of Object.entries(p.seats)) totals[id] = (totals[id] ?? 0) + s;
  const exact = Object.entries(totals).map(([id, t]) => ({ id, v: t / polls.length }));
  const out: Record<string, number> = {};
  for (const e of exact) out[e.id] = Math.floor(e.v);
  let left = KNESSET_SEATS - Object.values(out).reduce((a, b) => a + b, 0);
  for (const e of [...exact].sort((a, b) => (b.v % 1) - (a.v % 1))) {
    if (left-- <= 0) break;
    out[e.id] += 1;
  }
  return out;
})();

export function seatsFor(pollId: string): Record<string, number> {
  if (pollId === AVERAGE_ID) return averageSeats;
  return polls.find((p) => p.id === pollId)?.seats ?? averageSeats;
}

export function formatDate(iso: string): string {
  const [, m, d] = iso.split("-");
  return `${Number(d)}.${Number(m)}`;
}

// Every poll's number for one party (0 = below the threshold in that poll).
export function partyRange(partyId: string) {
  const values = polls.map((p) => p.seats[partyId] ?? 0);
  return { min: Math.min(...values), max: Math.max(...values), values };
}
