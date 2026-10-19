import { Suspense } from "react";
import Compare from "./Compare";

export const metadata = { title: "השוואה בין מפלגות · המפה הפוליטית 2026" };

export default function ComparePage() {
  return (
    <Suspense>
      <Compare />
    </Suspense>
  );
}
