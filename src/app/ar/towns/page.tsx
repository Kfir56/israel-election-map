import IntlTowns, { townsMetadata } from "@/components/intl/IntlTowns";

export const metadata = townsMetadata("ar");

export default function ArabicTownsPage() {
  return <IntlTowns locale="ar" />;
}
