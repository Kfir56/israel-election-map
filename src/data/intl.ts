// Text for the translated sections (/ar, /en, /ru). Each file was translated
// from the Hebrew data by us; sources, dates and numbers come from the Hebrew
// data files, so the versions can't drift apart on facts.
import arContent from "@/data/ar.json";
import enContent from "@/data/en.json";
import ruContent from "@/data/ru.json";
import type { CategoryId } from "@/data/parties";

export type Locale = "ar" | "en" | "ru";
export const locales: Locale[] = ["ar", "en", "ru"];

type IntlParty = {
  name: string;
  leader: string;
  summary: string;
  withdrawn?: string;
  topics: Partial<Record<CategoryId, string>>;
  sourceLabels: Partial<Record<CategoryId, string>>;
  candidates: Record<string, { name: string; note?: string }>;
};
type IntlCoalition = {
  recommends: string | null;
  wontSitWith: string[];
  wontSitWithNotes: (string | null)[];
  conditions: string[];
};

export type Content = {
  parties: Record<string, IntlParty>;
  minor: Record<string, { name: string; head: string | null; description: string | null; note?: string }>;
  coalition: Record<string, IntlCoalition>;
  categories: Record<CategoryId, string>;
  blocs: Record<string, string>;
  whyVote: Record<string, string>;
  ui: Record<string, string>;
  towns: Record<string, string> & { lists: Record<string, string> };
};

export const content = { ar: arContent, en: enContent, ru: ruContent } as unknown as Record<Locale, Content>;

export const dirOf = (l: Locale) => (l === "ar" ? "rtl" : "ltr");
export const base = (l: Locale) => `/${l}`;
// The arrow that points "back" in the reading direction.
export const back = (l: Locale) => (l === "ar" ? "→" : "←");
export const forward = (l: Locale) => (l === "ar" ? "←" : "→");

/** Fills {placeholders} in a translated string. */
export const fill = (s: string, values: Record<string, string | number>) =>
  s.replace(/\{(\w+)\}/g, (_, k) => String(values[k] ?? ""));

export const intlDate = (iso: string) => {
  const [y, m, d] = iso.split("-");
  return d ? `${Number(d)}.${Number(m)}.${y}` : `${Number(m)}.${y}`;
};
