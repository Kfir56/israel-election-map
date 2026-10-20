import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import IntlFooter from "@/components/intl/IntlFooter";
import { content } from "@/data/intl";

const noto = Noto_Sans({ subsets: ["latin"], variable: "--font-en" });
const t = content.en.ui;

export const metadata: Metadata = { title: t.siteTitle, description: t.siteDescription };

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return (
    <div lang="en" dir="ltr" className={noto.className}>
      {children}
      <IntlFooter locale="en" />
    </div>
  );
}
