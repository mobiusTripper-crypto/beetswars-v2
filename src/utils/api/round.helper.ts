import { getSnapshotLatestRound } from "utils/externalData/snapshot";
import { addRound } from "./editBribedata";
import { findConfigEntry, setConfigEntry } from "utils/database/config.db";
import type { Bribefile } from "types/bribedata.raw";
import { initialInsertFromSnapshot } from "./votablePools.helper";
import type { Config } from "types/config.raw";
import { insertBribefile, readOneBribefile } from "utils/database/bribefile.db";

export async function addRoundFromSnapshot(): Promise<string | null> {
  const latest = Number(await findConfigEntry("latest")) || 0; // latest round number in database
  const latestProposal = await getSnapshotLatestRound(); // latest round proposal on snapshot
  const match = latestProposal?.title.match(/\(Round (\d+)\)/); // adjusted to Sonic
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
        voteStart: latestProposal?.start || undefined,
        voteEnd: latestProposal?.end || undefined,
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
      const emission = await getEmissionNumber(round);
      return "new Round: " + round + " new Snapshot: " + latestProposal?.id + " emission: " + emission;
    } catch (error) {
      console.error("Could not add new round: " + error);
      return null;
    }
  } else {
    return null;
  }
}

export async function getEmissionNumber(round: number): Promise<number | null> {
  const roundData = await readOneBribefile(round);
  if (!roundData) return null;
  if (!roundData.emission) {
    // get voteEnd from roundData or snapshot
    let voteEnd = roundData.voteEnd;
    if (!voteEnd) {
      const snapshotData = await getSnapshotLatestRound();
      if (!snapshotData) return null;
      voteEnd = snapshotData.end;
      if (!voteEnd) return null;
    }
    console.log("voteEnd: " + voteEnd);
    // try to get emission from beets github
    const githubUrl = `https://raw.githubusercontent.com/beethovenxfi/ops-automation/refs/heads/main/src/gaugeAutomation/gauge-data/${voteEnd}.json`;
    const response = await fetch(githubUrl);
    if (response.ok) {
      const data = await response.json();
      if (!data.beetsToDistribute) return null; // no emission found
      // write back to Bribefile
      roundData.emission = Number(data.beetsToDistribute);
      insertBribefile(roundData, round);
      return Number(data.beetsToDistribute); // return emission
    }
    // if not found try again later
    return null
  } else {
    return roundData.emission;
  }
}