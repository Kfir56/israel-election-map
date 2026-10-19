"use client";

import Link from "next/link";
import { useState } from "react";
import { parties } from "@/data/parties";
import { partyHref } from "@/data/people";

// Each statement moves you along one of the map's two axes. `dir` is +1 when
// agreeing pushes you right / religious, -1 when it pushes the other way.
const questions: { text: string; axis: "right" | "religious"; dir: 1 | -1 }[] = [
  { text: "צריך להחיל ריבונות ישראלית על יהודה ושומרון, או על חלקים ממנה.", axis: "right", dir: 1 },
  { text: "ישראל צריכה לחתור להסכם שבו תקום מדינה פלסטינית לצדה.", axis: "right", dir: -1 },
  { text: "צריך להרחיב את ההתיישבות ביהודה ושומרון.", axis: "right", dir: 1 },
  { text: "שווה לוותר על שטחים תמורת שלום ונורמליזציה עם סעודיה.", axis: "right", dir: -1 },
  { text: "בית המשפט העליון מתערב יותר מדי בהחלטות של הכנסת והממשלה.", axis: "right", dir: 1 },
  { text: "צריך לאפשר נישואים אזרחיים בישראל.", axis: "religious", dir: -1 },
  { text: "תחבורה ציבורית צריכה לפעול גם בשבת.", axis: "religious", dir: -1 },
  { text: "לימוד תורה בישיבה הוא תרומה למדינה ששקולה לשירות.", axis: "religious", dir: 1 },
  { text: "הרבנות הראשית צריכה להמשיך להיות אחראית על נישואים וגיור.", axis: "religious", dir: 1 },
  { text: "צריך לגייס תלמידי ישיבות לצבא, גם אם הם מתנגדים.", axis: "religious", dir: -1 },
];

const options = [
  { value: 2, label: "מסכים/ה מאוד" },
  { value: 1, label: "מסכים/ה" },
  { value: 0, label: "באמצע" },
  { value: -1, label: "לא מסכים/ה" },
  { value: -2, label: "ממש לא מסכים/ה" },
];

type Answers = (number | null)[];

function position(answers: Answers) {
  const axis = (key: "right" | "religious") => {
    const vals = questions.flatMap((q, i) => (q.axis === key && answers[i] !== null ? [answers[i]! * q.dir] : []));
    // -2..2 averaged, mapped to 0..1; with no answers, the middle.
    return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length + 2) / 4 : 0.5;
  };
  return { right: axis("right"), religious: axis("religious") };
}

