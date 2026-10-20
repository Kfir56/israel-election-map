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
  { id: "regular", label: "רגיל", minutes: "3 דקות", text: "שלוש־ארבע שאלות בכל נושא. מאוזן בין זמן לדיוק." },
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

export type Answer = { v: number | null };

/**
 * Topic importance comes from a ranking (most important first), turned into
 * weights with the rank-sum rule: with 5 topics, 1st gets 5 points, 2nd 4 …
 * 5th 1, divided by the total. Topics you didn't place share the points left
 * over equally; no ranking at all means every topic counts the same.
 * Rank-sum is a standard way to turn a ranking into weights (Stillwell,
 * Seaver & Edwards 1981; Barron & Barrett 1996) and is gentler than
 * rank-order-centroid, so a topic you put last still counts.
 */
export function rankWeights(ranking: CategoryId[], topics: CategoryId[]): Partial<Record<CategoryId, number>> {
  const n = topics.length;
  const placed = ranking.filter((t) => topics.includes(t));
  const total = (n * (n + 1)) / 2;
  const w: Partial<Record<CategoryId, number>> = {};
  placed.forEach((t, i) => (w[t] = (n - i) / total));
  const rest = topics.filter((t) => !placed.includes(t));
  const left = 1 - placed.reduce((s, t) => s + w[t]!, 0);
  for (const t of rest) w[t] = left / rest.length;
  return w;
}

export type TopicResult = { agree: number; compared: number; answered: number };

export type Match = {
  partyId: string;
  match: number; // 0-100
  coverage: number; // 0-100: weighted share of your answers the party has a known stance on
  compared: number; // questions where both you and the party have a position
  byTopic: Partial<Record<CategoryId, TopicResult>>;
};

/** 1 when you and the party give the same answer, 0 when at opposite ends of the 5-point scale. */
export const agreement = (mine: number, theirs: number) => 1 - Math.abs(mine - theirs) / 4;

/**
 * Per topic: the average agreement over the questions where the party has a
 * known stance. A question the party has no known stance on counts as 50%
 * (we don't know, so it neither helps nor hurts), which keeps a party with
 * few known stances from topping the list on two lucky answers.
 * Overall: topic scores averaged with your importance weights, so a topic
 * counts by how much it matters to you, not by how many questions it has.
 */
export function score(
  asked: Question[],
  answers: Record<string, Answer>,
  weights: Partial<Record<CategoryId, number>>,
  partyIds: string[],
): Match[] {
  const mine = asked.filter((q) => answers[q.id] && answers[q.id].v !== null);
  return partyIds.map((partyId) => {
    const byTopic: Partial<Record<CategoryId, TopicResult>> = {};
    for (const q of mine) {
      const t = (byTopic[q.topic] ??= { agree: 0, compared: 0, answered: 0 });
      t.answered++;
      const st = stances[q.id]?.[partyId];
      if (!st) continue;
      t.agree += agreement(answers[q.id].v!, st.v);
      t.compared++;
    }
    let sum = 0;
    let cover = 0;
    let total = 0;
    let compared = 0;
    for (const [k, t] of Object.entries(byTopic) as [CategoryId, TopicResult][]) {
      if (t.compared) t.agree /= t.compared;
      const share = t.compared / t.answered;
      const w = weights[k] ?? 1;
      sum += w * (share * t.agree + (1 - share) * 0.5);
      cover += w * share;
      total += w;
      compared += t.compared;
    }
    return {
      partyId,
      match: total ? Math.round((sum / total) * 100) : 0,
      coverage: total ? Math.round((cover / total) * 100) : 0,
      compared,
      byTopic,
    };
  });
}

/** Enough known stances to rank the party: at least 3 questions and half of your (weighted) answers. */
export const enoughData = (m: Match) => m.compared >= 3 && m.coverage >= 50;
