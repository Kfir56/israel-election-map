// The public address, for absolute links in previews and calendar files.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://israel-election-map-chi.vercel.app";

/** Link-preview image for a page, drawn by /og. */
export const ogImage = (title: string, subtitle?: string) =>
  `/og?t=${encodeURIComponent(title)}${subtitle ? `&s=${encodeURIComponent(subtitle)}` : ""}`;
