"use client";

import { useState } from "react";
import { blocLabels, categories, type Party } from "@/data/parties";

export default function PartyPanel({ party, onClose }: { party: Party; onClose: () => void }) {
  const [tab, setTab] = useState<"positions" | "candidates">("positions");

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

      <div className="mt-4 grid grid-cols-2 gap-2 text-center">
        <Stat label="בסקר האחרון" value={party.poll ? `${party.poll} מנדטים` : "מתחת לחסימה"} />
        <Stat label="בכנסת היוצאת" value={party.seats25 !== undefined ? `${party.seats25} מנדטים` : "מפלגה חדשה"} />
      </div>

      <p className="mt-4 text-slate-300">{party.summary}</p>

      <div className="mt-5 flex gap-1 rounded-lg bg-slate-800/60 p-1 text-sm">
        {(["positions", "candidates"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-md py-1.5 ${tab === t ? "bg-slate-700 font-semibold" : "text-slate-400"}`}
          >
            {t === "positions" ? "עמדות" : "הרשימה"}
          </button>
        ))}
      </div>

      <div className="mt-4 flex-1 overflow-y-auto">
        {tab === "positions" ? (
          <ul className="space-y-3">
            {categories.map((c) => (
              <li key={c.id} className="rounded-lg border border-slate-800 p-3">
                <div className="text-xs font-semibold text-sky-400">{c.label}</div>
                <div className="mt-1 text-sm">
                  {party.positions[c.id] ?? <span className="text-slate-500">טרם הוזן</span>}
                </div>
              </li>
            ))}
          </ul>
        ) : party.candidates.length ? (
          <ol className="space-y-1.5">
            {party.candidates.map((c) => (
              <li key={c.pos} className="flex items-center gap-3 rounded-lg bg-slate-800/40 px-3 py-2">
                <span className="w-6 text-center font-mono text-slate-400">{c.pos}</span>
                <span className="font-medium">{c.name}</span>
                {c.note && <span className="text-xs text-slate-400">{c.note}</span>}
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-sm text-slate-500">הרשימה טרם הוזנה.</p>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-800/60 p-2">
      <div className="text-xs text-slate-400">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}
