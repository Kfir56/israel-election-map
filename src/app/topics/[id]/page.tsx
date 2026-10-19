import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, parties } from "@/data/parties";
import { partyHref } from "@/data/people";
import { averageSeats } from "@/data/polls";
import { topicById, topicHref, topics } from "@/data/topics";

type Params = Promise<{ id: string }>;

export function generateStaticParams() {
  return topics.map((t) => ({ id: t.id }));
}

const label = (id: string) => categories.find((c) => c.id === id)?.label ?? id;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  return { title: `${label(id)} · המפה הפוליטית 2026` };
}

export default async function TopicPage({ params }: { params: Params }) {
  const { id } = await params;
  const topic = topicById[id as keyof typeof topicById];
  if (!topic) notFound();

  const withPosition = parties.filter((p) => p.positions[topic.id]);
  const without = parties.filter((p) => !p.positions[topic.id]);
  const axis = topic.axis;
  // Along the axis when the topic has one, otherwise by poll size.
  const ordered = axis
    ? [...withPosition].sort((a, b) => a.spectrum[axis.key] - b.spectrum[axis.key])
    : [...withPosition].sort((a, b) => (averageSeats[b.id] ?? 0) - (averageSeats[a.id] ?? 0));

  return (
    <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <nav className="flex flex-wrap gap-2">
        {topics.map((t) => (
          <Link
            key={t.id}
            href={topicHref(t.id)}
            className={`rounded-full border px-3 py-1 text-sm ${
              t.id === topic.id ? "border-sky-400 bg-sky-400/10 text-sky-300" : "border-slate-700 text-slate-400 hover:text-white"
            }`}
          >
            {label(t.id)}
          </Link>
        ))}
      </nav>

      <h1 className="mt-6 text-3xl font-extrabold sm:text-4xl">{label(topic.id)}</h1>
      <p className="mt-2 text-xl text-slate-200">{topic.question}</p>

      <section className="mt-8">
        <h2 className="text-2xl font-bold">הרקע</h2>
        <div className="mt-3 space-y-3 leading-relaxed text-slate-300">
          {topic.background.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">הגישות העיקריות</h2>
        <p className="mt-1 text-sm text-slate-400">בפשטות, אלה שלוש הדרכים שבהן מפלגות עונות על השאלה. רוב המפלגות נמצאות איפשהו ביניהן.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {topic.camps.map((c) => (
            <div key={c.title} className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
              <div className="font-semibold text-sky-300">{c.title}</div>
              <p className="mt-1.5 text-sm text-slate-300">{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      {axis && (
        <section className="mt-10">
          <h2 className="text-2xl font-bold">איפה המפלגות עומדות</h2>
          <div dir="ltr" className="mt-4 flex justify-between pr-[8rem] text-sm font-semibold text-slate-400 sm:pr-[10.5rem]">
            <span>{axis.low}</span>
            <span>{axis.high}</span>
          </div>
          <ul className="mt-1 space-y-1.5">
            {[...parties]
              .sort((a, b) => a.spectrum[axis.key] - b.spectrum[axis.key])
              .map((p) => (
                <li key={p.id}>
                  <Link href={partyHref(p.id)} className="group grid grid-cols-[7.5rem_1fr] items-center gap-2 sm:grid-cols-[10rem_1fr]">
                    <span className="truncate text-sm group-hover:text-sky-300">{p.name}</span>
                    {/* LTR so the low end of the scale is on the left, like the map. */}
                    <span dir="ltr" className="relative h-2 rounded-full bg-slate-800">
                      <span
                        className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-slate-950"
                        style={{ left: `${(axis.key === "right" ? p.spectrum.right : p.spectrum.religious) * 100}%`, background: p.color }}
                      />
                    </span>
                  </Link>
                </li>
              ))}
          </ul>
          <p className="mt-2 text-xs text-slate-500">
            המיקום הוא הערכה גסה שלנו (אותה הערכה שעל המפה), לא נתון רשמי. לחצו על מפלגה כדי לפתוח את העמוד שלה.
          </p>
        </section>
      )}

      <section className="mt-10">
        <h2 className="text-2xl font-bold">מה כל מפלגה אומרת</h2>
        {axis && <p className="mt-1 text-sm text-slate-400">מסודר מ{axis.low} ל{axis.high}, לפי ההערכה שלנו.</p>}
        <ul className="mt-4 space-y-2">
          {ordered.map((p) => (
            <li key={p.id} className="rounded-xl border-r-4 bg-slate-900/50 p-4" style={{ borderColor: p.color }}>
              <Link href={partyHref(p.id)} className="font-semibold hover:text-sky-300">
                {p.name}
              </Link>
              <p className="mt-1 text-slate-300">{p.positions[topic.id]}</p>
            </li>
          ))}
        </ul>
        {without.length > 0 && (
          <p className="mt-3 text-sm text-slate-500">אין לנו סיכום עמדה בנושא הזה מ: {without.map((p) => p.name).join(", ")}.</p>
        )}
        <p className="mt-2 text-xs text-slate-500">העמדות מדפי המפלגות באתר המכון הישראלי לדמוקרטיה, בתמצות שלנו. הרקע והגישות נכתבו על ידינו.</p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">מושגים</h2>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          {topic.terms.map((t) => (
            <div key={t.term} className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
              <dt className="font-semibold">{t.term}</dt>
              <dd className="mt-1 text-sm text-slate-300">{t.text}</dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  );
}
