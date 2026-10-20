import IntlWhyVote, { whyVoteMetadata } from "@/components/intl/IntlWhyVote";

export const metadata = whyVoteMetadata("en");

export default function EnglishWhyVote() {
  return <IntlWhyVote locale="en" />;
}
