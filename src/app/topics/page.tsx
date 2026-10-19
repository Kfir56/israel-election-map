import { redirect } from "next/navigation";
import { topics, topicHref } from "@/data/topics";

export default function TopicsIndex() {
  redirect(topicHref(topics[0].id));
}
