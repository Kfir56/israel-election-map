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
        מקורות: רשימות המועמדים ותיאורי המפלגות מאתר{" "}
        <a className="underline" href="https://www.idi.org.il/policy/parties-and-elections/elections/2026-1/">
          המכון הישראלי לדמוקרטיה
        </a>
        ; הסקרים מ
        <a className="underline" href="https://www.skarim.org/polls">
          ארכיון הסקרים skarim.org
        </a>{" "}
        עם קישור לכל סקר; גובה השטח מ־AWS Terrain Tiles. המיקום של המפלגות על המפה (ימין/שמאל, דתי/חילוני) הוא הערכה
        שלנו ולא נתון רשמי. עודכן ב־19 באוקטובר 2026.
      </footer>
    </main>
  );
}
