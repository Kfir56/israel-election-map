"use client";

import { parties } from "@/data/parties";
import { AVERAGE_ID, averageSeats, formatDate, partyRange, polls } from "@/data/polls";

// Every poll side by side, so it's clear how much they disagree.
export default function PollsTable({ pollId, onPick }: { pollId: string; onPick: (id: string) => void }) {
  const rows = [...parties].sort((a, b) => (averageSeats[b.id] ?? 0) - (averageSeats[a.id] ?? 0));
  const cell = (active: boolean) => `px-2 py-1.5 text-center ${active ? "bg-sky-400/10" : ""}`;

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800">
      <table className="w-full min-w-[900px] border-collapse text-sm">
        <thead>
          <tr className="bg-slate-900 text-xs text-slate-400">
            <th className="sticky right-0 bg-slate-900 px-3 py-2 text-right">מפלגה</th>
            <th className={cell(pollId === AVERAGE_ID)}>
              <button onClick={() => onPick(AVERAGE_ID)} className="font-semibold text-slate-200 hover:text-sky-300">
                ממוצע
              </button>
            </th>
            <th className="px-2 py-1.5 text-center">טווח</th>
            {polls.map((p) => (
              <th key={p.id} className={cell(pollId === p.id)}>
                <button onClick={() => onPick(p.id)} className="leading-tight hover:text-sky-300">
                  <div className="font-semibold text-slate-200">{p.outlet}</div>
                  <div>{formatDate(p.date)}</div>
                </button>
                <a href={p.source} target="_blank" rel="noreferrer" className="block text-[10px] text-sky-400 underline">
                  מקור
                </a>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="font-mono">
          {rows.map((party) => {
            const { min, max } = partyRange(party.id);
            return (
              <tr key={party.id} className="border-t border-slate-800">
                <td className="sticky right-0 whitespace-nowrap bg-slate-950 px-3 py-1.5 font-sans">
                  <span className="ml-2 inline-block h-2.5 w-2.5 rounded-full" style={{ background: party.color }} />
                  {party.name}
                </td>
                <td className={`${cell(pollId === AVERAGE_ID)} font-bold`}>{averageSeats[party.id] ?? "—"}</td>
                <td className="px-2 py-1.5 text-center font-mono text-xs text-slate-400">
                  {min === max ? min || "—" : `${min || "—"}–${max}`}
                </td>
                {polls.map((p) => {
                  const v = p.seats[party.id];
                  const extreme = v !== undefined && min !== max && (v === max || v === min);
                  return (
                    <td
                      key={p.id}
                      className={`${cell(pollId === p.id)} ${extreme ? (v === max ? "text-emerald-300" : "text-rose-300") : ""}`}
                    >
                      {v ?? <span className="text-slate-600">—</span>}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
