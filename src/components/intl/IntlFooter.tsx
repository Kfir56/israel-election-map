import Link from "next/link";
import { type Locale, base, content } from "@/data/intl";

const otherLanguages: { href: string; lang: string; label: string }[] = [
  { href: "/", lang: "he", label: "עברית" },
  { href: "/ar", lang: "ar", label: "العربية" },
  { href: "/en", lang: "en", label: "English" },
  { href: "/ru", lang: "ru", label: "Русский" },
];

export default function IntlFooter({ locale }: { locale: Locale }) {
  const t = content[locale].ui;
  const b = base(locale);
  return (
    <footer className="mt-16 border-t border-slate-800 bg-slate-950">
      <div className="mx-auto max-w-5xl space-y-2 px-4 py-8 text-xs leading-relaxed text-slate-500 sm:px-6">
        <p>
          <b className="text-slate-300">{t.footerSourcesLabel}</b> {t.footerSrc1}{" "}
          <a className="underline" href="https://www.idi.org.il/policy/parties-and-elections/elections/2026-1/">
            {t.footerSrcIdi}
          </a>
          {t.footerSrc2}{" "}
          <a className="underline" href="https://www.skarim.org/polls">
            {t.footerSrcSkarim}
          </a>
          {t.footerSrc3}
        </p>
        <p>{t.footerNeutral}</p>
        <p className="flex flex-wrap gap-x-4 gap-y-1">
          <Link href={b} className="hover:text-white">
            {t.navParties}
          </Link>
          <Link href={`${b}/towns`} className="hover:text-white">
            {t.navTowns}
          </Link>
          <Link href={`${b}/why-vote`} className="hover:text-white">
            {t.navWhy}
          </Link>
          {otherLanguages
            .filter((l) => l.lang !== locale)
            .map((l) => (
              <Link key={l.lang} href={l.href} lang={l.lang} className="hover:text-white">
                {l.label}
              </Link>
            ))}
        </p>
      </div>
    </footer>
  );
}
