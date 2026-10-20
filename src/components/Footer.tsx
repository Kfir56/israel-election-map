import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-800 bg-slate-950">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 text-sm text-slate-400 sm:grid-cols-[1fr_auto] sm:px-6">
        <div className="max-w-2xl space-y-2 text-xs leading-relaxed text-slate-500">
          <p>
            <b className="text-slate-300">מקורות:</b> רשימות המועמדים ותיאורי המפלגות מ
            <a className="underline" href="https://www.idi.org.il/policy/parties-and-elections/elections/2026-1/">
              המכון הישראלי לדמוקרטיה
            </a>
            ; הסקרים מ
            <a className="underline" href="https://www.skarim.org/polls">
              ארכיון הסקרים skarim.org
            </a>
            , עם קישור לכל סקר; ביוגרפיות ותולדות המפלגות מוויקיפדיה, בתמצות שלנו; גובה השטח מ־AWS Terrain Tiles.
          </p>
          <p>המיקום של המפלגות על המפה הוא הערכה שלנו ולא נתון רשמי. האתר לא קשור לאף מפלגה. עודכן ב־19 באוקטובר 2026.</p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 sm:flex-col sm:gap-1.5">
          <Link href="/" className="hover:text-white">
            המפה
          </Link>
          <Link href="/parties" className="hover:text-white">
            המפלגות
          </Link>
          <Link href="/#polls" className="hover:text-white">
            הסקרים
          </Link>
          <Link href="/towns" className="hover:text-white">
            איך הצביעו ביישוב שלי
          </Link>
          <Link href="/ar" lang="ar" className="hover:text-white">
            العربية
          </Link>
          <Link href="/coalitions" className="hover:text-white">
            קואליציות אפשריות
          </Link>
          <Link href="/topics" className="hover:text-white">
            הנושאים
          </Link>
          <Link href="/quiz" className="hover:text-white">
            איזו מפלגה קרובה אליי
          </Link>
          <Link href="/compare" className="hover:text-white">
            השוואה בין מפלגות
          </Link>
          <Link href="/guide" className="hover:text-white">
            איך עובדות הבחירות
          </Link>
          <Link href="/why-vote" className="hover:text-white">
            למה להצביע
          </Link>
          <Link href="/predict" className="hover:text-white">
            החיזוי שלי
          </Link>
        </nav>
      </div>
    </footer>
  );
}
