// What each list has said about who it will and won't govern with.
// Collected 19-20 Oct 2026 from news reports; every line links its source.
// Lines about Netanyahu the person are filed under the Likud, with a note,
// since Netanyahu heads the Likud list. Amcha's reported refusals were only a
// newspaper paraphrase, so they're left out.
import data from "@/data/coalition-lines.json";
import type { Conflict } from "@/lib/coalitions";

export type Sourced = { text: string; source: string; date: string };
export type Refusal = Sourced & { party: string; note?: string };
export type PartyLines = { recommends: Sourced | null; wontSitWith: Refusal[]; conditions: Sourced[] };

export const coalitionLines = data as Record<string, PartyLines>;

/** Every stated refusal as a pair, for checking a coalition against. */
export const redLines: (Conflict & { note?: string })[] = Object.entries(coalitionLines).flatMap(([a, l]) =>
  l.wontSitWith.map((w) => ({ a, b: w.party, text: w.text, source: w.source, date: w.date, note: w.note })),
);
