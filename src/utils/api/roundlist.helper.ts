import { Roundlist } from "types/roundlist.trpc";
import { readAllBribefile } from "utils/database/bribefile.db";
import { findConfigEntry } from "utils/database/config.db";

export default async function getRoundlist(): Promise<Roundlist> {
  let rounds: string[];
  const data = await readAllBribefile();
  if (!data) {
    rounds = [];
  } else {
    const roundsUnsorted = data.map((item) =>
      item.round.toString().padStart(2, "0")
    );
    rounds = roundsUnsorted.sort((n1, n2) => (n1 > n2 ? -1 : 1));
  }
  const latest = Number((await findConfigEntry("latest")) ?? 0);
  return { rounds, latest };
}
