import Link from "next/link";
import CalendarButtons from "@/components/CalendarButtons";
import { type Locale, base, content, fill, forward } from "@/data/intl";

// Same 2022 figures as the Hebrew page.
const WIKI_2022 = "https://en.wikipedia.org/wiki/2022_Israeli_legislative_election";
const REGISTERED_2022 = 6_788_804;
const CAST_2022 = 4_794_593;
const INVALID_2022 = 29_851;
const VALID_2022 = 4_764_742;
const LOST_2022 = 417_400; // votes for lists that won no seat
const MERETZ_2022 = 150_793;

const fmt = (n: number) => n.toLocaleString("en-US");
const notVoted = REGISTERED_2022 - CAST_2022;
const perSeat = Math.round((VALID_2022 - LOST_2022) / 120);
const meretzShort = Math.ceil(VALID_2022 * 0.0325) - MERETZ_2022;

const values = {
  notVotedMillions: (notVoted / 1e6).toFixed(1),
  perSeatThousands: String(Math.round(perSeat / 1000)),
  meretzVotes: fmt(MERETZ_2022),
  meretzShort: fmt(meretzShort),
  lostVotes: fmt(LOST_2022),
  invalidVotes: fmt(INVALID_2022),
};

export const whyVoteMetadata = (locale: Locale) => ({
  title: content[locale].whyVote.metaTitle,
  description: content[locale].whyVote.metaDescription,
});

export default function IntlWhyVote({ locale }: { locale: Locale }) {
  const t = content[locale].whyVote;
  const ui = content[locale].ui;
  const f = (key: string) => fill(t[key], values);
  const numbers = [
    { value: `${((CAST_2022 / REGISTERED_2022) * 100).toFixed(1)}%`, label: t.statVotedLabel },
    { value: f("statNotVotedValue"), label: t.statNotVotedLabel },
    { value: f("statPerSeatValue"), label: t.statPerSeatLabel },
    { value: fmt(meretzShort), label: t.statMeretzLabel },
  ];
  const reasons = [
    { title: t.reason1Title, paragraphs: [f("reason1P1")] },
    { title: t.reason2Title, paragraphs: [f("reason2P1"), f("reason2P2")] },
    { title: t.reason3Title, paragraphs: [f("reason3P1")] },
  ];
  const [blankBefore, blankAfter] = f("blankP1").split(t.blankP1Bold);

  return (
    <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <h1 className="text-3xl font-extrabold sm:text-4xl">{t.title}</h1>
      <p className="mt-2 text-lg text-slate-300">{t.intro}</p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {numbers.map((n) => (
          <div key={n.label} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 text-center">
            <div className="text-2xl font-extrabold text-sky-300 sm:text-3xl">{n.value}</div>
            <div className="mt-1 text-sm text-slate-400">{n.label}</div>
          </div>
        ))}
      </div>

      <section className="mt-10 space-y-4">
        {reasons.map((r, i) => (
          <div key={r.title} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
            <h2 className="flex items-center gap-3 text-xl font-bold">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-500 text-sm text-slate-950">
                {i + 1}
              </span>
              {r.title}
            </h2>
            <div className="mt-2 space-y-2 leading-relaxed text-slate-300">
              {r.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="mt-10 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5">
        <h2 className="text-2xl font-bold">{t.blankTitle}</h2>
        <div className="mt-3 space-y-2 leading-relaxed text-slate-300">
          <p>
            {blankBefore}
            <b>{t.blankP1Bold}</b>
            {blankAfter}
          </p>
          <p>{t.blankP2}</p>
          <p>{t.blankP3}</p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">{t.startTitle}</h2>
        <Link
          href={base(locale)}
          className="mt-4 block rounded-xl border border-slate-800 bg-slate-900/40 p-4 transition hover:border-sky-500/60"
        >
          <div className="font-semibold text-sky-300">
            {t.cardTopicsTitle} {forward(locale)}
          </div>
          <p className="mt-1 text-sm text-slate-400">{t.cardTopicsText}</p>
        </Link>
        <p className="mt-3 text-sm text-slate-400">{t.thresholdNote}</p>
      </section>

      <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
        <h2 className="text-2xl font-bold">{t.dayTitle}</h2>
        <ul className="mt-3 list-disc space-y-1.5 ps-5 text-slate-300">
          <li>{t.dayBullet1}</li>
          <li>{t.dayBullet2}</li>
          <li>{t.dayBullet3}</li>
          <li>
            {t.dayBullet4Before}{" "}
            <a href="https://www.bechirot.gov.il/" target="_blank" rel="noreferrer" className="text-sky-400 underline">
              {t.dayBullet4Link}
            </a>
            {t.dayBullet4After}
          </li>
        </ul>
        <CalendarButtons labels={{ google: ui.calendarGoogle, other: ui.calendarOther }} />
      </section>

      <p className="mt-8 text-xs text-slate-500">
        {t.footnoteBefore}{" "}
        <a href={WIKI_2022} target="_blank" rel="noreferrer" className="underline">
          {t.footnoteLink}
        </a>
        {t.footnoteAfter}
      </p>
    </main>
  );
}
