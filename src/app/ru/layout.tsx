import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import IntlFooter from "@/components/intl/IntlFooter";
import { content } from "@/data/intl";

const noto = Noto_Sans({ subsets: ["latin", "cyrillic"], variable: "--font-ru" });
const t = content.ru.ui;

export const metadata: Metadata = { title: t.siteTitle, description: t.siteDescription };

export default function RussianLayout({ children }: { children: React.ReactNode }) {
  return (
    <div lang="ru" dir="ltr" className={noto.className}>
      {children}
      <IntlFooter locale="ru" />
    </div>
  );
}
