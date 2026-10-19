// Seed list for the 26th Knesset election (27 Oct 2026).
// `seats25` = seats held in the outgoing 25th Knesset, used as a placeholder
// until poll and live results feeds are wired in. Verify names and ballot
// letters against the Central Elections Committee's final approved lists.
export type Party = {
  id: string;
  name: string;
  nameHe: string;
  leader: string;
  color: string;
  bloc: "coalition" | "opposition" | "arab";
  seats25: number;
};

export const KNESSET_SEATS = 120;
export const THRESHOLD = 0.0325;

export const parties: Party[] = [
  { id: "likud", name: "Likud", nameHe: "הליכוד", leader: "Benjamin Netanyahu", color: "#1f5fbf", bloc: "coalition", seats25: 36 },
  { id: "together", name: "Together", nameHe: "ביחד", leader: "Naftali Bennett", color: "#2bb3c0", bloc: "opposition", seats25: 24 },
  { id: "shas", name: "Shas", nameHe: "ש״ס", leader: "Aryeh Deri", color: "#111111", bloc: "coalition", seats25: 11 },
  { id: "blue-white", name: "Blue and White", nameHe: "כחול לבן", leader: "Benny Gantz", color: "#4a90e2", bloc: "opposition", seats25: 8 },
  { id: "rzp", name: "RZP–Zehut", nameHe: "הציונות הדתית", leader: "Bezalel Smotrich", color: "#c58b1b", bloc: "coalition", seats25: 7 },
  { id: "utj", name: "UTJ", nameHe: "יהדות התורה", leader: "Yitzhak Goldknopf", color: "#555555", bloc: "coalition", seats25: 7 },
  { id: "otzma", name: "Otzma Yehudit", nameHe: "עוצמה יהודית", leader: "Itamar Ben-Gvir", color: "#e3a21a", bloc: "coalition", seats25: 6 },
  { id: "yb", name: "Yisrael Beiteinu", nameHe: "ישראל ביתנו", leader: "Avigdor Lieberman", color: "#2e8b57", bloc: "opposition", seats25: 6 },
  { id: "raam", name: "Ra'am", nameHe: "רע״מ", leader: "Mansour Abbas", color: "#3a7d44", bloc: "arab", seats25: 5 },
  { id: "joint", name: "Joint List", nameHe: "הרשימה המשותפת", leader: "Yousef Jabareen", color: "#8b1e3f", bloc: "arab", seats25: 5 },
  { id: "democrats", name: "The Democrats", nameHe: "הדמוקרטים", leader: "Yair Golan", color: "#d0312d", bloc: "opposition", seats25: 4 },
  { id: "noam", name: "Noam", nameHe: "נעם", leader: "Avi Maoz", color: "#7a5c3e", bloc: "coalition", seats25: 1 },
];
