"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import PartyPanel from "@/components/PartyPanel";
import {
  type Bloc,
  type CategoryId,
  MAJORITY,
  POLL_SOURCE,
  blocLabels,
  categories,
  parties,
} from "@/data/parties";

const IsraelMap3D = dynamic(() => import("@/components/IsraelMap3D"), {
  ssr: false,
  loading: () => <div className="grid h-full place-items-center text-slate-500">טוען מפה…</div>,
});

const blocs: Bloc[] = ["coalition", "opposition", "arab"];
const blocColors: Record<Bloc, string> = { coalition: "#2563eb", opposition: "#14b8a6", arab: "#9f1239" };

export default function Explorer() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [focusBloc, setFocusBloc] = useState<Bloc | null>(null);
  const [category, setCategory] = useState<CategoryId>("security");
  const selected = parties.find((p) => p.id === selectedId) ?? null;
  const seats = (b: Bloc) => parties.filter((p) => p.bloc === b).reduce((s, p) => s + p.poll, 0);

  return (
    <>
      <section className="grid gap-4 lg:grid-cols-[1fr_380px]">
        {/* LTR so the 3D labels and the left/right axis line up with the screen. */}
        <div dir="ltr" className="relative h-[60vh] min-h-[420px] overflow-hidden rounded-2xl border border-slate-800 lg:h-[72vh]">
          <IsraelMap3D
            parties={parties}
            selectedId={selectedId}
            focusBloc={focusBloc}
            onSelect={setSelectedId}
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-between p-3 text-xs text-slate-400">
            <span>← שמאל</span>
            <span dir="rtl">צפון: דתי · דרום: חילוני</span>
            <span>ימין →</span>
          </div>
        </div>

        <aside className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 lg:h-[72vh]">
          {selected ? (
            <PartyPanel party={selected} onClose={() => setSelectedId(null)} />
          ) : (
            <div className="flex h-full flex-col">
              <h2 className="text-lg font-bold">מאזן הגושים</h2>
              <p className="text-xs text-slate-400">לפי {POLL_SOURCE}</p>
              <div className="relative mt-3 flex h-4 overflow-hidden rounded-full bg-slate-800">
                {blocs.map((b) => (
                  <div key={b} style={{ width: `${(seats(b) / 120) * 100}%`, background: blocColors[b] }} />
                ))}
                <div className="absolute inset-y-0 w-0.5 bg-white" style={{ right: `${(MAJORITY / 120) * 100}%` }} />
              </div>
              <div className="mt-3 space-y-1">
                {blocs.map((b) => (
                  <button
                    key={b}
                    onClick={() => setFocusBloc(focusBloc === b ? null : b)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm ${
                      focusBloc === b ? "bg-slate-700" : "hover:bg-slate-800"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full" style={{ background: blocColors[b] }} />
                      {blocLabels[b]}
                    </span>
                    <span className="font-mono">{seats(b)}</span>
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-slate-500">דרושים {MAJORITY} מנדטים להקמת ממשלה. לחצו על גוש כדי להדגיש אותו.</p>

              <h2 className="mt-5 text-lg font-bold">המפלגות</h2>
              <ul className="mt-2 flex-1 space-y-1 overflow-y-auto">
                {parties.map((p) => (
                  <li key={p.id}>
                    <button
                      onClick={() => setSelectedId(p.id)}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-slate-800"
                    >
                      <span className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full" style={{ background: p.color }} />
                        {p.name}
                        <span className="text-xs text-slate-500">{p.leader}</span>
                      </span>
                      <span className="font-mono">{p.poll || "—"}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">מה כל מפלגה אומרת</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`rounded-full border px-4 py-1.5 text-sm ${
                category === c.id ? "border-sky-400 bg-sky-400/10 text-sky-300" : "border-slate-700 text-slate-300"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {parties.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setSelectedId(p.id);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-right hover:border-slate-600"
            >
              <div className="flex items-center gap-2 font-semibold">
                <span className="h-3 w-3 rounded-full" style={{ background: p.color }} />
                {p.name}
              </div>
              <p className="mt-2 text-sm text-slate-300">
                {p.positions[category] ?? <span className="text-slate-500">טרם הוזן</span>}
              </p>
            </button>
          ))}
        </div>
      </section>
    </>
  );
}
