// Arabic text for the Arabic section (/ar). Translated from the Hebrew data by
// us (scripts/ar/content.json); sources, dates and numbers come from the
// Hebrew data files, so the two versions can't drift apart on facts.
import content from "@/data/ar.json";
import type { CategoryId } from "@/data/parties";

type ArParty = {
  name: string;
  leader: string;
  summary: string;
  withdrawn?: string;
  topics: Partial<Record<CategoryId, string>>;
  sourceLabels: Partial<Record<CategoryId, string>>;
  candidates: Record<string, { name: string; note?: string }>;
};
type ArCoalition = {
  recommends: string | null;
  wontSitWith: string[];
  wontSitWithNotes: (string | null)[];
  conditions: string[];
};

export const ar = content as unknown as {
  parties: Record<string, ArParty>;
  minor: Record<string, { name: string; head: string | null; description: string | null; note?: string }>;
  coalition: Record<string, ArCoalition>;
  categories: Record<CategoryId, string>;
  blocs: Record<string, string>;
  whyVote: Record<string, string>;
};

/** Fills {placeholders} in an Arabic string. */
export const fill = (s: string, values: Record<string, string>) => s.replace(/\{(\w+)\}/g, (_, k) => values[k] ?? "");

export const arDate = (iso: string) => {
  const [y, m, d] = iso.split("-");
  return d ? `${Number(d)}.${Number(m)}.${y}` : `${Number(m)}.${y}`;
};
