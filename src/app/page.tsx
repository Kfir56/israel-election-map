import Explorer from "@/components/Explorer";

export default function Home() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <header className="mb-5">
        <h1 className="text-3xl font-extrabold sm:text-4xl">המפה הפוליטית 2026</h1>
        <p className="mt-1 text-slate-400">
          הבחירות לכנסת ה־26, 27 באוקטובר 2026. כל עמוד הוא מפלגה: גובה העמוד הוא מספר המנדטים בסקר, והמיקום
          מראה איפה היא עומדת בין ימין לשמאל ובין דתי לחילוני.
        </p>
      </header>
      <Explorer />
      <footer className="mt-12 border-t border-slate-800 pt-4 text-xs text-slate-500">
        טיוטה: הנתונים, העמדות והמיקום על המפה הם סיכום עריכתי ראשוני וטרם אומתו מול מצעי המפלגות וועדת הבחירות
        המרכזית.
      </footer>
    </main>
  );
}
