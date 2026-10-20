import IntlWhyVote, { whyVoteMetadata } from "@/components/intl/IntlWhyVote";

export const metadata = whyVoteMetadata("ar");

export default function ArabicWhyVote() {
  return <IntlWhyVote locale="ar" />;
}
