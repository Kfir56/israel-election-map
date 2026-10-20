import Link from "next/link";
import BallotLetter from "@/components/BallotLetter";
import { ar } from "@/data/ar";
import minorLists from "@/data/minor-lists.json";
import { parties } from "@/data/parties";
import { averageSeats, polls } from "@/data/polls";
import { colorOnDark } from "@/lib/party-color";

export const metadata = { title: "الأحزاب · الخريطة السياسية 2026" };

export default function ArabicHome() {
  const ordered = [...parties].sort((a, b) => (averageSeats[b.id] ?? 0) - (averageSeats[a.id] ?? 0));
  const max = Math.max(...Object.values(averageSeats));
  return (
    <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <h1 className="text-3xl font-extrabold sm:text-4xl">انتخابات الكنيست الـ26</h1>
      <p className="mt-2 text-lg text-slate-300">
        الانتخابات يوم الثلاثاء، 27 تشرين الأول/أكتوبر 2026. هنا تجدون الأحزاب، وماذا تقول عن القضايا المركزية، ومن على
        قوائمها، وكم مقعدًا تحصل في الاستطلاعات.
      </p>

      <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-4 sm:p-5">
        <h2 className="text-xl font-bold">المقاعد في الاستطلاعات</h2>
        <p className="mt-1 text-sm text-slate-400">
          معدّل آخر {polls.length} استطلاعًا. يلزم 61 مقعدًا من 120 لتشكيل حكومة.
        </p>
        <ul className="mt-4 space-y-1.5">
          {ordered
            .filter((p) => averageSeats[p.id])
            .map((p) => (
              <li key={p.id}>
                <Link href={`/ar/party/${p.id}`} className="group flex items-center gap-3">
                  <span className="w-40 shrink-0 truncate text-sm group-hover:text-sky-300">{ar.parties[p.id].name}</span>
                  <span className="h-4 flex-1">
                    <span
                      className="block h-full rounded-e"
                      style={{ width: `${(averageSeats[p.id] / max) * 100}%`, background: colorOnDark(p.id) }}
                    />
                  </span>
                  <span className="w-6 text-sm font-bold tabular-nums">{averageSeats[p.id]}</span>
                </Link>
              </li>
            ))}
        </ul>
      </section>

      <h2 className="mt-10 text-2xl font-bold">الأحزاب</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {ordered.map((p) => {
          const t = ar.parties[p.id];
          return (
            <Link
              key={p.id}
              href={`/ar/party/${p.id}`}
              className="flex gap-3 rounded-xl border border-slate-800 bg-slate-900/40 p-4 transition hover:border-sky-500/60"
            >
              <BallotLetter letter={p.letter} size="sm" />
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-2 font-bold">
                  {t.name}
                  <span className="text-sm font-normal text-slate-500">
                    {p.withdrawn ? "انسحب من السباق" : `${averageSeats[p.id] ?? 0} مقاعد في المعدّل`}
                  </span>
                </div>
                <div className="text-sm text-slate-400">برئاسة {t.leader}</div>
                <p className="mt-1 line-clamp-2 text-sm text-slate-300">{t.summary}</p>
              </div>
            </Link>
          );
        })}
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">{minorLists.length} قائمة أخرى تتنافس</h2>
        <p className="mt-1 text-slate-400">
          هذه القوائم لا تتجاوز نسبة الحسم في أي استطلاع وجدناه. الصوت لقائمة لا تتجاوز 3.25% لا يُحتسب في توزيع المقاعد.
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {minorLists.map((l) => {
            const t = ar.minor[l.letter];
            return (
              <li key={l.letter} className="flex gap-3 rounded-xl border border-slate-800 bg-slate-900/40 p-3 text-sm">
                <BallotLetter letter={l.letter} size="sm" />
                <div className="min-w-0">
                  <div className="font-semibold">{t?.name ?? l.name}</div>
                  {t?.head && <div className="text-xs text-slate-500">برئاسة {t.head}</div>}
                  {t?.description && <p className="mt-1 text-slate-400">{t.description}</p>}
                  <a href={l.source} target="_blank" rel="noreferrer" className="text-xs text-sky-400 hover:underline">
                    المصدر
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="mt-10 grid gap-3 sm:grid-cols-2">
        <Link href="/ar/towns" className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 hover:border-sky-500/60">
          <div className="font-semibold text-sky-300">كيف صوّتت بلدتك في 2022؟ ←</div>
          <p className="mt-1 text-sm text-slate-400">ابحثوا عن بلدتكم وشاهدوا النتائج ونسبة التصويت.</p>
        </Link>
        <Link href="/ar/why-vote" className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 hover:border-sky-500/60">
          <div className="font-semibold text-sky-300">لماذا نصوّت أصلًا؟ ←</div>
          <p className="mt-1 text-sm text-slate-400">ماذا يحدث لصوتك وماذا يحدث للورقة البيضاء.</p>
        </Link>
      </div>
    </main>
  );
}
