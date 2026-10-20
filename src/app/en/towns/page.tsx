import IntlTowns, { townsMetadata } from "@/components/intl/IntlTowns";

export const metadata = townsMetadata("en");

export default function EnglishTownsPage() {
  return <IntlTowns locale="en" />;
}
