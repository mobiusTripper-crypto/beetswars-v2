import type { RoundlistNum } from "types/roundlist.trpc";
import { readAllBribefile } from "utils/database/bribefile.db";
import { findConfigEntry } from "utils/database/config.db";

export async function getRoundlistNum(addNext = false): Promise<RoundlistNum> {
  let rounds: number[] = [];
  const data = await readAllBribefile();
  if (!!data) {
    const roundsUnsorted = data.map(item => item.round);
    rounds = roundsUnsorted.sort((n1, n2) => (n1 > n2 ? -1 : 1));
    if (addNext) {
      const next = (rounds[0] || 2) + 1;
      rounds = [next, ...rounds];
    }
  }
  const latestEntry = await findConfigEntry("latest");
  if (!latestEntry) return { rounds, latest: 0 };
  const latest = Number(latestEntry);
  return { rounds, latest };
}
