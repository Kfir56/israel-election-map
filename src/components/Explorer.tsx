"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import PartyPanel from "@/components/PartyPanel";
import PollPicker, { pollLabel } from "@/components/PollPicker";
import PollsTable from "@/components/PollsTable";
import { type Bloc, type CategoryId, MAJORITY, blocLabels, categories, parties } from "@/data/parties";
import { partyHref } from "@/data/people";
import { AVERAGE_ID, seatsFor } from "@/data/polls";

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
  const [coalitionMode, setCoalitionMode] = useState(false);
  const [coalition, setCoalition] = useState<string[]>([]);
  const [pollId, setPollId] = useState(AVERAGE_ID);
  const seats = seatsFor(pollId);
  // Parties below the threshold in this poll can't be in the coalition.
  const members = coalition.filter((id) => seats[id]);
  const coalitionSeats = members.reduce((sum, id) => sum + seats[id], 0);

  const onPartyClick = (id: string) => {
    if (!coalitionMode) return setSelectedId(id);
    if (!seats[id]) return;
    setCoalition((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));
  };
  const selected = parties.find((p) => p.id === selectedId) ?? null;
  const blocSeats = (b: Bloc) => parties.filter((p) => p.bloc === b).reduce((sum, p) => sum + (seats[p.id] ?? 0), 0);
  const pickPoll = (id: string) => {
    setPollId(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <section className="grid gap-4 lg:grid-cols-[1fr_380px]">
        {/* LTR so the 3D labels and the left/right axis line up with the screen. */}
        <div dir="ltr" className="relative h-[60vh] min-h-[420px] overflow-hidden rounded-2xl border border-slate-800 lg:h-[72vh]">
          <IsraelMap3D
            parties={parties}
            seats={seats}
            selectedId={selectedId}
            focusBloc={focusBloc}
            coalition={members}
            coalitionMode={coalitionMode}
            onPartyClick={onPartyClick}
          />
          <div dir="rtl" className="absolute inset-x-0 top-0 flex flex-wrap items-start justify-between gap-2 p-3">
            <button
              onClick={() => {
                setCoalitionMode(!coalitionMode);
                setSelectedId(null);
              }}
              className={`rounded-full px-4 py-2 text-sm font-bold shadow-lg transition ${
                coalitionMode
                  ? "bg-amber-400 text-slate-900"
                  : "bg-gradient-to-l from-amber-400 to-pink-500 text-white hover:scale-105"
              }`}
            >
              {coalitionMode ? "יציאה ממצב קואליציה" : "👑 נסו להרכיב קואליציה"}
            </button>
            {coalitionMode && (
              <div className="rounded-xl bg-slate-950/80 px-3 py-2 text-sm text-white backdrop-blur">
                {coalitionSeats >= MAJORITY ? (
                  <span className="font-bold text-amber-300">🎉 יש ממשלה! {coalitionSeats} מנדטים</span>
                ) : (
                  <span>
                    לחצו על מפלגות כדי לצרף אותן · <b>{coalitionSeats}</b>/{MAJORITY}
                    {coalitionSeats > 0 && ` · חסרים ${MAJORITY - coalitionSeats}`}
                  </span>
                )}
                {members.length > 0 && (
                  <button onClick={() => setCoalition([])} className="mr-3 text-xs text-slate-400 underline">
                    איפוס
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-between p-3 text-xs text-slate-300 [text-shadow:0_1px_2px_#000]">
            <span>← שמאל</span>
            <span dir="rtl" className="hidden sm:inline">גררו לסיבוב · גלגלת לזום · צפון: דתי · דרום: חילוני</span>
            <span>ימין →</span>
          </div>
        </div>

        <aside className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 lg:h-[72vh]">
          {selected ? (
            <PartyPanel
              party={selected}
              seats={seats[selected.id] ?? 0}
              pollLabel={pollLabel(pollId)}
              onClose={() => setSelectedId(null)}
            />
          ) : (
            <div className="flex h-full flex-col">
              <PollPicker pollId={pollId} onChange={setPollId} />
              <h2 className="mt-4 text-lg font-bold">מאזן הגושים</h2>
              <div className="relative mt-3 flex h-4 overflow-hidden rounded-full bg-slate-800">
                {blocs.map((b) => (
                  <div key={b} style={{ width: `${(blocSeats(b) / 120) * 100}%`, background: blocColors[b] }} />
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
                    <span className="font-mono">{blocSeats(b)}</span>
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-slate-500">דרושים {MAJORITY} מנדטים להקמת ממשלה. לחצו על גוש כדי להדגיש אותו.</p>

              <h2 className="mt-5 text-lg font-bold">המפלגות</h2>
              <ul className="mt-2 flex-1 space-y-1 overflow-y-auto">
                {parties.map((p) => (
                  <li key={p.id}>
                    <button
                      onClick={() => onPartyClick(p.id)}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-slate-800"
                    >
                      <span className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full" style={{ background: p.color }} />
                        {p.name}
                        <span className="text-xs text-slate-500">{p.leader}</span>
                      </span>
                      <span className="font-mono">{seats[p.id] || "—"}</span>
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
            <Link
              key={p.id}
              href={partyHref(p.id)}
              className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-right hover:border-slate-600"
            >
              <div className="flex items-center gap-2 font-semibold">
                <span className="h-3 w-3 rounded-full" style={{ background: p.color }} />
                {p.name}
              </div>
              <p className="mt-2 text-sm text-slate-300">
                {p.positions[category] ?? <span className="text-slate-500">המקור לא מתייחס לנושא</span>}
              </p>
              <div className="mt-2 text-xs text-sky-400">לכל העמדות והרשימה ←</div>
            </Link>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-500">
          מקור העמדות: דפי המפלגות באתר המכון הישראלי לדמוקרטיה, בתמצות שלנו. הקישור למקור נמצא בעמוד של כל מפלגה.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">כל הסקרים</h2>
        <p className="mt-1 text-sm text-slate-400">
          הסקרים שונים מאוד זה מזה, אז כאן רואים את כולם. ירוק = הכי גבוה בין הסקרים, אדום = הכי נמוך, ״—״ = מתחת
          לאחוז החסימה. לחצו על סקר כדי להציג אותו במפה.
        </p>
        <div className="mt-4">
          <PollsTable pollId={pollId} onPick={pickPoll} />
        </div>
      </section>
    </>
  );
}
