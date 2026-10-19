// Which candidates are women, for the representation stats. Hebrew first
// names mostly settle it; for names used by both sexes we checked the
// candidate's background (bios, party announcements). Where we couldn't
// confirm, the candidate is counted as unknown rather than guessed.
import { parties } from "@/data/parties";

const WOMEN_FIRST_NAMES = new Set(
  "מירב מיכל לימור אורלי אורית תהילה תאיר רעות רויטל קרן פנינה פלר ענבר עינת סומיה נעמה נטעלי נהאיה נאוה מרים מלכה מורן מוריה מהא ללי לילי לירן יעל יסמין יוליה טליה טלי טל חוה-אתי דבורה גיטי גבריאלה גאולה ברוריה אפרת אמילי אלוירה אימאן אושרת שירן שירה עדי".split(
    " ",
  ),
);

/** Candidates whose sex we could not confirm from a source. */
const UNKNOWN = new Set(["dems:19", "bw:5", "reservists:8", "joint:4"]);

export type Sex = "f" | "m" | "?";

export function sexOf(partyId: string, pos: number, name: string): Sex {
  if (UNKNOWN.has(`${partyId}:${pos}`)) return "?";
  return WOMEN_FIRST_NAMES.has(name.split(" ")[0]) ? "f" : "m";
}

/** Women elected to the outgoing (25th) Knesset in November 2022. */
export const WOMEN_25 = 29;
export const WOMEN_25_SOURCE = "https://en.wikipedia.org/wiki/List_of_members_of_the_twenty-fifth_Knesset";

export function womenStats(partyId: string, realistic: number) {
  const party = parties.find((p) => p.id === partyId)!;
  const sexes = party.candidates.map((c) => sexOf(partyId, c.pos, c.name));
  const inTop = sexes.slice(0, Math.max(0, Math.round(realistic)));
  return {
    women: sexes.filter((s) => s === "f").length,
    unknown: sexes.filter((s) => s === "?").length,
    total: sexes.length,
    womenRealistic: inTop.filter((s) => s === "f").length,
    realistic: inTop.length,
    firstWomanPos: sexes.indexOf("f") + 1 || null,
  };
}
