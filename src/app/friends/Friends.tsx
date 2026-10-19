"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import RequireAuth from "@/components/auth/RequireAuth";
import { Avatar } from "@/components/NavBar";
import { type Profile, supabase } from "@/lib/supabase";

const card = "rounded-2xl border border-slate-800 bg-slate-900/50 p-5";
const btn = "rounded-lg px-3 py-1.5 text-sm font-semibold disabled:opacity-50";

export default function Friends() {
  return (
    <RequireAuth title="חברים">
      <FriendsInner />
    </RequireAuth>
  );
}

type Graph = { following: Set<string>; followers: Set<string>; people: Record<string, Profile> };

async function fetchGraph(me: string): Promise<Graph> {
  const { data: rows } = await supabase.from("follows").select("follower_id, followee_id");
  const following = new Set((rows ?? []).filter((r) => r.follower_id === me).map((r) => r.followee_id));
  const followers = new Set((rows ?? []).filter((r) => r.followee_id === me).map((r) => r.follower_id));
  const ids = [...new Set([...following, ...followers])];
  const { data: profiles } = ids.length
    ? await supabase.from("profiles").select("id, username, display_name, avatar_url").in("id", ids)
    : { data: [] as Profile[] };
  return { following, followers, people: Object.fromEntries((profiles ?? []).map((p) => [p.id, p])) };
}

