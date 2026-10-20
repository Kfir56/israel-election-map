import type { Metadata } from "next";
import { Noto_Sans_Arabic } from "next/font/google";
import IntlFooter from "@/components/intl/IntlFooter";
import { content } from "@/data/intl";

const noto = Noto_Sans_Arabic({ subsets: ["arabic"], variable: "--font-ar" });
const t = content.ar.ui;

export const metadata: Metadata = { title: t.siteTitle, description: t.siteDescription };

export default function ArabicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div lang="ar" dir="rtl" className={noto.className}>
      {children}
      <IntlFooter locale="ar" />
    </div>
  );
}
