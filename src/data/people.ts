// Biographies of candidates, keyed "partyId:pos". Written by us in Hebrew
// from each person's English Wikipedia article (collected 19 Oct 2026);
// the raw batches live in scripts/bios/ and are merged into bios.json.
import raw from "@/data/bios.json";
import { parties, type Candidate, type Party } from "@/data/parties";

export type Bio = {
  wiki: string;
  born: string;
  summary: string;
  education: string[];
  military: string | null;
  roles: { years: string; title: string }[];
  parties: string;
};

const bios = raw as unknown as Record<string, Bio>;

export function bioFor(partyId: string, pos: number): Bio | undefined {
  return bios[`${partyId}:${pos}`];
}

export function wikiUrl(bio: Bio) {
  return `https://en.wikipedia.org/wiki/${bio.wiki}`;
}

export function findCandidate(partyId: string, pos: number): { party: Party; candidate: Candidate } | undefined {
  const party = parties.find((p) => p.id === partyId);
  const candidate = party?.candidates.find((c) => c.pos === pos);
  return party && candidate ? { party, candidate } : undefined;
}

export const personHref = (partyId: string, pos: number) => `/party/${partyId}/${pos}`;
export const partyHref = (partyId: string) => `/party/${partyId}`;
