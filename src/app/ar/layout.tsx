import type { Metadata } from "next";
import { Noto_Sans_Arabic } from "next/font/google";
import Link from "next/link";

const noto = Noto_Sans_Arabic({ subsets: ["arabic"], variable: "--font-ar" });

export const metadata: Metadata = {
  title: "الخريطة السياسية 2026",
  description: "الأحزاب ومواقفها ومرشحوها في انتخابات الكنيست الـ26، 27 تشرين الأول/أكتوبر 2026",
};

export default function ArabicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div lang="ar" dir="rtl" className={noto.className}>
      {children}
      <footer className="mt-16 border-t border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-5xl space-y-2 px-4 py-8 text-xs leading-relaxed text-slate-500 sm:px-6">
          <p>
            <b className="text-slate-300">المصادر:</b> قوائم المرشحين وأوصاف الأحزاب من{" "}
            <a className="underline" href="https://www.idi.org.il/policy/parties-and-elections/elections/2026-1/">
              المعهد الإسرائيلي للديمقراطية
            </a>
            ؛ الاستطلاعات من{" "}
            <a className="underline" href="https://www.skarim.org/polls">
              أرشيف الاستطلاعات skarim.org
            </a>
            ؛ مواقف الأحزاب من برامجها ومواقعها وتصريحاتها، مع رابط وتاريخ لكل موقف. النص العربي مترجم من العبرية.
          </p>
          <p>الموقع غير مرتبط بأي حزب ولا يوصي بأي حزب.</p>
          <p className="flex gap-4">
            <Link href="/ar" className="hover:text-white">
              الأحزاب
            </Link>
            <Link href="/ar/towns" className="hover:text-white">
              نتائج 2022 حسب البلدة
            </Link>
            <Link href="/ar/why-vote" className="hover:text-white">
              لماذا نصوّت
            </Link>
            <Link href="/" lang="he" className="hover:text-white">
              עברית
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
