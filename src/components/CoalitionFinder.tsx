"use client";

import { useMemo, useState } from "react";
import { parties } from "@/data/parties";
import { AVERAGE_ID, formatDate, polls, seatsFor } from "@/data/polls";
import { redLines } from "@/data/coalitions";
import { conflictsIn, minimalCoalitions } from "@/lib/coalitions";
import { colorOnDark } from "@/lib/party-color";

const party = (id: string) => parties.find((p) => p.id === id)!;
const PAGE = 8;

export default function CoalitionFinder() {
  const [pollId, setPollId] = useState(AVERAGE_ID);
  const [onlyClean, setOnlyClean] = useState(false);
  const [limit, setLimit] = useState(PAGE);
  const seats = seatsFor(pollId);

  const all = useMemo(
    () =>
      minimalCoalitions(seats)
        .map((members) => {
          const sorted = [...members].sort((a, b) => seats[b] - seats[a]);
          return {
            members: sorted,
            total: sorted.reduce((n, id) => n + seats[id], 0),
            broken: conflictsIn(sorted, redLines),
          };
        })
        .sort((a, b) => a.broken.length - b.broken.length || a.members.length - b.members.length || b.total - a.total),
    [seats],
  );
  const clean = all.filter((c) => c.broken.length === 0);
  const list = onlyClean && clean.length ? clean : all;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <label className="flex items-center gap-2">
          <span className="text-slate-400">לפי</span>
          <select
            value={pollId}
            onChange={(e) => {
              setPollId(e.target.value);
              setLimit(PAGE);
            }}
            className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-slate-100"
          >
            <option value={AVERAGE_ID}>ממוצע כל הסקרים</option>
            {polls.map((p) => (
              <option key={p.id} value={p.id}>
                {p.outlet}, {formatDate(p.date)}
              </option>
            ))}
          </select>
        </label>
        <label className={`flex items-center gap-2 ${clean.length ? "cursor-pointer text-slate-300" : "text-slate-600"}`}>
          <input type="checkbox" disabled={clean.length === 0} checked={onlyClean && clean.length > 0} onChange={(e) => setOnlyClean(e.target.checked)} className="accent-sky-500" />
          רק צירופים שלא שוברים אף קו אדום
        </label>
      </div>

      <p className="mt-3 text-sm text-slate-400">
        {all.length} צירופים מגיעים ל־61.{" "}
        {clean.length === 0 ? (
          <>
            <b className="text-amber-300">אף אחד מהם לא מסתדר עם כל מה שהמפלגות הצהירו</b>, אז קודם מוצגים אלה ששוברים
            הכי מעט קווים אדומים.
          </>
        ) : (
          <>
            <b className="text-emerald-300">{clean.length}</b> מהם לא שוברים אף קו אדום שהוצהר, והם מוצגים ראשונים.
          </>
        )}
      </p>

      <div className="mt-4 space-y-3">
        {list.slice(0, limit).map((c) => (
          <div key={c.members.join()} className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
            <div className="flex items-baseline justify-between gap-3">
              <div className="flex flex-wrap gap-x-2 gap-y-1 text-sm">
                {c.members.map((id) => (
                  <span key={id} className="flex items-center gap-1.5 text-slate-200">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: colorOnDark(id) }} />
                    {party(id).name} <span className="text-slate-500 tabular-nums">{seats[id]}</span>
                  </span>
                ))}
              </div>
              <span className="shrink-0 text-lg font-bold tabular-nums text-slate-100">{c.total}</span>
            </div>
            <div className="mt-2 flex h-2.5 gap-0.5 overflow-hidden rounded-full bg-slate-800" dir="rtl">
              {c.members.map((id) => (
                <div key={id} style={{ width: `${(seats[id] / 120) * 100}%`, background: colorOnDark(id) }} />
              ))}
            </div>
            {c.broken.length === 0 ? (
              <p className="mt-2 text-xs text-emerald-300">✓ אף מפלגה כאן לא הצהירה שלא תשב עם אחרת מהן</p>
            ) : (
              <ul className="mt-2 space-y-1 text-xs text-slate-400">
                {c.broken.map((b) => (
                  <li key={b.a + b.b + b.text}>
                    <span className="text-rose-300">
                      ✕ {party(b.a).name} על {party(b.b).name}:
                    </span>{" "}
                    {b.text}
                    {b.note && <span className="text-slate-500"> ({b.note})</span>}{" "}
                    <a href={b.source} target="_blank" rel="noreferrer" className="text-sky-400 hover:underline">
                      מקור, {formatDate(b.date)}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
      {list.length > limit && (
        <button onClick={() => setLimit((n) => n + PAGE)} className="mt-3 text-sm text-sky-400 hover:underline">
          עוד {Math.min(PAGE, list.length - limit)} צירופים
        </button>
      )}
    </div>
  );
}
