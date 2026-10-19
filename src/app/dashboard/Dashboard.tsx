"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import RequireAuth from "@/components/auth/RequireAuth";
import { Avatar } from "@/components/NavBar";
import { MAJORITY, parties } from "@/data/parties";
import { partyHref } from "@/data/people";
import { averageSeats, polls } from "@/data/polls";
import { type Prediction, type Profile, supabase } from "@/lib/supabase";

const ordered = [...parties].sort((a, b) => (averageSeats[b.id] ?? 0) - (averageSeats[a.id] ?? 0));
const coalitionIds = parties.filter((p) => p.bloc === "coalition").map((p) => p.id);

export default function Dashboard() {
  return (
    <RequireAuth title="הלוח של החברים">
      <Board />
    </RequireAuth>
  );
}

type Person = Profile & { seats: Record<string, number> | null };

function Board() {
  const { user, profile } = useAuth();
  const me = user!.id;
  const [people, setPeople] = useState<Person[] | null>(null);

  useEffect(() => {
    (async () => {
      const { data: rows } = await supabase.from("follows").select("follower_id, followee_id");
      const following = new Set((rows ?? []).filter((r) => r.follower_id === me).map((r) => r.followee_id));
      const friendIds = (rows ?? []).filter((r) => r.followee_id === me && following.has(r.follower_id)).map((r) => r.follower_id);
      const ids = [me, ...friendIds];
      const [{ data: profiles }, { data: preds }] = await Promise.all([
        supabase.from("profiles").select("id, username, display_name, avatar_url").in("id", ids),
        // The database only returns your own rows and your friends' rows.
        supabase.from("predictions").select("user_id, party_id, seats").in("user_id", ids),
      ]);
      const byUser: Record<string, Record<string, number>> = {};
      for (const p of (preds ?? []) as Prediction[]) (byUser[p.user_id] ??= {})[p.party_id] = p.seats;
      const list = (profiles ?? []).map((p) => ({ ...p, seats: byUser[p.id] ?? null }));
      // Me first, then friends by name.
      list.sort((a, b) => (a.id === me ? -1 : b.id === me ? 1 : a.display_name.localeCompare(b.display_name, "he")));
      setPeople(list);
    })();
  }, [me]);

  if (!people) return <div className="py-24 text-center text-slate-500">טוען את הלוח…</div>;

  const friends = people.filter((p) => p.id !== me);
  const withPredictions = people.filter((p) => p.seats);
  const friendsAvg = (id: string) => {
    const vals = friends.filter((f) => f.seats).map((f) => f.seats![id] ?? 0);
    return vals.length ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10 : null;
  };
  const coalition = (s: Record<string, number>) => coalitionIds.reduce((sum, id) => sum + (s[id] ?? 0), 0);
  const biggest = (s: Record<string, number>) => ordered.reduce((best, p) => ((s[p.id] ?? 0) > (s[best.id] ?? 0) ? p : best), ordered[0]);
  const mine = people.find((p) => p.id === me);

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <h1 className="text-3xl font-extrabold">הלוח של החברים</h1>
      <p className="mt-1 text-slate-400">
        מה כל אחד מהחברים שלכם חושב שיקרה בבחירות. רק מי שעוקבים אחד אחרי השני רואים כאן אחד את השני, אף אחד אחר לא.
      </p>

      {friends.length === 0 && (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-700 p-8 text-center">
          <p className="text-slate-300">עוד אין לכם חברים כאן.</p>
          <Link href="/friends" className="mt-3 inline-block rounded-xl bg-sky-500 px-5 py-2 font-semibold text-slate-950">
            להוספת חברים
          </Link>
        </div>
      )}
      {!mine?.seats && (
        <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-amber-200">
          עוד לא שמרתם חיזוי.{" "}
          <Link href="/predict" className="font-semibold underline">
            למלא עכשיו
          </Link>
        </div>
      )}

      {withPredictions.length > 0 && (
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {withPredictions.map((p) => {
            const c = coalition(p.seats!);
            const top = biggest(p.seats!);
            return (
              <div key={p.id} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
                <div className="flex items-center gap-3">
                  <Avatar name={p.display_name} url={p.avatar_url} size={40} />
                  <div className="min-w-0">
                    <div className="truncate font-semibold">{p.id === me ? `${p.display_name} (אני)` : p.display_name}</div>
                    <div className="text-xs text-slate-400">
                      הגדולה: <span style={{ color: top.color }}>{top.name}</span> ({p.seats![top.id]})
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-sm">
                  הקואליציה היוצאת:{" "}
                  <b className={c >= MAJORITY ? "text-emerald-300" : "text-rose-300"}>
                    {c} {c >= MAJORITY ? "· ממשיכה" : "· אין רוב"}
                  </b>
                </div>
                <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-slate-800">
                  {ordered.map((party) => (
                    <div key={party.id} style={{ width: `${((p.seats![party.id] ?? 0) / 120) * 100}%`, background: party.color }} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-800">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-900 text-xs text-slate-400">
              <th className="sticky right-0 bg-slate-900 px-3 py-2 text-right">רשימה</th>
              <th className="px-3 py-2">ממוצע {polls.length} הסקרים</th>
              {people.map((p) => (
                <th key={p.id} className="px-3 py-2 font-semibold text-slate-200">
                  {p.id === me ? "אני" : p.display_name}
                </th>
              ))}
              {friends.length > 1 && <th className="px-3 py-2">ממוצע החברים</th>}
            </tr>
          </thead>
          <tbody className="font-mono">
            {ordered.map((party) => (
              <tr key={party.id} className="border-t border-slate-800">
                <td className="sticky right-0 whitespace-nowrap bg-slate-950 px-3 py-2 font-sans">
                  <span className="ml-2 inline-block h-2.5 w-2.5 rounded-full" style={{ background: party.color }} />
                  <Link href={partyHref(party.id)} className="hover:text-sky-300">
                    {party.name}
                  </Link>
                </td>
                <td className="px-3 py-2 text-center text-slate-400">{averageSeats[party.id] || "—"}</td>
                {people.map((p) => {
                  const v = p.seats?.[party.id];
                  const avg = averageSeats[party.id] ?? 0;
                  const diff = v === undefined ? 0 : v - avg;
                  return (
                    <td key={p.id} className={`px-3 py-2 text-center ${p.id === me ? "bg-sky-400/5 font-bold" : ""}`}>
                      {p.seats ? (
                        <>
                          {v || "—"}
                          {Math.abs(diff) >= 3 && (
                            <span className={`mr-1 text-[10px] ${diff > 0 ? "text-emerald-400" : "text-rose-400"}`}>{diff > 0 ? "▲" : "▼"}</span>
                          )}
                        </>
                      ) : (
                        <span className="font-sans text-xs text-slate-600">לא מילא</span>
                      )}
                    </td>
                  );
                })}
                {friends.length > 1 && <td className="px-3 py-2 text-center text-slate-300">{friendsAvg(party.id) ?? "—"}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-slate-500">
        ▲▼ מסמנים חיזוי שרחוק ב־3 מנדטים או יותר מממוצע הסקרים. אחרי הבחירות נוסיף כאן ניקוד לפי התוצאות הרשמיות.
      </p>
      {profile && friends.length > 0 && (
        <p className="mt-4 text-sm text-slate-400">
          רוצים עוד חברים בלוח?{" "}
          <Link href="/friends" className="text-sky-400 underline">
            שלחו להם את הקישור שלכם
          </Link>
          .
        </p>
      )}
    </main>
  );
}
