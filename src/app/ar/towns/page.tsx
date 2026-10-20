import TownResults from "@/components/TownResults";

export const metadata = {
  title: "كيف صوّتت بلدتي · الخريطة السياسية 2026",
  description: "نتائج انتخابات الكنيست الـ25 (2022) في كل مدينة وبلدة، وماذا أصبحت كل قائمة اليوم.",
};

const SOURCE = "https://votes25.bechirot.gov.il/cityresults?cityID=0";
const MIRROR = "https://github.com/DarthVictor/israel-election-results";

export default function ArabicTownsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <h1 className="text-3xl font-extrabold sm:text-4xl">كيف صوّتت بلدتي في 2022؟</h1>
      <p className="mt-2 text-lg text-slate-300">
        النتائج الرسمية للانتخابات السابقة في كل مدينة وبلدة، مقارنةً بكل البلاد. تحت كل قائمة مكتوب ماذا أصبحت اليوم، لأن
        كثيرًا منها انقسم أو اتّحد منذ ذلك الحين.
      </p>
      <div className="mt-6">
        <TownResults locale="ar" />
      </div>
      <p className="mt-6 text-xs leading-relaxed text-slate-500">
        المصدر:{" "}
        <a href={SOURCE} target="_blank" rel="noreferrer" className="underline">
          النتائج النهائية للجنة الانتخابات المركزية حسب البلدة
        </a>{" "}
        (الملف الرسمي، عبر{" "}
        <a href={MIRROR} target="_blank" rel="noreferrer" className="underline">
          نسخة على GitHub
        </a>
        ، فحصناها مقابل مجموع الأصوات القطري). «كل البلاد» يشمل أيضًا أصوات المغلّفات المزدوجة، مثل الجنود، غير المنسوبة
        لبلدة. القوائم التي حصلت على أقل من نصف بالمئة في البلدة تُحتسب ضمن «قوائم أخرى». أسماء البلدات بالعربية من
        ترجمتنا.
      </p>
    </main>
  );
}
