"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import RequireAuth from "@/components/auth/RequireAuth";
import { type Bloc, KNESSET_SEATS, MAJORITY, parties } from "@/data/parties";
import { partyHref } from "@/data/people";
import { averageSeats } from "@/data/polls";
import { PREDICTIONS_LOCK, supabase } from "@/lib/supabase";

// Passing the 3.25% threshold is worth about 4 seats, so 1–3 can't happen.
const MIN_SEATS = 4;
const ordered = [...parties].sort((a, b) => (averageSeats[b.id] ?? 0) - (averageSeats[a.id] ?? 0));
const blocs: Bloc[] = ["coalition", "opposition", "arab"];
const shortBloc: Record<Bloc, string> = { coalition: "הקואליציה היוצאת", opposition: "האופוזיציה", arab: "המפלגות הערביות" };

export default function Predictor() {
  return (
    <RequireAuth title="החיזוי שלי">
      <Form />
    </RequireAuth>
  );
}

function Form() {
  const { user } = useAuth();
  const [seats, setSeats] = useState<Record<string, number>>({});
  const [saved, setSaved] = useState<Record<string, number> | null>(null);
  const [status, setStatus] = useState<"loading" | "idle" | "saving" | "saved" | "error">("loading");
  const [error, setError] = useState("");
  const [locked] = useState(() => Date.now() >= PREDICTIONS_LOCK.getTime());

  useEffect(() => {
    if (!user) return;
    supabase
      .from("predictions")
      .select("party_id, seats")
      .eq("user_id", user.id)
      .then(({ data }) => {
        const s = Object.fromEntries((data ?? []).map((r) => [r.party_id, r.seats]));
        setSeats(s);
        setSaved(data?.length ? s : null);
        setStatus("idle");
      });
  }, [user]);

  const total = ordered.reduce((sum, p) => sum + (seats[p.id] ?? 0), 0);
  const left = KNESSET_SEATS - total;
  const dirty = useMemo(
    () => ordered.some((p) => (seats[p.id] ?? 0) !== (saved?.[p.id] ?? 0)),
    [seats, saved],
  );
  const blocTotal = (b: Bloc) => parties.filter((p) => p.bloc === b).reduce((s, p) => s + (seats[p.id] ?? 0), 0);
  const tooSmall = ordered.filter((p) => (seats[p.id] ?? 0) > 0 && (seats[p.id] ?? 0) < MIN_SEATS);

  const set = (id: string, v: number) => {
    const clean = Math.max(0, Math.min(KNESSET_SEATS, Math.round(v) || 0));
    setSeats((s) => ({ ...s, [id]: clean }));
    setStatus("idle");
  };
  // Stepping up from 0 jumps straight to the threshold, and down from it to 0.
  const step = (id: string, dir: 1 | -1) => {
    const v = seats[id] ?? 0;
    if (dir === 1) set(id, v === 0 ? MIN_SEATS : v + 1);
    else set(id, v <= MIN_SEATS ? 0 : v - 1);
  };

  const save = async () => {
    if (!user) return;
    setStatus("saving");
    setError("");
    const rows = ordered.map((p) => ({ user_id: user.id, party_id: p.id, seats: seats[p.id] ?? 0, updated_at: new Date().toISOString() }));
    const { error } = await supabase.from("predictions").upsert(rows);
    if (error) {
      setStatus("error");
      setError(/120/.test(error.message) ? "הסכום עובר את 120 המנדטים." : "השמירה לא הצליחה. נסו שוב.");
    } else {
      setSaved({ ...seats });
      setStatus("saved");
    }
  };

  if (status === "loading") return <div className="py-24 text-center text-slate-500">טוען את החיזוי שלכם…</div>;

  return (
    <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <h1 className="text-3xl font-extrabold">החיזוי שלי</h1>
      <p className="mt-1 text-slate-400">
        כמה מנדטים כל רשימה תקבל? החיזוי נשמר בחשבון שלכם, ורק חברים (שעוקבים אחד אחרי השני) יכולים לראות אותו. אפשר לשנות עד
        פתיחת הקלפיות, 27 באוקטובר ב־07:00. משחק בנקודות בלבד, בלי כסף.
      </p>

      {/* Running total, stuck under the navbar while scrolling the list. */}
      <div className="sticky top-14 z-10 -mx-4 mt-5 border-b border-slate-800 bg-slate-950/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border sm:px-5">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <div>
            <div className="text-xs text-slate-400">חילקתם</div>
            <div className={`text-2xl font-extrabold ${total > KNESSET_SEATS ? "text-rose-400" : total === KNESSET_SEATS ? "text-emerald-400" : ""}`}>
              <span dir="ltr">
                {total} / {KNESSET_SEATS}
              </span>
            </div>
          </div>
          <div className="text-sm text-slate-300">
            {left > 0 ? `נשארו ${left} מנדטים` : left === 0 ? "כל 120 המנדטים חולקו ✓" : `${-left} מנדטים יותר מדי`}
          </div>
          <div className="flex w-full flex-wrap gap-x-3 gap-y-1 text-xs text-slate-400 sm:w-auto sm:flex-1">
            {blocs.map((b) => (
              <span key={b} className="whitespace-nowrap">
                {shortBloc[b]}: <b className={b === "coalition" && blocTotal(b) >= MAJORITY ? "text-emerald-300" : "text-slate-200"}>{blocTotal(b)}</b>
              </span>
            ))}
          </div>
        </div>
        <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-slate-800">
          {ordered.map((p) => (
            <div key={p.id} style={{ width: `${((seats[p.id] ?? 0) / KNESSET_SEATS) * 100}%`, background: p.color }} />
          ))}
        </div>
      </div>

      {locked && (
        <p className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-amber-200">הקלפיות נפתחו, אז החיזויים נעולים.</p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          disabled={locked}
          onClick={() => setSeats({ ...averageSeats })}
          className="rounded-xl border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800 disabled:opacity-50"
        >
          להתחיל מממוצע הסקרים
        </button>
        <button
          disabled={locked}
          onClick={() => setSeats({})}
          className="rounded-xl border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800 disabled:opacity-50"
        >
          איפוס
        </button>
      </div>

      <ul className="mt-4 space-y-2">
        {ordered.map((p) => {
          const v = seats[p.id] ?? 0;
          return (
            <li key={p.id} className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/40 p-3">
              <span className="h-8 w-1.5 shrink-0 rounded-full" style={{ background: p.color }} />
              <div className="min-w-0 flex-1">
                <Link href={partyHref(p.id)} className="font-semibold hover:text-sky-300">
                  {p.name}
                </Link>
                <div className="text-xs text-slate-500">
                  {p.leader} · ממוצע הסקרים: {averageSeats[p.id] || "מתחת לחסימה"}
                </div>
              </div>
              <div dir="ltr" className="flex items-center gap-1">
                <StepButton disabled={locked || v === 0} onClick={() => step(p.id, -1)}>
                  −
                </StepButton>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={KNESSET_SEATS}
                  disabled={locked}
                  value={v}
                  onChange={(e) => set(p.id, Number(e.target.value))}
                  aria-label={`מנדטים ל${p.name}`}
                  className={`w-14 rounded-lg border bg-slate-800 py-1.5 text-center font-mono text-lg font-bold outline-none focus:border-sky-500 ${
                    v > 0 && v < MIN_SEATS ? "border-amber-500" : "border-slate-700"
                  }`}
                />
                <StepButton disabled={locked} onClick={() => step(p.id, 1)}>
                  +
                </StepButton>
              </div>
            </li>
          );
        })}
      </ul>

      {tooSmall.length > 0 && (
        <p className="mt-3 text-sm text-amber-300">
          שימו לב: {tooSmall.map((p) => p.name).join(", ")} מקבלות פחות מ־{MIN_SEATS} מנדטים. רשימה שעוברת את אחוז החסימה מקבלת
          לפחות 4, אז זה לא יכול לקרות.
        </p>
      )}

      <div className="sticky bottom-0 -mx-4 mt-6 flex items-center gap-3 border-t border-slate-800 bg-slate-950/95 px-4 py-3 backdrop-blur sm:mx-0">
        <button
          onClick={save}
          disabled={locked || status === "saving" || total > KNESSET_SEATS || !dirty}
          className="rounded-xl bg-sky-500 px-6 py-2.5 font-semibold text-slate-950 hover:bg-sky-400 disabled:opacity-50"
        >
          {status === "saving" ? "שומר…" : "שמירת החיזוי"}
        </button>
        <span className="text-sm text-slate-400">
          {status === "saved" && !dirty && "נשמר ✓ החברים שלכם יכולים לראות אותו."}
          {status === "error" && <span className="text-rose-300">{error}</span>}
          {dirty && status !== "error" && total > KNESSET_SEATS && "אי אפשר לשמור יותר מ־120 מנדטים."}
          {dirty && status !== "error" && total <= KNESSET_SEATS && "יש שינויים שלא נשמרו."}
        </span>
        <Link href="/dashboard" className="ms-auto text-sm text-sky-400 hover:underline">
          ללוח של החברים ←
        </Link>
      </div>
    </main>
  );
}

function StepButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} className="h-9 w-9 rounded-lg bg-slate-800 text-lg font-bold hover:bg-slate-700 disabled:opacity-40">
      {children}
    </button>
  );
}
