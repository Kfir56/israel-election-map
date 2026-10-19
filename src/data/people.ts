// Biographies of candidates, keyed "partyId:pos". Written by us in Hebrew
// from each person's Wikipedia article (collected 19 Oct 2026): English by
// default, Hebrew when `lang` is "he". People with no Wikipedia article have
// `sources` (news reports) instead of `wiki`. The raw batches live in
// scripts/bios/ and are merged into bios.json.
//
// records.json: for former ministers, notable steps and criticism from their
// time in government, condensed from their Hebrew Wikipedia article.
import raw from "@/data/bios.json";
import rawRecords from "@/data/records.json";
import { parties, type Candidate, type Party } from "@/data/parties";

export type Source = { label: string; url: string };

export type Bio = {
  wiki?: string;
  lang?: "he";
  sources?: Source[];
  born: string;
  summary: string;
  education: string[];
  military: string | null;
  roles: { years: string; title: string }[];
  parties: string;
};

export type RecordItem = { years: string; text: string };

export type GovRecord = { wiki: string; plus: RecordItem[]; minus: RecordItem[] };

const bios = raw as unknown as Record<string, Bio>;
const records = rawRecords as Record<string, GovRecord>;

export function bioFor(partyId: string, pos: number): Bio | undefined {
  return bios[`${partyId}:${pos}`];
}

export function recordFor(partyId: string, pos: number): GovRecord | undefined {
  return records[`${partyId}:${pos}`];
}

// English titles in the data are already URL-encoded; Hebrew ones are not.
export function wikiUrl(title: string, lang: "en" | "he" = "en") {
  return lang === "he"
    ? `https://he.wikipedia.org/wiki/${encodeURIComponent(title)}`
    : `https://en.wikipedia.org/wiki/${title}`;
}

export function findCandidate(partyId: string, pos: number): { party: Party; candidate: Candidate } | undefined {
  const party = parties.find((p) => p.id === partyId);
  const candidate = party?.candidates.find((c) => c.pos === pos);
  return party && candidate ? { party, candidate } : undefined;
}

export const personHref = (partyId: string, pos: number) => `/party/${partyId}/${pos}`;
export const partyHref = (partyId: string) => `/party/${partyId}`;