export default function Quiz() {
  const [answers, setAnswers] = useState<Answers>(() => questions.map(() => null));
  const [step, setStep] = useState(0);
  const done = step >= questions.length;

  const answer = (v: number | null) => {
    setAnswers((a) => a.map((x, i) => (i === step ? v : x)));
    setStep((s) => s + 1);
  };

  if (!done) {
    const q = questions[step];
    return (
      <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
        <h1 className="text-3xl font-extrabold">איזו מפלגה הכי קרובה אליי?</h1>
        <p className="mt-1 text-slate-400">10 משפטים. לכל אחד, כמה אתם מסכימים? אין תשובות נכונות, ושום דבר לא נשמר.</p>
        <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-800">
          <div className="h-2 rounded-full bg-sky-500 transition-all" style={{ width: `${(step / questions.length) * 100}%` }} />
        </div>
        <div className="mt-2 text-sm text-slate-500">
          שאלה {step + 1} מתוך {questions.length}
        </div>
        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <p className="text-xl font-semibold leading-relaxed sm:text-2xl">{q.text}</p>
          <div className="mt-6 grid gap-2">
            {options.map((o) => (
              <button
                key={o.value}
                onClick={() => answer(o.value)}
                className={`rounded-xl border px-4 py-3 text-right font-semibold transition hover:border-sky-400 hover:bg-sky-400/10 ${
                  answers[step] === o.value ? "border-sky-400 bg-sky-400/10" : "border-slate-700"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
          <div className="mt-4 flex justify-between text-sm">
            <button disabled={step === 0} onClick={() => setStep((s) => s - 1)} className="text-slate-400 hover:text-white disabled:opacity-30">
              → הקודמת
            </button>
            <button onClick={() => answer(null)} className="text-slate-400 hover:text-white">
              לא יודע/ת, לדלג
            </button>
          </div>
        </div>
      </main>
    );
  }

  const me = position(answers);
  const ranked = parties
    .map((p) => {
      const d = Math.hypot(p.spectrum.right - me.right, p.spectrum.religious - me.religious);
      return { p, match: Math.round((1 - d / Math.SQRT2) * 100) };
    })
    .sort((a, b) => b.match - a.match);

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <h1 className="text-3xl font-extrabold">הכי קרובות אליכם</h1>
      <p className="mt-1 text-slate-400">לפי התשובות שלכם, אלה המפלגות שהכי קרובות אליכם על המפה.</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {ranked.slice(0, 3).map(({ p, match }, i) => (
          <Link
            key={p.id}
            href={partyHref(p.id)}
            className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 transition hover:-translate-y-0.5 hover:border-slate-600"
          >
            <div className="h-1.5" style={{ background: p.color }} />
            <div className="p-4">
              <div className="text-sm text-slate-400">מקום {i + 1}</div>
              <div className="text-xl font-bold">{p.name}</div>
              <div className="text-3xl font-extrabold" style={{ color: p.color }}>
                {match}%<span className="text-sm font-normal text-slate-400"> התאמה</span>
              </div>
              <div className="text-xs text-slate-500">{p.leader}</div>
            </div>
          </Link>
        ))}
      </div>

      <h2 className="mt-8 text-xl font-bold">איפה אתם על המפה</h2>
      <Plot me={me} top={ranked.slice(0, 3).map((r) => r.p.id)} />
      <p className="mt-1 text-xs text-slate-500">כל נקודה היא מפלגה. רחפו עליה כדי לראות את השם; שלוש הקרובות ביותר מסומנות.</p>

      <h2 className="mt-8 text-xl font-bold">כל המפלגות</h2>
      <ul className="mt-3 space-y-1.5">
        {ranked.map(({ p, match }) => (
          <li key={p.id}>
            <Link href={partyHref(p.id)} className="flex items-center gap-3 rounded-lg px-2 py-1 hover:bg-slate-800/60">
              <span className="w-36 shrink-0 truncate text-sm">{p.name}</span>
              <span className="h-2.5 flex-1 rounded-full bg-slate-800">
                <span className="block h-2.5 rounded-full" style={{ width: `${match}%`, background: p.color }} />
              </span>
              <span className="w-10 text-left font-mono text-sm">{match}%</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100">
        זה כלי להתחלת מחשבה, לא המלצה למי להצביע. ההתאמה מחושבת רק על שני צירים (ימין-שמאל ודתי-חילוני), לפי המיקום המשוער שלנו
        של המפלגות על המפה, ולא לפי המצעים הרשמיים. נושאים כמו כלכלה, ההנהגה או אמון באנשים לא נכנסים לחישוב. כדאי לקרוא את
        העמדות המלאות של המפלגות שיצאו לכם.
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => {
            setAnswers(questions.map(() => null));
            setStep(0);
          }}
          className="rounded-xl border border-slate-700 px-5 py-2.5 font-semibold hover:bg-slate-800"
        >
          להתחיל מחדש
        </button>
        {ranked.length > 1 && (
          <Link
            href={`/compare?a=${ranked[0].p.id}&b=${ranked[1].p.id}`}
            className="rounded-xl bg-sky-500 px-5 py-2.5 font-semibold text-slate-950 hover:bg-sky-400"
          >
            להשוות בין שתי הראשונות
          </Link>
        )}
      </div>
    </main>
  );
}

function Plot({ me, top }: { me: { right: number; religious: number }; top: string[] }) {
  const x = (v: number) => 30 + v * 340;
  const y = (v: number) => 270 - v * 240;
  return (
    <svg viewBox="0 0 400 300" className="mt-3 w-full max-w-xl rounded-xl bg-slate-900/60" role="img" aria-label="המיקום שלכם מול המפלגות">
      <line x1={x(0.5)} y1={y(0)} x2={x(0.5)} y2={y(1)} stroke="#334155" strokeDasharray="4 4" />
      <line x1={x(0)} y1={y(0.5)} x2={x(1)} y2={y(0.5)} stroke="#334155" strokeDasharray="4 4" />
      <text x={x(0)} y={y(0.5) - 6} fill="#94a3b8" fontSize="11">
        שמאל
      </text>
      <text x={x(1)} y={y(0.5) - 6} fill="#94a3b8" fontSize="11" textAnchor="end">
        ימין
      </text>
      <text x={x(0.5) + 6} y={y(1) + 4} fill="#94a3b8" fontSize="11">
        דתי
      </text>
      <text x={x(0.5) + 6} y={y(0) - 2} fill="#94a3b8" fontSize="11">
        חילוני
      </text>
      {parties.map((p) => (
        <g key={p.id}>
          <circle cx={x(p.spectrum.right)} cy={y(p.spectrum.religious)} r="6" fill={p.color} stroke="#020617" strokeWidth="2" />
          {/* Only the top matches get a label, so the plot stays readable. */}
          {top.includes(p.id) && (
            <text x={x(p.spectrum.right)} y={y(p.spectrum.religious) + 18} fill="#e2e8f0" fontSize="10" textAnchor="middle">
              {p.name}
            </text>
          )}
          <title>{p.name}</title>
        </g>
      ))}
      <circle cx={x(me.right)} cy={y(me.religious)} r="10" fill="none" stroke="#fff" strokeWidth="3" />
      <text x={x(me.right)} y={y(me.religious) - 15} fill="#fff" fontSize="13" fontWeight="bold" textAnchor="middle">
        אתם
      </text>
    </svg>
  );
}