function FriendsInner() {
  const { user, profile } = useAuth();
  const me = user!.id;
  const params = useSearchParams();
  const [graph, setGraph] = useState<Graph>({ following: new Set(), followers: new Set(), people: {} });
  const [query, setQuery] = useState(params.get("add") ?? "");
  const [results, setResults] = useState<Profile[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(() => fetchGraph(me).then(setGraph), [me]);

  useEffect(() => {
    fetchGraph(me).then(setGraph);
  }, [me]);

  useEffect(() => {
    const q = query.trim().replace(/^@/, "");
    if (q.length < 2) return;
    const t = setTimeout(async () => {
      // Strip characters that mean something in a PostgREST filter.
      const safe = q.replace(/[%,()*\\]/g, "");
      const { data } = await supabase
        .from("profiles")
        .select("id, username, display_name, avatar_url")
        .or(`username.ilike.%${safe}%,display_name.ilike.%${safe}%`)
        .neq("id", me)
        .limit(8);
      setResults(data ?? []);
    }, 250);
    return () => clearTimeout(t);
  }, [query, me]);

  const follow = async (id: string) => {
    setBusy(id);
    await supabase.from("follows").insert({ follower_id: me, followee_id: id });
    await load();
    setBusy(null);
  };
  const unfollow = async (id: string) => {
    setBusy(id);
    await supabase.from("follows").delete().match({ follower_id: me, followee_id: id });
    await load();
    setBusy(null);
  };
  const removeFollower = async (id: string) => {
    setBusy(id);
    await supabase.from("follows").delete().match({ follower_id: id, followee_id: me });
    await load();
    setBusy(null);
  };

  const ids = Object.keys(graph.people);
  const friends = ids.filter((id) => graph.following.has(id) && graph.followers.has(id));
  const requests = ids.filter((id) => graph.followers.has(id) && !graph.following.has(id));
  const pending = ids.filter((id) => graph.following.has(id) && !graph.followers.has(id));

  const action = (id: string) => {
    const f = graph.following.has(id);
    const back = graph.followers.has(id);
    if (f && back)
      return (
        <button disabled={busy === id} onClick={() => unfollow(id)} className={`${btn} bg-slate-800 text-slate-300 hover:bg-slate-700`}>
          הסרה מהחברים
        </button>
      );
    if (f)
      return (
        <button disabled={busy === id} onClick={() => unfollow(id)} className={`${btn} bg-slate-800 text-slate-300 hover:bg-slate-700`}>
          ביטול בקשה
        </button>
      );
    return (
      <button disabled={busy === id} onClick={() => follow(id)} className={`${btn} bg-sky-500 text-slate-950 hover:bg-sky-400`}>
        {back ? "אישור חברות" : "מעקב"}
      </button>
    );
  };

  return (
    <main className="mx-auto max-w-3xl space-y-5 px-4 py-6 sm:px-6">
      <div>
        <h1 className="text-3xl font-extrabold">חברים</h1>
        <p className="mt-1 text-slate-400">
          עוקבים אחרי מישהו, וכשהוא עוקב בחזרה אתם חברים. רק חברים רואים את החיזויים אחד של השני, בלוח המשותף.
        </p>
      </div>

      {profile && <ProfileCard profile={profile} />}

      <section className={card}>
        <h2 className="text-lg font-bold">חיפוש חברים</h2>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="שם או שם משתמש"
          className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 outline-none focus:border-sky-500"
        />
        {query.trim().replace(/^@/, "").length >= 2 && (
          <ul className="mt-3 space-y-2">
            {results.length === 0 && <li className="text-sm text-slate-500">לא מצאנו אף אחד בשם הזה.</li>}
            {results.map((p) => (
              <PersonRow key={p.id} p={p}>
                {action(p.id)}
              </PersonRow>
            ))}
          </ul>
        )}
      </section>

      {requests.length > 0 && (
        <section className={card}>
          <h2 className="text-lg font-bold">רוצים להיות חברים שלכם ({requests.length})</h2>
          <ul className="mt-3 space-y-2">
            {requests.map((id) => (
              <PersonRow key={id} p={graph.people[id]}>
                {action(id)}
                <button disabled={busy === id} onClick={() => removeFollower(id)} className={`${btn} text-slate-400 hover:bg-slate-800`}>
                  דחייה
                </button>
              </PersonRow>
            ))}
          </ul>
        </section>
      )}

      <section className={card}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">החברים שלי ({friends.length})</h2>
          {friends.length > 0 && (
            <Link href="/dashboard" className="text-sm text-sky-400 hover:underline">
              ללוח המשותף ←
            </Link>
          )}
        </div>
        <ul className="mt-3 space-y-2">
          {friends.length === 0 && <li className="text-sm text-slate-500">עוד אין חברים. חפשו מישהו למעלה או שלחו לו את הקישור שלכם.</li>}
          {friends.map((id) => (
            <PersonRow key={id} p={graph.people[id]}>
              {action(id)}
            </PersonRow>
          ))}
        </ul>
      </section>

      {pending.length > 0 && (
        <section className={card}>
          <h2 className="text-lg font-bold">מחכים שיעקבו בחזרה ({pending.length})</h2>
          <ul className="mt-3 space-y-2">
            {pending.map((id) => (
              <PersonRow key={id} p={graph.people[id]}>
                {action(id)}
              </PersonRow>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}

function PersonRow({ p, children }: { p: Profile; children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-3 rounded-xl bg-slate-800/40 px-3 py-2">
      <Avatar name={p.display_name} url={p.avatar_url} size={36} />
      <div className="min-w-0 flex-1">
        <div className="truncate font-semibold">{p.display_name}</div>
        <div dir="ltr" className="truncate text-right text-xs text-slate-400">
          @{p.username}
        </div>
      </div>
      <div className="flex shrink-0 gap-1">{children}</div>
    </li>
  );
}

function ProfileCard({ profile }: { profile: Profile }) {
  const { refreshProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(profile.display_name);
  const [username, setUsername] = useState(profile.username);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const invite = typeof window === "undefined" ? "" : `${window.location.origin}/friends?add=${profile.username}`;

  const save = async () => {
    setError("");
    const { error } = await supabase.from("profiles").update({ display_name: name.trim(), username }).eq("id", profile.id);
    if (error) return setError(/duplicate|unique/i.test(error.message) ? "שם המשתמש הזה כבר תפוס." : "שם המשתמש: 3–20 אותיות באנגלית, ספרות או _.");
    await refreshProfile();
    setEditing(false);
  };

  return (
    <section className={card}>
      <div className="flex items-center gap-4">
        <Avatar name={profile.display_name} url={profile.avatar_url} size={52} />
        {editing ? (
          <div className="flex-1 space-y-2">
            <input value={name} onChange={(e) => setName(e.target.value)} maxLength={40} className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5" />
            <input
              dir="ltr"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
              maxLength={20}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5"
            />
            {error && <p className="text-sm text-rose-300">{error}</p>}
            <div className="flex gap-2">
              <button onClick={save} className={`${btn} bg-sky-500 text-slate-950`}>
                שמירה
              </button>
              <button onClick={() => setEditing(false)} className={`${btn} text-slate-400`}>
                ביטול
              </button>
            </div>
          </div>
        ) : (
          <div className="min-w-0 flex-1">
            <div className="text-xl font-bold">{profile.display_name}</div>
            <div dir="ltr" className="text-right text-sm text-slate-400">
              @{profile.username}
            </div>
          </div>
        )}
        {!editing && (
          <button onClick={() => setEditing(true)} className={`${btn} text-slate-300 hover:bg-slate-800`}>
            עריכה
          </button>
        )}
      </div>
      <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-800/60 p-2 pr-3 text-sm">
        <span className="shrink-0 text-slate-400">הקישור שלכם לחברים:</span>
        <span dir="ltr" className="min-w-0 flex-1 truncate text-left text-slate-300">
          {invite}
        </span>
        <button
          onClick={async () => {
            await navigator.clipboard.writeText(invite);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className={`${btn} shrink-0 bg-slate-700 hover:bg-slate-600`}
        >
          {copied ? "הועתק ✓" : "העתקה"}
        </button>
      </div>
    </section>
  );
}
