import { parties } from "@/data/parties";

// Party colors are the parties' own, so they stay. The two near-black ones
// would vanish on the dark surface; they get a light gray stand-in.
const ON_DARK: Record<string, string> = { shas: "#e7e5e4", utj: "#a8a29e" };

export const colorOnDark = (id: string) => ON_DARK[id] ?? parties.find((p) => p.id === id)!.color;
