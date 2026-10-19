import { Suspense } from "react";
import Friends from "./Friends";

export const metadata = { title: "חברים · המפה הפוליטית 2026" };

export default function FriendsPage() {
  return (
    <Suspense>
      <Friends />
    </Suspense>
  );
}
