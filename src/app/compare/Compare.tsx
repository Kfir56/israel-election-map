"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { type Party, blocLabels, categories, parties } from "@/data/parties";
import { bioFor, partyHref, personHref } from "@/data/people";
import { averageSeats, partyRange } from "@/data/polls";
import { topicHref } from "@/data/topics";

const ordered = [...parties].sort((a, b) => (averageSeats[b.id] ?? 0) - (averageSeats[a.id] ?? 0));
const find = (id: string | null, fallback: Party) => parties.find((p) => p.id === id) ?? fallback;

export default function Compare() {
  const params = useSearchParams();
  const router = useRouter();
  const a = find(params.get("a"), ordered[0]);
  const b = find(params.get("b"), ordered[1]);
  const pick = (side: "a" | "b", id: string) => {
    const next = new URLSearchParams(params.toString());
    next.set(side, id);
    router.replace(`/compare?${next.toString()}`, { scroll: false });
  };

  const rangeText = (p: Party) => {
    const r = partyRange(p.id);
    return r.min === r.max ? `${r.max}` : `${r.min}–${r.max}`;
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <h1 className="text-3xl font-extrabold">השוואה בין מפלגות</h1>
      <p className="mt-1 text-slate-400">בחרו שתי מפלגות וראו אותן זו מול זו, נושא אחרי נושא. אפשר לשלוח את הקישור לחברים.</p>

      <div className="sticky top-14 z-10 -mx-4 mt-5 grid grid-cols-2 gap-3 bg-slate-950/95 px-4 py-3 backdrop-blur sm:mx-0 sm:px-0">
        {(["a", "b"] as const).map((side) => {
          const p = side === "a" ? a : b;
          return (
            <div key={side} className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
              <div className="h-1.5" style={{ background: p.color }} />
              <select
                value={p.id}
                onChange={(e) => pick(side, e.target.value)}
                aria-label={side === "a" ? "מפלגה ראשונה" : "מפלגה שנייה"}
                className="w-full bg-transparent px-3 py-2.5 text-lg font-bold outline-none"
              >
                {ordered.map((o) => (
                  <option key={o.id} value={o.id} className="bg-slate-900 text-base">
                    {o.name}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>

      <Row label="בראשות">
        {[a, b].map((p) => (
          <Link key={p.id} href={personHref(p.id, 1)} className="font-semibold hover:text-sky-300">
            {p.leader}
          </Link>
        ))}
      </Row>
      <Row label="גוש">
        {[a, b].map((p) => (
          <span key={p.id}>{blocLabels[p.bloc]}</span>
        ))}
      </Row>
      <Row label="ממוצע הסקרים (טווח)">
        {[a, b].map((p) => (
          <span key={p.id}>
            <b className="text-2xl" style={{ color: p.color }}>
              {averageSeats[p.id] || "—"}
            </b>{" "}
            <span dir="ltr" className="text-sm text-slate-400">
              ({rangeText(p)})
            </span>
          </span>
        ))}
      </Row>
      <Row label="בכנסת היוצאת">
        {[a, b].map((p) => (
          <span key={p.id}>{p.seats25 !== undefined ? `${p.seats25} מנדטים` : "מפלגה חדשה"}</span>
        ))}
      </Row>
      <Row label="מיקום על המפה (הערכה שלנו)">
        {[a, b].map((p) => (
          <div key={p.id} className="space-y-1.5 text-xs text-slate-400">
            <Scale value={p.spectrum.right} low="שמאל" high="ימין" color={p.color} />
            <Scale value={p.spectrum.religious} low="חילוני" high="דתי" color={p.color} />
          </div>
        ))}
      </Row>

      <h2 className="mt-10 text-2xl font-bold">העמדות</h2>
      {categories.map((c) => (
        <Row
          key={c.id}
          label={
            <Link href={topicHref(c.id)} className="hover:text-sky-300">
              {c.label}
            </Link>
          }
        >
          {[a, b].map((p) => (
            <p key={p.id} className="text-sm leading-relaxed">
              {p.positions[c.id] ?? <span className="text-slate-500">אין סיכום עמדה במקור</span>}
            </p>
          ))}
        </Row>
      ))}

      <h2 className="mt-10 text-2xl font-bold">חמשת הראשונים ברשימה</h2>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {[a, b].map((p) => (
          <ol key={p.id} className="space-y-1.5">
            {p.candidates.slice(0, 5).map((c) => (
              <li key={c.pos}>
                <Link href={personHref(p.id, c.pos)} className="block rounded-lg bg-slate-900/60 px-3 py-2 hover:bg-slate-800">
                  <span className="font-mono text-slate-500">{c.pos}.</span> <span className="font-semibold">{c.name}</span>
                  <div className="truncate text-xs text-slate-400">{bioFor(p.id, c.pos)?.summary ?? c.note ?? ""}</div>
                </Link>
              </li>
            ))}
          </ol>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3">
        {[a, b].map((p) => (
          <Link key={p.id} href={partyHref(p.id)} className="rounded-xl border border-slate-700 py-2.5 text-center font-semibold hover:bg-slate-800">
            לעמוד המלא של {p.name}
          </Link>
        ))}
      </div>
      <p className="mt-6 text-xs text-slate-500">עמדות מהמכון הישראלי לדמוקרטיה, סקרים מ־skarim.org. המיקום על המפה הוא הערכה שלנו.</p>
    </main>
  );
}

function Row({ label, children }: { label: React.ReactNode; children: React.ReactNode[] }) {
  return (
    <div className="border-b border-slate-800 py-3">
      <div className="mb-1.5 text-xs font-semibold text-sky-400">{label}</div>
      <div className="grid grid-cols-2 gap-3">{children}</div>
    </div>
  );
}

function Scale({ value, low, high, color }: { value: number; low: string; high: string; color: string }) {
  return (
    <div dir="ltr" className="flex items-center gap-2">
      <span className="w-10 text-left">{low}</span>
      <span className="relative h-1.5 flex-1 rounded-full bg-slate-800">
        <span className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ left: `${value * 100}%`, background: color }} />
      </span>
      <span className="w-10 text-right">{high}</span>
    </div>
  );
}
