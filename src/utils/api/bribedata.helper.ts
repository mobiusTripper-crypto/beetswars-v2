import { BribeData, BribeOffer } from "types/bribelist.trpc";
import { readOneBribefile } from "utils/database/bribefile.db";
import { findConfigEntry } from "utils/database/config.db";
import {
  getSnapshotProposal,
  getSnapshotVotes,
} from "utils/externalData/snapshot";
import { calculateSingleOffer } from "./calculateBribe";

function timeformat(seconds: number): string {
  if (seconds < 0) return "(closed)";
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  return `${days} d ${hours % 24} h ${minutes % 60} m`;
}

export default async function getBribeData(
  round: number = 0
): Promise<BribeData | null> {
  const roundnumber = round || Number(await findConfigEntry("latest"));
  const bribefile = await readOneBribefile(roundnumber);
  if (!bribefile) return null;

  // read data from snapshot
  const proposal = bribefile.snapshot;
  const votes = await getSnapshotVotes(proposal);
  const snapshot = await getSnapshotProposal(proposal);
  if (!snapshot) return null;

  const roundName = bribefile.description;
  const voteStart = new Date(snapshot.start * 1000).toUTCString();
  const voteEnd = new Date(snapshot.end * 1000).toUTCString();
  const timeRemaining = timeformat(snapshot.end - Date.now() / 1000);

  const totalVotes = Math.round(votes.reduce((sum, vote) => sum + vote.vp, 0));
  const totalVoter = votes.length;

  const bribelist = await Promise.all(
    bribefile.bribedata.map(async (bribe) => {
      const offer = await calculateSingleOffer(
        bribe,
        bribefile.tokendata,
        snapshot.end,
        proposal
      );
      const bribeOffer: BribeOffer = {
        voteindex: bribe.voteindex,
        poolname: bribe.poolname,
        poolurl: bribe.poolurl,
        rewarddescription: bribe.rewarddescription,
        assumption: bribe.assumption,
        ...offer,
      };
      return bribeOffer;
    })
  );

  const bribedVotes = bribelist.reduce((sum, bribe) => sum + bribe.votes, 0);
  const totalBribes = bribelist.reduce(
    (sum, bribe) => sum + bribe.rewardAmount,
    0
  );
  const avgPer1000 = !bribedVotes
    ? 0
    : Number(((totalBribes / bribedVotes) * 1000).toFixed(2));

  // calculate bribed voters
  const bribedOffers = bribefile.bribedata.map((x) =>
    (x.voteindex + 1).toString()
  );
  const bribedVoters = [] as string[];
  votes.forEach((vote) => {
    for (const [key, value] of Object.entries(vote.choice)) {
      if (bribedOffers.includes(key) && !bribedVoters.includes(vote.voter))
        bribedVoters.push(vote.voter);
    }
  });
  const bribedVoter = bribedVoters.length;

  const header = {
    roundName,
    voteStart,
    voteEnd,
    timeRemaining,
    totalVotes,
    bribedVotes,
    totalVoter,
    bribedVoter,
    totalBribes,
    avgPer1000,
  };

  return { header, bribelist };
}