"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { categories, type CategoryId, parties } from "@/data/parties";
import { partyHref } from "@/data/people";
import {
  type Answer,
  answerLabel,
  answerOptions,
  lengths,
  type Question,
  questionsFor,
  score,
  stances,
  type Tier,
  type TopicWeights,
} from "@/data/quiz";
import { colorOnDark } from "@/lib/party-color";
import { SITE_URL } from "@/lib/site";

const topicLabel = (id: CategoryId) => categories.find((c) => c.id === id)!.label;
const running = parties.filter((p) => !p.withdrawn);
const party = (id: string) => parties.find((p) => p.id === id)!;
const btn = "rounded-xl border border-slate-700 px-5 py-2.5 font-semibold hover:bg-slate-800";

const importance = [
  { value: 0.5, label: "פחות חשוב לי" },
  { value: 1, label: "חשוב" },
  { value: 2, label: "חשוב לי מאוד" },
];

type Stage = "pick" | "questions" | "weights" | "results";

export default function Quiz() {
  const [stage, setStage] = useState<Stage>("pick");
  const [tier, setTier] = useState<Tier>("regular");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [weights, setWeights] = useState<TopicWeights>({});
  const asked = useMemo(() => questionsFor(tier), [tier]);

  // Moving to a longer version keeps your answers and starts at the first new question.
  const start = (t: Tier) => {
    setTier(t);
    setStep(Math.max(0, questionsFor(t).findIndex((q) => !answers[q.id])));
    setStage("questions");
    window.scrollTo({ top: 0 });
  };

  if (stage === "pick") return <Pick onPick={start} />;

  if (stage === "questions") {
    const q = asked[step];
    const a = answers[q.id] ?? { v: null, star: false };
    const next = (v: number | null) => {
      setAnswers((all) => ({ ...all, [q.id]: { ...a, v } }));
      if (step + 1 < asked.length) setStep(step + 1);
      else setStage(tier === "quick" ? "results" : "weights");
    };
    return (
      <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
        <div className="flex items-baseline justify-between">
          <h1 className="text-2xl font-extrabold">איזו מפלגה הכי קרובה אליי?</h1>
          <button onClick={() => setStage("pick")} className="text-sm text-slate-400 hover:text-white">
            החלפת אורך
          </button>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
          <div className="h-2 rounded-full bg-sky-500 transition-all" style={{ width: `${(step / asked.length) * 100}%` }} />
        </div>
        <div className="mt-2 text-sm text-slate-500">
          שאלה {step + 1} מתוך {asked.length}
        </div>
        <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs text-sky-300">{topicLabel(q.topic)}</span>
          <p className="mt-3 text-xl font-semibold leading-relaxed sm:text-2xl">{q.text}</p>
          <div className="mt-6 grid gap-2">
            {answerOptions.map((o) => (
              <button
                key={o.value}
                onClick={() => next(o.value)}
                className={`rounded-xl border px-4 py-3 text-right font-semibold transition hover:border-sky-400 hover:bg-sky-400/10 ${
                  a.v === o.value ? "border-sky-400 bg-sky-400/10" : "border-slate-700"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
          {tier !== "quick" && (
            <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={a.star}
                onChange={(e) => setAnswers((all) => ({ ...all, [q.id]: { ...a, star: e.target.checked } }))}
                className="accent-amber-400"
              />
              ⭐ הנושא הזה חשוב לי במיוחד (נספר כפול)
            </label>
          )}
          <div className="mt-4 flex justify-between text-sm">
            <button
              disabled={step === 0}
              onClick={() => setStep((s) => s - 1)}
              className="text-slate-400 hover:text-white disabled:opacity-30"
            >
              → הקודמת
            </button>
            <button onClick={() => next(null)} className="text-slate-400 hover:text-white">
              אין לי דעה, לדלג
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (stage === "weights") {
    return (
      <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
        <h1 className="text-2xl font-extrabold">כמה חשוב לכם כל נושא?</h1>
        <p className="mt-1 text-slate-400">נושא שחשוב לכם מאוד ישפיע על התוצאה פי ארבעה מנושא שפחות חשוב לכם. אפשר גם לדלג.</p>
        <div className="mt-5 space-y-3">
          {categories.map((c) => (
            <div key={c.id} className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
              <div className="font-semibold">{c.label}</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {importance.map((o) => {
                  const on = (weights[c.id] ?? 1) === o.value;
                  return (
                    <button
                      key={o.value}
                      onClick={() => setWeights((w) => ({ ...w, [c.id]: o.value }))}
                      aria-pressed={on}
                      className={`rounded-full border px-3 py-1.5 text-sm ${
                        on ? "border-sky-400 bg-sky-400/15 text-sky-200" : "border-slate-700 text-slate-300 hover:border-slate-500"
                      }`}
                    >
                      {o.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex gap-2">
          <button onClick={() => setStage("results")} className="rounded-xl bg-sky-500 px-5 py-2.5 font-semibold text-slate-950 hover:bg-sky-400">
            לתוצאות ←
          </button>
          <button
            onClick={() => {
              setStep(asked.length - 1);
              setStage("questions");
            }}
            className={btn}
          >
            → חזרה לשאלות
          </button>
        </div>
      </main>
    );
  }

  return (
    <Results
      tier={tier}
      asked={asked}
      answers={answers}
      weights={weights}
      onRestart={() => {
        setAnswers({});
        setWeights({});
        setStage("pick");
      }}
      onLonger={(t) => start(t)}
    />
  );
}

function Pick({ onPick }: { onPick: (t: Tier) => void }) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <h1 className="text-3xl font-extrabold">איזו מפלגה הכי קרובה אליי?</h1>
      <p className="mt-2 text-slate-300">
        משפטים על חמשת הנושאים הגדולים: ביטחון, דת ומדינה, כלכלה, מערכת המשפט וגיוס. אנחנו משווים את התשובות שלכם למה
        שכל מפלגה אמרה או הצביעה, עם מקור לכל עמדה. שום דבר לא נשמר.
      </p>
      <h2 className="mt-6 font-semibold text-slate-200">כמה זמן יש לכם?</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {lengths.map((l) => (
          <button
            key={l.id}
            onClick={() => onPick(l.id)}
            className={`rounded-2xl border p-4 text-right transition hover:-translate-y-0.5 hover:border-sky-400 ${
              l.id === "regular" ? "border-sky-500/60 bg-sky-500/5" : "border-slate-800 bg-slate-900/50"
            }`}
          >
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold">{l.label}</span>
              <span className="text-sm text-slate-400">{l.minutes}</span>
            </div>
            <div className="mt-1 text-sm font-semibold text-sky-300">{questionsFor(l.id).length} שאלות</div>
            <p className="mt-1 text-sm text-slate-400">{l.text}</p>
          </button>
        ))}
      </div>
      <p className="mt-4 text-xs text-slate-500">אפשר להתחיל בקצר ולהמשיך לגרסה ארוכה יותר מתוך התוצאות, בלי לענות שוב.</p>
    </main>
  );
}

function Results({
  tier,
  asked,
  answers,
  weights,
  onRestart,
  onLonger,
}: {
  tier: Tier;
  asked: Question[];
  answers: Record<string, Answer>;
  weights: TopicWeights;
  onRestart: () => void;
  onLonger: (t: Tier) => void;
}) {
  const [open, setOpen] = useState<string | null>(null);
  const answered = asked.filter((q) => answers[q.id]?.v !== null && answers[q.id]?.v !== undefined).length;
  // A party we can compare on fewer than 3 of your answers is listed, but last.
  const ranked = score(asked, answers, weights, running.map((p) => p.id)).sort(
    (a, b) => Number(b.compared >= 3) - Number(a.compared >= 3) || b.match - a.match,
  );
  const top = ranked.filter((r) => r.compared >= 3).slice(0, 3);
  const longer = tier === "quick" ? "regular" : tier === "regular" ? "full" : null;

  if (answered === 0)
    return (
      <main className="mx-auto max-w-2xl px-4 py-10 text-center sm:px-6">
        <p className="text-lg text-slate-300">דילגתם על כל השאלות, אז אין לנו עם מה להשוות.</p>
        <button onClick={onRestart} className={`mt-4 ${btn}`}>
          להתחיל מחדש
        </button>
      </main>
    );

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <h1 className="text-3xl font-extrabold">הכי קרובות אליכם</h1>
      <p className="mt-1 text-slate-400">
        לפי {answered} התשובות שלכם, בהשוואה לעמדות שהמפלגות הצהירו עליהן או הצביעו בעדן.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {top.map(({ partyId, match, compared }, i) => {
          const p = party(partyId);
          return (
            <button
              key={p.id}
              onClick={() => setOpen(p.id)}
              className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 text-right transition hover:-translate-y-0.5 hover:border-slate-600"
            >
              <div className="h-1.5" style={{ background: p.color }} />
              <div className="p-4">
                <div className="text-sm text-slate-400">מקום {i + 1}</div>
                <div className="text-xl font-bold">{p.name}</div>
                <div className="text-3xl font-extrabold" style={{ color: colorOnDark(p.id) }}>
                  {match}%<span className="text-sm font-normal text-slate-400"> התאמה</span>
                </div>
                <div className="text-xs text-slate-500">לפי {compared} שאלות · לפירוט ←</div>
              </div>
            </button>
          );
        })}
      </div>

      {longer && (
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/40 p-3 text-sm text-slate-300">
          רוצים תוצאה מדויקת יותר?
          <button onClick={() => onLonger(longer)} className="font-semibold text-sky-400 hover:underline">
            להמשיך לגרסה ה{longer === "regular" ? "רגילה" : "מלאה"} ({questionsFor(longer).length} שאלות, התשובות שלכם נשמרות) ←
          </button>
        </div>
      )}

      <h2 className="mt-8 text-xl font-bold">כל המפלגות</h2>
      <p className="text-sm text-slate-400">לחצו על מפלגה כדי לראות במה היא מסכימה איתכם ובמה לא.</p>
      <ul className="mt-3 space-y-1.5">
        {ranked.map((r) => {
          const p = party(r.partyId);
          const few = r.compared < 3;
          return (
            <li key={p.id}>
              <button
                onClick={() => setOpen(open === p.id ? null : p.id)}
                aria-expanded={open === p.id}
                className="flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-right hover:bg-slate-800/60"
              >
                <span className="w-36 shrink-0 truncate text-sm">{p.name}</span>
                <span className="h-2.5 flex-1 rounded-full bg-slate-800">
                  {!few && <span className="block h-2.5 rounded-full" style={{ width: `${r.match}%`, background: colorOnDark(p.id) }} />}
                </span>
                <span className="w-24 text-left text-sm tabular-nums text-slate-300">
                  {few ? <span className="text-xs text-slate-500">אין מספיק מידע</span> : `${r.match}%`}
                </span>
              </button>
              {open === p.id && <Breakdown partyId={p.id} asked={asked} answers={answers} byTopic={r.byTopic} />}
            </li>
          );
        })}
      </ul>

      {top[0] && <ShareResult partyId={top[0].partyId} name={party(top[0].partyId).name} match={top[0].match} />}

      <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100">
        זה כלי להתחלת מחשבה, לא המלצה למי להצביע. הוא משווה רק את הנושאים שבשאלון, ולא דברים כמו מי עומד בראש הרשימה או
        כמה אתם סומכים עליו. כשמפלגה לא אמרה דבר ברור על שאלה מסוימת, השאלה הזו לא נספרת אצלה. עמדות שמסומנות ״הסקה שלנו״
        נגזרו מהקו המוצהר של המפלגה ולא מהצהרה על הנושא עצמו.
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        <button onClick={onRestart} className={btn}>
          להתחיל מחדש
        </button>
        {top.length > 1 && (
          <Link
            href={`/compare?a=${top[0].partyId}&b=${top[1].partyId}`}
            className="rounded-xl bg-sky-500 px-5 py-2.5 font-semibold text-slate-950 hover:bg-sky-400"
          >
            להשוות בין שתי הראשונות
          </Link>
        )}
      </div>
    </main>
  );
}

function Breakdown({
  partyId,
  asked,
  answers,
  byTopic,
}: {
  partyId: string;
  asked: Question[];
  answers: Record<string, Answer>;
  byTopic: Partial<Record<CategoryId, number>>;
}) {
  const rows = asked.filter((q) => answers[q.id]?.v !== null && answers[q.id]?.v !== undefined);
  return (
    <div className="mb-3 mr-2 mt-1 rounded-xl border border-slate-800 bg-slate-900/50 p-3 text-sm">
      <div className="flex flex-wrap gap-1.5">
        {categories
          .filter((c) => byTopic[c.id] !== undefined)
          .map((c) => (
            <span key={c.id} className="rounded-full bg-slate-800 px-2.5 py-1 text-xs text-slate-300">
              {c.label}: <b className="tabular-nums">{byTopic[c.id]}%</b>
            </span>
          ))}
      </div>
      <ul className="mt-3 space-y-2.5">
        {rows.map((q) => {
          const mine = answers[q.id].v!;
          const st = stances[q.id]?.[partyId];
          const gap = st ? Math.abs(mine - st.v) : null;
          const mark = gap === null ? "–" : gap <= 1 ? "✓" : gap >= 3 ? "✕" : "≈";
          const tone = gap === null ? "text-slate-500" : gap <= 1 ? "text-emerald-300" : gap >= 3 ? "text-rose-300" : "text-amber-300";
          return (
            <li key={q.id} className="flex gap-2">
              <span className={`w-4 shrink-0 font-bold ${tone}`}>{mark}</span>
              <div>
                <div className="text-slate-200">{q.text}</div>
                <div className="text-xs text-slate-400">
                  אתם: {answerLabel(mine)}
                  {st ? (
                    <>
                      {" "}
                      · המפלגה: {answerLabel(st.v)}. {st.why}{" "}
                      {st.inferred && <span className="rounded bg-slate-800 px-1 text-[10px] text-slate-400">הסקה שלנו</span>}{" "}
                      <a href={st.source} target="_blank" rel="noreferrer" className="text-sky-400 hover:underline">
                        מקור
                      </a>
                    </>
                  ) : (
                    " · לא מצאנו עמדה ברורה של המפלגה, אז השאלה לא נספרת."
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <Link href={partyHref(partyId)} className="mt-3 inline-block text-xs text-sky-400 hover:underline">
        לעמוד המפלגה ←
      </Link>
    </div>
  );
}

function ShareResult({ partyId, name, match }: { partyId: string; name: string; match: number }) {
  const [copied, setCopied] = useState(false);
  const url = `${SITE_URL}/quiz/r?p=${partyId}&m=${match}`;
  const text = `יצא לי ש${name} הכי קרובה אליי (${match}% התאמה). ומה יוצא לכם?`;
  return (
    <div className="mt-6 rounded-2xl border border-sky-500/30 bg-sky-500/5 p-4">
      <div className="font-semibold">לשתף את התוצאה</div>
      <p className="mt-1 text-sm text-slate-400">הקישור מראה רק את המפלגה הראשונה ואת אחוז ההתאמה, בלי התשובות שלכם.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <a
          href={`https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`}
          target="_blank"
          rel="noreferrer"
          className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
        >
          וואטסאפ
        </a>
        <button
          onClick={async () => {
            if (navigator.share) {
              await navigator.share({ text, url }).catch(() => {});
              return;
            }
            await navigator.clipboard.writeText(`${text} ${url}`);
            setCopied(true);
          }}
          className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold hover:bg-slate-800"
        >
          {copied ? "הקישור הועתק ✓" : "שיתוף או העתקת קישור"}
        </button>
      </div>
    </div>
  );
}
