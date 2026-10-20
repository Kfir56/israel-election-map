import TownResults from "@/components/TownResults";
import { type Locale, content } from "@/data/intl";

const SOURCE = "https://votes25.bechirot.gov.il/cityresults?cityID=0";
const MIRROR = "https://github.com/DarthVictor/israel-election-results";

export const townsMetadata = (locale: Locale) => ({
  title: content[locale].towns.metaTitle,
  description: content[locale].towns.metaDescription,
});

export default function IntlTowns({ locale }: { locale: Locale }) {
  const t = content[locale].towns;
  return (
    <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <h1 className="text-3xl font-extrabold sm:text-4xl">{t.title}</h1>
      <p className="mt-2 text-lg text-slate-300">{t.intro}</p>
      <div className="mt-6">
        <TownResults
          locale={locale}
          strings={{
            text: t,
            lists: t.lists,
            partyNames: Object.fromEntries(Object.entries(content[locale].parties).map(([id, p]) => [id, p.name])),
          }}
        />
      </div>
      <p className="mt-6 text-xs leading-relaxed text-slate-500">
        {t.sourceLabel}{" "}
        <a href={SOURCE} target="_blank" rel="noreferrer" className="underline">
          {t.sourceLink}
        </a>{" "}
        {t.sourceMid}{" "}
        <a href={MIRROR} target="_blank" rel="noreferrer" className="underline">
          {t.mirrorLink}
        </a>
        {t.sourceAfter}
      </p>
    </main>
  );
}
