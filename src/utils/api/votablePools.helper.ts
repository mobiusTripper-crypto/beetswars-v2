import type { VotablePool } from "types/votablePools.raw";
import { insertPoolentries, readRoundPoolentries } from "utils/database/votablePools.db";
import { getSnapshotProposal } from "utils/externalData/snapshot";

export async function initialInsertFromSnapshot(
  round: number,
  snapshot: string
): Promise<VotablePool[] | null> {
  try {
    // check for empty data first, break if not empty
    const previous = await readRoundPoolentries(round);
    if (!!previous && previous.length > 0) return null;

    const proposal = await getSnapshotProposal(snapshot);
    if (!proposal) return null;
    const snaplist = proposal.choices;
    const data = snaplist.map((choice, index) => {
      return { poolName: choice, voteindex: index, round, isUncapped: false } as VotablePool;
    });

    const result = await insertPoolentries(data);
    if (!result) return null;
    return result;
  } catch (error) {
    console.error("failed initial insert votable pools");
    return null;
  }
}
