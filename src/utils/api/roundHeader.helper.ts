import { Roundheader } from "types/roundheader.trpc";
import { readOneBribefile } from "utils/database/bribefile.db";
import { findConfigEntry } from "utils/database/config.db";

export default async function x(
  round: number = 0
): Promise<Roundheader | null> {
  const roundNumber = !!round ? round : Number(await findConfigEntry("latest"));
  const bribefile = await readOneBribefile(roundNumber);
  if (!bribefile) return null;

  const roundName = bribefile.description;
  const voteStart = bribefile.voteStart?.toString() || "";
  const voteEnd = bribefile.voteEnd?.toString() || "";
  const timeRemaining = "";
  const totalVotes = 0;
  const bribedVotes = 0;
  const totalVoter = 0;
  const totalBribes = 0;
  const avgPer1000 = 0;

  return {
    roundName,
    voteStart,
    voteEnd,
    timeRemaining,
    totalVotes,
    bribedVotes,
    totalVoter,
    totalBribes,
    avgPer1000,
  };
}
