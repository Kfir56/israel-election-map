import type { Metadata } from "next";
import IntlParty from "@/components/intl/IntlParty";
import { content } from "@/data/intl";
import { parties } from "@/data/parties";

export function generateStaticParams() {
  return parties.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: `${content.ru.parties[id]?.name ?? ""} · ${content.ru.ui.siteTitle}` };
}

export default async function RussianPartyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <IntlParty locale="ru" id={id} />;
}
