import Link from "next/link";
import CandidateSearch from "@/components/CandidateSearch";
import { blocLabels, parties } from "@/data/parties";
import { partyHref } from "@/data/people";
import { averageSeats, partyRange, polls } from "@/data/polls";

export const metadata = { title: "המפלגות · המפה הפוליטית 2026" };

export default function PartiesPage() {
  const ordered = [...parties].sort((a, b) => (averageSeats[b.id] ?? 0) - (averageSeats[a.id] ?? 0));
  return (
    <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <h1 className="text-3xl font-extrabold">המפלגות</h1>
      <p className="mt-1 text-slate-400">
        {parties.length} הרשימות שמופיעות בסקרים, לפי ממוצע {polls.length} הסקרים האחרונים. לחצו על רשימה לכל העמדות והמועמדים.
      </p>
      <div className="mt-5 max-w-xl">
        <CandidateSearch />
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ordered.map((p) => {
          const r = partyRange(p.id);
          return (
            <Link
              key={p.id}
              href={partyHref(p.id)}
              className="group overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 transition hover:-translate-y-0.5 hover:border-slate-600"
            >
              <div className="h-1.5" style={{ background: p.color }} />
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xl font-bold group-hover:text-sky-300">{p.name}</div>
                    <div className="text-sm text-slate-400">{p.leader}</div>
                  </div>
                  <div className="text-left">
                    <div className="text-3xl font-extrabold" style={{ color: p.color }}>
                      {averageSeats[p.id] || "—"}
                    </div>
                    {(averageSeats[p.id] ?? 0) < 4 && <div className="text-[10px] text-amber-300">מתחת לחסימה ברוב הסקרים</div>}
                    <div dir="ltr" className="text-xs text-slate-500">
                      {r.min === r.max ? r.max : `${r.min}–${r.max}`}
                    </div>
                  </div>
                </div>
                <p className="mt-3 line-clamp-2 text-sm text-slate-300">{p.summary}</p>
                <div className="mt-3 text-xs text-slate-500">{blocLabels[p.bloc]}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
