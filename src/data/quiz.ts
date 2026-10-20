// The voter-advice quiz: statements, each party's stance on them, and scoring.
// Statements in quiz-questions.json; stances from scripts/quiz/stances-*.json,
// merged into quiz-stances.json:
// every one has a source, and `inferred` marks ones we derived from a party's
// core, documented position rather than from a direct statement on the issue.
import questionData from "@/data/quiz-questions.json";
import stanceData from "@/data/quiz-stances.json";
import type { CategoryId } from "@/data/parties";

export type Tier = "quick" | "regular" | "full";
export type Question = { id: string; topic: CategoryId; tier: Tier; text: string };
export type Stance = { v: number; why: string; source: string; date: string; inferred?: boolean };

export const questions = questionData as Question[];
export const stances = stanceData as unknown as Record<string, Record<string, Stance | null>>;

export const lengths: { id: Tier; label: string; minutes: string; text: string }[] = [
  { id: "quick", label: "קצר", minutes: "בערך דקה", text: "שאלה או שתיים מכל נושא. נותן כיוון כללי." },
  { id: "regular", label: "רגיל", minutes: "3 דקות", text: "שלוש־ארבע שאלות בכל נושא, ואפשר לסמן מה חשוב לכם." },
  { id: "full", label: "מלא", minutes: "6 דקות", text: "כל השאלות. התוצאה הכי מדויקת." },
];

const TIER_ORDER: Tier[] = ["quick", "regular", "full"];
export const questionsFor = (tier: Tier) =>
  questions.filter((q) => TIER_ORDER.indexOf(q.tier) <= TIER_ORDER.indexOf(tier));

export const answerOptions = [
  { value: 2, label: "מסכים/ה מאוד" },
  { value: 1, label: "מסכים/ה" },
  { value: 0, label: "באמצע" },
  { value: -1, label: "לא מסכים/ה" },
  { value: -2, label: "ממש לא מסכים/ה" },
];
export const answerLabel = (v: number) => answerOptions.find((o) => o.value === v)?.label ?? "";

export type Answer = { v: number | null; star: boolean };
export type TopicWeights = Partial<Record<CategoryId, number>>;

export type Match = {
  partyId: string;
  match: number; // 0-100
  compared: number; // questions where both you and the party have a position
  byTopic: Partial<Record<CategoryId, number>>;
};

/** Agreement is 1 when you and the party give the same answer, 0 when opposite ends. */
export function score(asked: Question[], answers: Record<string, Answer>, weights: TopicWeights, partyIds: string[]): Match[] {
  return partyIds.map((partyId) => {
    let sum = 0;
    let total = 0;
    let compared = 0;
    const topic: Partial<Record<CategoryId, { s: number; t: number }>> = {};
    for (const q of asked) {
      const a = answers[q.id];
      const st = stances[q.id]?.[partyId];
      if (!a || a.v === null || !st) continue;
      const w = (weights[q.topic] ?? 1) * (a.star ? 2 : 1);
      const agree = 1 - Math.abs(a.v - st.v) / 4;
      sum += w * agree;
      total += w;
      compared++;
      const t = (topic[q.topic] ??= { s: 0, t: 0 });
      t.s += agree;
      t.t += 1;
    }
    const byTopic: Partial<Record<CategoryId, number>> = {};
    for (const [k, v] of Object.entries(topic)) byTopic[k as CategoryId] = Math.round((v.s / v.t) * 100);
    return { partyId, match: total ? Math.round((sum / total) * 100) : 0, compared, byTopic };
  });
}
