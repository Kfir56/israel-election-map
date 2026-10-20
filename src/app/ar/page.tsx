import IntlHome from "@/components/intl/IntlHome";
import { content } from "@/data/intl";

export const metadata = { title: content.ar.ui.homeMetaTitle };

export default function ArabicHome() {
  return <IntlHome locale="ar" />;
}
