import type { Roundlist, RoundlistNum } from "types/roundlist.trpc";
import { readAllBribefile } from "utils/database/bribefile.db";
import { findConfigEntry } from "utils/database/config.db";

export default async function getRoundlist(): Promise<Roundlist> {
  let rounds: string[];
  const data = await readAllBribefile();
  if (!data) {
    rounds = [];
  } else {
    const roundsUnsorted = data.map(item => item.round.toString().padStart(2, "0"));
    rounds = roundsUnsorted.sort((n1, n2) => (n1 > n2 ? -1 : 1));
  }
  const latest = (await findConfigEntry("latest")) ?? "";
  return { rounds, latest };
}

export async function getRoundlistNum(): Promise<RoundlistNum> {
  let rounds: number[];
  const data = await readAllBribefile();
  if (!data) {
    rounds = [];
  } else {
    const roundsUnsorted = data.map(item => item.round);
    rounds = roundsUnsorted.sort((n1, n2) => (n1 > n2 ? -1 : 1));
  }
  const latestEntry = await findConfigEntry("latest");
  if (!latestEntry) return { rounds, latest: 0 };
  const latest = Number(latestEntry);
  return { rounds, latest };
}
