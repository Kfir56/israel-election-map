"use client";

import { useState } from "react";
import { blocLabels, categories, type Party } from "@/data/parties";
import { formatDate, partyRange, polls } from "@/data/polls";

const link = "text-sky-400 underline";

export default function PartyPanel({
  party,
  seats,
  pollLabel,
  onClose,
}: {
  party: Party;
  seats: number;
  pollLabel: string;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<"positions" | "candidates" | "polls">("positions");
  const range = partyRange(party.id);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 rounded-full" style={{ background: party.color }} />
            <h2 className="text-2xl font-bold">{party.name}</h2>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            בראשות {party.leader} · {blocLabels[party.bloc]}
          </p>
        </div>
        <button onClick={onClose} className="rounded-full px-2 text-2xl text-slate-400 hover:text-white" aria-label="סגירה">
          ×
        </button>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <Stat label={pollLabel} value={seats ? `${seats}` : "מתחת לחסימה"} />
        <Stat label="טווח בסקרים" value={range.min === range.max ? `${range.max}` : `${range.min}–${range.max}`} />
        <Stat label="בכנסת היוצאת" value={party.seats25 !== undefined ? `${party.seats25}` : "חדשה"} />
      </div>

      <p className="mt-4 text-sm text-slate-300">{party.summary}</p>

      <div className="mt-4 flex gap-1 rounded-lg bg-slate-800/60 p-1 text-sm">
        {(
          [
            ["positions", "עמדות"],
            ["candidates", "הרשימה"],
            ["polls", "בסקרים"],
          ] as const
        ).map(([t, label]) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-md py-1.5 ${tab === t ? "bg-slate-700 font-semibold" : "text-slate-400"}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-3 flex-1 overflow-y-auto pl-1">
        {tab === "positions" && (
          <>
            <ul className="space-y-2">
              {categories.map((c) => (
                <li key={c.id} className="rounded-lg border border-slate-800 p-3">
                  <div className="text-xs font-semibold text-sky-400">{c.label}</div>
                  <div className="mt-1 text-sm">
                    {party.positions[c.id] ?? <span className="text-slate-500">המקור לא מתייחס לנושא</span>}
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-slate-500">
              מקור: דף המפלגה ב
              <a href={party.idiPage} target="_blank" rel="noreferrer" className={link}>
                המכון הישראלי לדמוקרטיה
              </a>
              , בתמצות שלנו.
              {party.platform && (
                <>
                  {" "}
                  <a href={party.platform} target="_blank" rel="noreferrer" className={link}>
                    המצע המלא
                  </a>
                </>
              )}
            </p>
          </>
        )}

        {tab === "candidates" && (
          <>
            <ol className="space-y-1">
              {party.candidates.map((c) => (
                <li key={c.pos} className="flex items-start gap-3 rounded-lg bg-slate-800/40 px-3 py-2">
                  <span className="w-6 shrink-0 text-center font-mono text-slate-400">{c.pos}</span>
                  <div className="min-w-0">
                    <div className="font-medium">{c.name}</div>
                    {(c.note || c.faction) && (
                      <div className="text-xs text-slate-400">{[c.note, c.faction && `מטעם ${c.faction}`].filter(Boolean).join(" · ")}</div>
                    )}
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-3 text-xs text-slate-500">
              הסדר והשמות לפי{" "}
              <a href={party.listSource} target="_blank" rel="noreferrer" className={link}>
                רשימת המועמדים שהוגשה לוועדת הבחירות
              </a>{" "}
              (דרך המכון הישראלי לדמוקרטיה). התפקידים האפורים הם רקע ציבורי שהוספנו, ואינם חלק מהרשימה.
            </p>
          </>
        )}

        {tab === "polls" && (
          <ul className="space-y-1">
            {polls.map((p, i) => {
              const v = range.values[i];
              return (
                <li key={p.id} className="flex items-center gap-2 text-sm">
                  <a href={p.source} target="_blank" rel="noreferrer" className="w-28 shrink-0 truncate hover:text-sky-300">
                    {p.outlet} <span className="text-xs text-slate-500">{formatDate(p.date)}</span>
                  </a>
                  <div className="h-3 flex-1 rounded-full bg-slate-800">
                    <div className="h-3 rounded-full" style={{ width: `${(v / 30) * 100}%`, background: party.color }} />
                  </div>
                  <span className="w-6 text-left font-mono">{v || "—"}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-800/60 p-2">
      <div className="truncate text-[11px] text-slate-400" title={label}>
        {label}
      </div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}
