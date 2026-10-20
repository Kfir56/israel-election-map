import TownResults from "@/components/TownResults";
import { ogImage } from "@/lib/site";

export const metadata = {
  openGraph: { images: [ogImage("איך הצביעו ביישוב שלי?", "תוצאות 2022 בכל עיר ויישוב")] },
  title: "איך הצביעו ביישוב שלי · המפה הפוליטית 2026",
  description: "תוצאות הבחירות לכנסת ה־25 (2022) בכל עיר ויישוב, ומה כל רשימה היא היום.",
};

const SOURCE = "https://votes25.bechirot.gov.il/cityresults?cityID=0";
const MIRROR = "https://github.com/DarthVictor/israel-election-results";

export default function TownsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <h1 className="text-3xl font-extrabold sm:text-4xl">איך הצביעו ביישוב שלי ב־2022?</h1>
      <p className="mt-2 text-lg text-slate-300">
        התוצאות הרשמיות של הבחירות הקודמות בכל עיר ויישוב, בהשוואה לכל הארץ. מתחת לכל רשימה כתוב מה היא היום, כי הרבה
        מהן התפצלו או התאחדו מאז.
      </p>
      <div className="mt-6">
        <TownResults locale="he" />
      </div>
      <p className="mt-6 text-xs leading-relaxed text-slate-500">
        המקור:{" "}
        <a href={SOURCE} target="_blank" rel="noreferrer" className="underline">
          התוצאות הסופיות של ועדת הבחירות המרכזית לפי יישוב
        </a>{" "}
        (הקובץ הרשמי, דרך{" "}
        <a href={MIRROR} target="_blank" rel="noreferrer" className="underline">
          עותק ב־GitHub
        </a>
        , שבדקנו מול סך הקולות הארצי). &quot;כל הארץ&quot; כולל גם את קולות המעטפות הכפולות, כמו חיילים, שלא משויכים
        ליישוב. רשימות שקיבלו פחות מחצי אחוז ביישוב נספרות ב&quot;רשימות אחרות&quot;.
      </p>
    </main>
  );
}
