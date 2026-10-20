import type { Metadata } from "next";
import IntlParty from "@/components/intl/IntlParty";
import { content } from "@/data/intl";
import { parties } from "@/data/parties";

export function generateStaticParams() {
  return parties.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: `${content.ar.parties[id]?.name ?? ""} · ${content.ar.ui.siteTitle}` };
}

export default async function ArabicPartyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <IntlParty locale="ar" id={id} />;
}
