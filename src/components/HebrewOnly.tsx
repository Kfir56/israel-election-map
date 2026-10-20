"use client";

import { usePathname } from "next/navigation";

/** Renders its children everywhere except the Arabic section, which has its own. */
export default function HebrewOnly({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return path === "/ar" || path.startsWith("/ar/") ? null : children;
}
