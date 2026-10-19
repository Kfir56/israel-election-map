"use client";

import Link from "next/link";
import { useState } from "react";
import { parties } from "@/data/parties";
import { bioFor, personHref } from "@/data/people";

const all = parties.flatMap((p) => p.candidates.map((c) => ({ party: p, c })));
// Ignore geresh and quote marks, so "סמוטריץ" finds "סמוטריץ׳".
const norm = (s: string) => s.replace(/[׳'"״()\-]/g, "").trim();

export default function CandidateSearch() {
  const [q, setQ] = useState("");
  const query = norm(q);
  const hits = query.length < 2 ? [] : all.filter(({ c }) => norm(c.name).includes(query)).slice(0, 12);

  return (
    <div className="relative">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={`חיפוש מועמד מתוך ${all.length} השמות ברשימות…`}
        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-sky-500"
      />
      {query.length >= 2 && (
        <ul className="absolute inset-x-0 top-full z-20 mt-1 max-h-96 overflow-y-auto rounded-xl border border-slate-700 bg-slate-900 p-1 shadow-2xl">
          {hits.length === 0 && <li className="px-3 py-2 text-sm text-slate-500">לא נמצא מועמד בשם הזה.</li>}
          {hits.map(({ party, c }) => (
            <li key={`${party.id}-${c.pos}`}>
              <Link href={personHref(party.id, c.pos)} className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-800">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: party.color }} />
                <span className="flex-1">
                  <span className="font-semibold">{c.name}</span>
                  <span className="text-sm text-slate-400">
                    {" "}
                    · מקום {c.pos} ב{party.name}
                  </span>
                </span>
                {bioFor(party.id, c.pos) && <span className="text-xs text-sky-400">ביוגרפיה</span>}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
