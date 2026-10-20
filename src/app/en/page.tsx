import IntlHome from "@/components/intl/IntlHome";
import { content } from "@/data/intl";

export const metadata = { title: content.en.ui.homeMetaTitle };

export default function EnglishHome() {
  return <IntlHome locale="en" />;
}
