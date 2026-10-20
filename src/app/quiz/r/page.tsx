import type { Metadata } from "next";
import Link from "next/link";
import { parties } from "@/data/parties";

// The page a shared quiz result links to: the preview image carries the
// result, and the page itself invites the reader to take the quiz.
type Search = Promise<{ p?: string; m?: string }>;

export async function generateMetadata({ searchParams }: { searchParams: Search }): Promise<Metadata> {
  const { p, m } = await searchParams;
  const party = parties.find((x) => x.id === p);
  const match = Math.min(100, Math.max(0, Number(m) || 0));
  if (!party) return { title: "איזו מפלגה הכי קרובה אליי? · המפה הפוליטית 2026" };
  const title = `יצא לי: ${party.name}${match ? ` (${match}% התאמה)` : ""}`;
  return {
    title: `${title} · המפה הפוליטית 2026`,
    description: "10 משפטים, ותראו איזו מפלגה הכי קרובה לעמדות שלכם.",
    openGraph: { title, images: [`/og?quiz=${party.id}${match ? `&m=${match}` : ""}`] },
  };
}

export default async function SharedResult({ searchParams }: { searchParams: Search }) {
  const { p, m } = await searchParams;
  const party = parties.find((x) => x.id === p);
  const match = Math.min(100, Math.max(0, Number(m) || 0));
  return (
    <main className="mx-auto max-w-xl px-4 py-12 text-center sm:px-6">
      {party && (
        <>
          <p className="text-slate-400">לחבר או לחברה שלכם יצא שהמפלגה הכי קרובה היא</p>
          <h1 className="mt-2 text-5xl font-extrabold" style={{ color: party.color }}>
            {party.name}
          </h1>
          {match > 0 && <p className="mt-2 text-lg text-slate-300">{match}% התאמה</p>}
        </>
      )}
      <Link
        href="/quiz"
        className="mt-8 inline-block rounded-xl bg-sky-500 px-6 py-3 text-lg font-bold text-slate-950 hover:bg-sky-400"
      >
        ומה יוצא לכם? לשאלון ←
      </Link>
      <p className="mt-4 text-sm text-slate-500">10 משפטים, בערך שתי דקות. שום דבר לא נשמר.</p>
    </main>
  );
}
