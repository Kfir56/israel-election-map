"use client";

import { useMemo, useState } from "react";
import { parties } from "@/data/parties";
import { averageSeats } from "@/data/polls";
import { THRESHOLD_PCT, allocate } from "@/lib/seats";

const ordered = [...parties].sort((a, b) => (averageSeats[b.id] ?? 0) - (averageSeats[a.id] ?? 0));
const byId = Object.fromEntries(parties.map((p) => [p.id, p]));

// Starting point: the poll average turned into vote shares, leaving about 4%
// of the votes to lists that don't pass the threshold.
const initial = Object.fromEntries(
  ordered.map((p) => {
    const s = averageSeats[p.id] ?? 0;
    return [p.id, s >= 4 ? Math.round((s / 120) * 96 * 10) / 10 : Math.round(s * 0.8 * 10) / 10];
  }),
);

export default function SeatCalculator() {
  const [pct, setPct] = useState<Record<string, number>>(initial);
  const [pairs, setPairs] = useState<[string, string][]>([]);
  const [a, setA] = useState("");
  const [b, setB] = useState("");

  const used = ordered.reduce((s, p) => s + (pct[p.id] ?? 0), 0);
  const others = Math.max(0, 100 - used);
  const result = useMemo(() => allocate(pct, Math.max(100, used), pairs), [pct, pairs, used]);
  const wasted = ordered.filter((p) => !result.qualified.includes(p.id)).reduce((s, p) => s + (pct[p.id] ?? 0), 0) + others;
  const paired = new Set(pairs.flat());
  // Share of all valid votes that buys one seat.
  const perSeat = ((result.quota / Math.max(100, used)) * 100).toFixed(2);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 sm:p-6">
      <div className="grid gap-3 text-center sm:grid-cols-3">
        <Box label="אחוז החסימה" value={`${THRESHOLD_PCT}%`} />
        <Box label="מנדט אחד שווה בערך" value={`${perSeat}% מהקולות`} />
        <Box label="קולות שהלכו לרשימות שלא עברו" value={`${wasted.toFixed(1)}%`} warn={wasted > 0} />
      </div>

      <ul className="mt-5 space-y-2">
        {ordered.map((p) => {
          const v = pct[p.id] ?? 0;
          const passed = result.qualified.includes(p.id);
          const s = result.seats[p.id] ?? 0;
          return (
            <li key={p.id} className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 sm:grid-cols-[10rem_1fr_4rem_5rem]">
              <span className="flex items-center gap-2 text-sm font-semibold">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: p.color }} />
                {p.name}
              </span>
              <span className="text-left text-sm sm:order-last">
                {passed ? (
                  <b className="text-lg">{s}</b>
                ) : (
                  <span className="text-xs text-rose-300">לא עברה</span>
                )}
                {passed && <span className="text-xs text-slate-500"> מנד׳</span>}
              </span>
              <input
                type="range"
                min={0}
                max={35}
                step={0.1}
                value={v}
                onChange={(e) => setPct((x) => ({ ...x, [p.id]: Number(e.target.value) }))}
                aria-label={`אחוז הקולות של ${p.name}`}
                className="col-span-2 w-full sm:col-span-1"
                style={{ accentColor: p.color }}
              />
              <span dir="ltr" className={`hidden text-left font-mono text-sm sm:block ${v < THRESHOLD_PCT ? "text-rose-300" : "text-slate-300"}`}>
                {v.toFixed(1)}%
              </span>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-xs text-slate-500">
        גררו כדי לשנות כמה אחוזים מהקולות כל רשימה מקבלת. ההתחלה היא ממוצע הסקרים, כשבערך 4% מהקולות הולכים לרשימות קטנות
        שלא עוברות. {used > 100 ? "הסכום עובר 100%, אז מתייחסים לכל מספר כחלק יחסי." : `${others.toFixed(1)}% הנותרים הולכים לרשימות קטנות אחרות.`}
      </p>

      <div className="mt-5 rounded-xl bg-slate-950/60 p-4">
        <div className="font-semibold">הסכמי עודפים</div>
        <p className="mt-1 text-sm text-slate-400">
          שתי רשימות שחתמו על הסכם נספרות כרשימה אחת כשמחלקים את המנדטים שנשארו בסוף. נסו לחבר שתי רשימות ותראו אם מנדט עובר.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {[a, b].map((val, i) => (
            <select
              key={i}
              value={val}
              onChange={(e) => (i === 0 ? setA : setB)(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-800 px-2 py-1.5 text-sm"
            >
              <option value="">בחרו רשימה</option>
              {ordered
                .filter((p) => !paired.has(p.id) && p.id !== (i === 0 ? b : a))
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
            </select>
          ))}
          <button
            disabled={!a || !b}
            onClick={() => {
              setPairs((x) => [...x, [a, b]]);
              setA("");
              setB("");
            }}
            className="rounded-lg bg-sky-500 px-3 py-1.5 text-sm font-semibold text-slate-950 disabled:opacity-40"
          >
            חיבור
          </button>
          <button
            onClick={() => {
              setPct(initial);
              setPairs([]);
            }}
            className="rounded-lg px-3 py-1.5 text-sm text-slate-400 hover:bg-slate-800"
          >
            איפוס הכל
          </button>
        </div>
        {pairs.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2 text-sm">
            {pairs.map(([x, y]) => (
              <li key={`${x}+${y}`} className="flex items-center gap-2 rounded-full bg-slate-800 px-3 py-1">
                {byId[x].name} + {byId[y].name}
                <button onClick={() => setPairs((ps) => ps.filter((p) => p[0] !== x))} className="text-slate-400 hover:text-white" aria-label="הסרה">
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="mt-4 text-sm text-slate-300">
        בסיבוב הראשון כל רשימה קיבלה מנדט על כל {perSeat}% שלמים: יצאו{" "}
        <b>{result.firstRound}</b> מנדטים. את <b>{120 - result.firstRound}</b> הנותרים חילקנו לפי שיטת בדר-עופר, שבה כל מנדט עובר
        לרשימה (או לזוג בהסכם עודפים) שהכי ״קרובה״ למנדט נוסף.
        {result.leftovers.length > 0 && (
          <>
            {" "}
            הם הלכו ל:{" "}
            {result.leftovers.map((id) => id.split("+").map((x) => byId[x].name).join(" + ")).join(", ")}.
          </>
        )}
      </p>
    </div>
  );
}

function Box({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div className="rounded-xl bg-slate-800/60 p-3">
      <div className="text-xs text-slate-400">{label}</div>
      <div className={`mt-0.5 font-bold ${warn ? "text-amber-300" : ""}`}>{value}</div>
    </div>
  );
}
