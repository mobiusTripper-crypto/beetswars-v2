import { getSnapshotLatestRound } from "utils/externalData/snapshot";
import { addRound } from "./editBribedata";
import { findConfigEntry, setConfigEntry } from "utils/database/config.db";
import type { Bribefile } from "types/bribedata.raw";
import { initialInsertFromSnapshot } from "./votablePools.helper";
import type { Config } from "types/config.raw";

export async function addRoundFromSnapshot(): Promise<string | null> {
  const latest = Number(await findConfigEntry("latest")) || 0; // latest round number in database
  const latestProposal = await getSnapshotLatestRound(); // latest round proposal on snapshot
  const match = latestProposal?.title.match(/\(round (\d+)\)/);
  const round = match ? parseInt(match[1] || "", 10) : 0; // round number

  // check if there is a proposal that is not added to database
  if (latest && round > latest) { 
    try {
      // add round
      const newRound: Bribefile = {
        round: round,
        version: "",
        description: latestProposal?.title || "",
        snapshot: latestProposal?.id || "",
        tokendata: [],
        bribedata: [],
      };
      const newEntry = await addRound(newRound);
      if (!newEntry) return null;

      // set latest
      const entry: Config = { name: "latest", data: round };
      const newLatest = await setConfigEntry(entry);
      if (!newLatest) return null;

      // initial fill
      const newInit = await initialInsertFromSnapshot(round, latestProposal?.id);
      if (!newInit) return null;
      return "new Round: " + round + " new Snapshot: " + latestProposal?.id;
    } catch (error) {
      console.error("Could not add new round: " + error);
      return null;
    }
  } else {
    return null;
  }
}
