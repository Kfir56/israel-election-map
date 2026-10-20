"use client";

import { useMemo, useState } from "react";
import { parties } from "@/data/parties";
import type { Poll } from "@/data/polls";

// Party colors are the parties' own, so they stay. The two near-black ones
// would vanish on the dark surface; they get a light gray stand-in here.
const LINE_COLOR: Record<string, string> = { shas: "#e7e5e4", utj: "#a8a29e" };
const colorOf = (id: string) => LINE_COLOR[id] ?? parties.find((p) => p.id === id)!.color;
const nameOf = (id: string) => parties.find((p) => p.id === id)!.name;

const W = 760;
const H = 360;
const PAD = { top: 16, right: 128, bottom: 28, left: 32 };
const DAY = 86_400_000;
const WINDOW_DAYS = 7;

/** Average of every poll in the WINDOW_DAYS before each poll date. */
function rolling(polls: Poll[], id: string) {
  return polls.map((p) => {
    const t = Date.parse(p.date);
    const inWindow = polls.filter((q) => {
      const s = Date.parse(q.date);
      return s <= t && s > t - WINDOW_DAYS * DAY;
    });
    return { t, v: inWindow.reduce((n, q) => n + (q.seats[id] ?? 0), 0) / inWindow.length };
  });
}

export default function PollTrend({ polls }: { polls: Poll[] }) {
  const ids = useMemo(() => {
    const last = polls.slice(-10);
    const avg = (id: string) => last.reduce((n, p) => n + (p.seats[id] ?? 0), 0) / last.length;
    return parties.map((p) => p.id).filter((id) => polls.some((p) => p.seats[id])).sort((a, b) => avg(b) - avg(a));
  }, [polls]);
  const [shown, setShown] = useState<Set<string>>(() => new Set(ids.slice(0, 6)));
  const [hover, setHover] = useState<number | null>(null);

  const t0 = Date.parse(polls[0].date);
  const t1 = Date.parse(polls[polls.length - 1].date);
  const yMax = Math.ceil(Math.max(...polls.flatMap((p) => [...shown].map((id) => p.seats[id] ?? 0)), 10) / 5) * 5;
  // RTL page, but time still runs left to right, like every news chart.
  const x = (t: number) => PAD.left + ((t - t0) / Math.max(t1 - t0, DAY)) * (W - PAD.left - PAD.right);
  const y = (v: number) => PAD.top + (1 - v / yMax) * (H - PAD.top - PAD.bottom);
  const lines = [...shown].map((id) => ({ id, pts: rolling(polls, id) }));
  const ticks = Array.from({ length: yMax / 5 + 1 }, (_, i) => i * 5);
  // One date tick a week, starting from the first poll.
  const weeks = Array.from({ length: Math.floor((t1 - t0) / (7 * DAY)) + 1 }, (_, i) => t0 + i * 7 * DAY);
  const hoverPoll = hover === null ? null : polls[hover];

  // Direct labels at the right end, nudged apart so they don't overlap.
  const ends = lines
    .map((l) => ({ id: l.id, v: l.pts[l.pts.length - 1].v }))
    .sort((a, b) => b.v - a.v)
    .reduce<{ id: string; v: number; ly: number }[]>((acc, e) => {
      const ly = Math.max(y(e.v), (acc.at(-1)?.ly ?? -Infinity) + 14);
      return [...acc, { ...e, ly }];
    }, []);

  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {ids.map((id) => {
          const on = shown.has(id);
          return (
            <button
              key={id}
              onClick={() =>
                setShown((s) => {
                  const n = new Set(s);
                  if (on) n.delete(id);
                  else n.add(id);
                  return n.size ? n : s;
                })
              }
              aria-pressed={on}
              className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition ${
                on ? "border-slate-500 bg-slate-800 text-slate-100" : "border-slate-800 text-slate-500 hover:text-slate-300"
              }`}
            >
              <span className="h-2 w-2 rounded-full" style={{ background: on ? colorOf(id) : "#334155" }} />
              {nameOf(id)}
            </button>
          );
        })}
      </div>

      <div dir="ltr" className="relative mt-3 overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full min-w-[640px]"
          role="img"
          aria-label="מנדטים בסקרים לאורך זמן"
          onMouseLeave={() => setHover(null)}
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            const t = t0 + (((e.clientX - r.left) / r.width) * W - PAD.left) / (W - PAD.left - PAD.right) * (t1 - t0);
            let best = 0;
            polls.forEach((p, i) => {
              if (Math.abs(Date.parse(p.date) - t) < Math.abs(Date.parse(polls[best].date) - t)) best = i;
            });
            setHover(best);
          }}
        >
          {ticks.map((v) => (
            <g key={v}>
              <line x1={PAD.left} x2={W - PAD.right} y1={y(v)} y2={y(v)} stroke="#1e293b" strokeWidth={1} />
              <text x={PAD.left - 6} y={y(v) + 4} textAnchor="end" fontSize={11} fill="#64748b">
                {v}
              </text>
            </g>
          ))}
          {weeks.map((t) => {
            const d = new Date(t);
            return (
              <text key={t} x={x(t)} y={H - 8} textAnchor="middle" fontSize={11} fill="#64748b">
                {d.getUTCDate()}.{d.getUTCMonth() + 1}
              </text>
            );
          })}
          {/* The threshold: about 4 seats. */}
          <line x1={PAD.left} x2={W - PAD.right} y1={y(4)} y2={y(4)} stroke="#f59e0b" strokeDasharray="4 4" strokeWidth={1} opacity={0.6} />
          <text x={PAD.left + 4} y={y(4) - 4} fontSize={10} fill="#f59e0b" opacity={0.8}>
            אחוז החסימה
          </text>

          {lines.map(({ id }) =>
            polls.map((p) =>
              p.seats[id] ? (
                <circle key={`${id}-${p.id}`} cx={x(Date.parse(p.date))} cy={y(p.seats[id])} r={2} fill={colorOf(id)} opacity={0.35} />
              ) : null,
            ),
          )}
          {lines.map(({ id, pts }) => (
            <path
              key={id}
              d={pts.map((p, i) => `${i ? "L" : "M"}${x(p.t).toFixed(1)},${y(p.v).toFixed(1)}`).join("")}
              fill="none"
              stroke={colorOf(id)}
              strokeWidth={2}
              strokeLinejoin="round"
            />
          ))}
          {ends.map((e) => (
            <text key={e.id} x={W - PAD.right + 6} y={e.ly + 4} fontSize={12} fill="#cbd5e1">
              <tspan fill={colorOf(e.id)}>●</tspan> {nameOf(e.id)} {Math.round(e.v)}
            </text>
          ))}
          {hoverPoll && (
            <line x1={x(Date.parse(hoverPoll.date))} x2={x(Date.parse(hoverPoll.date))} y1={PAD.top} y2={H - PAD.bottom} stroke="#475569" />
          )}
        </svg>
        {hoverPoll && (
          <div
            dir="rtl"
            className="pointer-events-none absolute top-2 z-10 w-48 rounded-lg border border-slate-700 bg-slate-900/95 p-2 text-xs shadow-xl"
            style={x(Date.parse(hoverPoll.date)) > W / 2 ? { left: 8 } : { right: 8 }}
          >
            <div className="font-semibold text-slate-100">{hoverPoll.outlet}</div>
            <div className="mb-1 text-slate-500">
              {hoverPoll.pollster} · {new Date(hoverPoll.date).toLocaleDateString("he-IL")}
            </div>
            {[...shown]
              .sort((a, b) => (hoverPoll.seats[b] ?? 0) - (hoverPoll.seats[a] ?? 0))
              .map((id) => (
                <div key={id} className="flex justify-between gap-2 text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ background: colorOf(id) }} />
                    {nameOf(id)}
                  </span>
                  <span className="font-mono">{hoverPoll.seats[id] || "—"}</span>
                </div>
              ))}
          </div>
        )}
      </div>
      <p className="mt-2 text-xs text-slate-500">
        כל נקודה היא סקר אחד, והקו הוא ממוצע הסקרים בשבוע שלפני כל תאריך. לחצו על שם מפלגה כדי להוסיף אותה לגרף או להסתיר
        אותה, ועברו עם העכבר על הגרף כדי לראות כל סקר.
      </p>
    </div>
  );
}
