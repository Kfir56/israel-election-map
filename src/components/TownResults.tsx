"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Locale } from "@/data/intl";
import { parties } from "@/data/parties";

type List = { letter: string; he: string; ar: string; color: string; now: string[] };
type Row = (string | number)[]; // [code, he, en, ar, registered, cast, valid, ...votes, other]
type Data = { lists: List[]; national: number[]; towns: Row[] };

type Strings = Record<
  | "search"
  | "national"
  | "turnout"
  | "nationalTurnout"
  | "voters"
  | "valid"
  | "other"
  | "nowIs"
  | "gone"
  | "marker"
  | "loading"
  | "none",
  string
> & { partyHref: (id: string) => string; partyName: (id: string) => string; listName: (l: List) => string };

/** What a translated section passes in, so its whole content file stays on the server. */
export type TownStrings = {
  text: Record<string, unknown>;
  lists: Record<string, string>;
  partyNames: Record<string, string>;
};

const intl = (l: Locale, s: TownStrings): Strings => ({
  ...(s.text as Record<keyof Strings, string>),
  partyHref: (id) => `/${l}/party/${id}`,
  partyName: (id) => s.partyNames[id] ?? id,
  listName: (list) => s.lists[list.letter] ?? list.he,
});

const T: Record<"he", Strings> = {
  he: {
    search: "הקלידו שם של עיר, יישוב או קיבוץ",
    national: "כל הארץ",
    turnout: "הצבעה",
    nationalTurnout: "בכל הארץ",
    voters: "בעלי זכות בחירה",
    valid: "קולות כשרים",
    other: "רשימות אחרות",
    nowIs: "ב־2026:",
    gone: "לא רצה ב־2026",
    marker: "הקו הדק מסמן את התוצאה בכל הארץ.",
    loading: "טוען…",
    none: "לא מצאנו יישוב בשם הזה.",
    partyHref: (id: string) => `/party/${id}`,
    partyName: (id: string) => parties.find((p) => p.id === id)?.name ?? id,
    listName: (l: List) => l.he,
  },
};

// Search ignores punctuation, spaces and Arabic letter variants, since the
// official Hebrew names drop punctuation ("תל אביב יפו") and people type it differently.
const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[ً-ْ]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/[\s׳'"״()\-–.,]/g, "");

export default function TownResults({ locale, strings }: { locale: "he" | Locale; strings?: TownStrings }) {
  const t = locale === "he" || !strings ? T.he : intl(locale, strings);
  const [data, setData] = useState<Data | null>(null);
  const [q, setQ] = useState("");
  const [code, setCode] = useState<number | null>(null);

  useEffect(() => {
    fetch("/data/towns-2022.json")
      .then((r) => r.json())
      .then(setData);
  }, []);

  const index = useMemo(
    () => data?.towns.map((r) => ({ r, key: [r[1], r[2], r[3]].map((s) => norm(String(s))).join("|") })) ?? [],
    [data],
  );
  const query = norm(q);
  const hits = query.length < 2 ? [] : index.filter((x) => x.key.includes(query)).slice(0, 8);

  if (!data) return <p className="text-slate-400">{t.loading}</p>;

  const town = code === null ? null : data.towns.find((r) => r[0] === code)!;
  // Arabic has its own town names; English and Russian use the official Latin spelling.
  const name = (r: Row) => String((locale === "ar" ? r[3] : locale === "he" ? r[1] : r[2]) || r[1]);
  const [registered, cast, valid, ...votes] = (town ? town.slice(4) : data.national) as number[];
  const [nReg, nCast, nValid, ...nVotes] = data.national;
  const rows = [
    ...data.lists.map((l, i) => ({ l, v: votes[i], n: nVotes[i] })),
    { l: null, v: votes[data.lists.length], n: nVotes[data.lists.length] },
  ]
    .filter((x) => x.v / valid >= 0.005 || x.l === null)
    .sort((a, b) => (a.l === null ? 1 : b.l === null ? -1 : b.v - a.v));
  const max = Math.max(...rows.map((x) => Math.max(x.v / valid, town ? x.n / nValid : 0)));
  const pct = (x: number) => `${(x * 100).toFixed(1)}%`;

  return (
    <div>
      <div className="relative max-w-md">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t.search}
          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none"
        />
        {query.length >= 2 && (
          <ul className="absolute z-10 mt-1 w-full overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-xl">
            {hits.length === 0 && <li className="px-4 py-2 text-sm text-slate-500">{t.none}</li>}
            {hits.map(({ r }) => (
              <li key={String(r[0])}>
                <button
                  onClick={() => {
                    setCode(Number(r[0]));
                    setQ("");
                  }}
                  className="w-full px-4 py-2 text-start text-sm hover:bg-slate-800"
                >
                  {name(r)}
                  {locale !== "he" && name(r) !== r[1] && (
                    <span className="text-xs text-slate-500"> · {String(r[1])}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/40 p-4 sm:p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-2xl font-bold">{town ? name(town) : t.national}</h2>
          {town && (
            <button onClick={() => setCode(null)} className="text-sm text-sky-400 hover:underline">
              {t.national}
            </button>
          )}
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <Stat
            value={pct(cast / registered)}
            label={town ? `${t.turnout} (${pct(nCast / nReg)} ${t.nationalTurnout})` : t.turnout}
          />
          <Stat value={registered.toLocaleString("en-US")} label={t.voters} />
          <Stat value={valid.toLocaleString("en-US")} label={t.valid} />
        </div>

        <ul className="mt-5 space-y-2.5">
          {rows.map(({ l, v, n }) => (
            <li key={l?.letter ?? "other"}>
              <div className="flex items-baseline justify-between gap-2 text-sm">
                <span className="font-semibold">{l ? t.listName(l) : t.other}</span>
                <span className="tabular-nums text-slate-300">
                  {pct(v / valid)} <span className="text-xs text-slate-500">({v.toLocaleString("en-US")})</span>
                </span>
              </div>
              <div className="relative mt-1 h-2.5 rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${(v / valid / max) * 100}%`, background: l?.color ?? "#475569" }}
                />
                {town && (
                  <div
                    className="absolute -top-0.5 h-3.5 w-0.5 rounded bg-slate-200"
                    style={{ insetInlineStart: `${(n / nValid / max) * 100}%` }}
                    title={`${t.national}: ${pct(n / nValid)}`}
                  />
                )}
              </div>
              {l && (
                <div className="mt-0.5 text-xs text-slate-500">
                  {t.nowIs}{" "}
                  {l.now.length === 0
                    ? t.gone
                    : l.now.map((id, i) => (
                        <span key={id}>
                          {i > 0 && " / "}
                          <Link href={t.partyHref(id)} className="text-sky-400 hover:underline">
                            {t.partyName(id)}
                          </Link>
                        </span>
                      ))}
                </div>
              )}
            </li>
          ))}
        </ul>
        {town && <p className="mt-4 text-xs text-slate-500">{t.marker}</p>}
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl bg-slate-950/50 p-3">
      <div className="text-xl font-extrabold tabular-nums sm:text-2xl">{value}</div>
      <div className="text-xs text-slate-400">{label}</div>
    </div>
  );
}
