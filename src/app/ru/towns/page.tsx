import IntlTowns, { townsMetadata } from "@/components/intl/IntlTowns";

export const metadata = townsMetadata("ru");

export default function RussianTownsPage() {
  return <IntlTowns locale="ru" />;
}
