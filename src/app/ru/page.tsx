import IntlHome from "@/components/intl/IntlHome";
import { content } from "@/data/intl";

export const metadata = { title: content.ru.ui.homeMetaTitle };

export default function RussianHome() {
  return <IntlHome locale="ru" />;
}
