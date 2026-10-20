"use client";

import { usePathname } from "next/navigation";

/** Renders its children everywhere except the translated sections, which have their own. */
export default function HebrewOnly({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return /^\/(ar|en|ru)(\/|$)/.test(path) ? null : children;
}
