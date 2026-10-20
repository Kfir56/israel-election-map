import IntlWhyVote, { whyVoteMetadata } from "@/components/intl/IntlWhyVote";

export const metadata = whyVoteMetadata("ru");

export default function RussianWhyVote() {
  return <IntlWhyVote locale="ru" />;
}
