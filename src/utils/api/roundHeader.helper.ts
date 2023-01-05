import { Roundheader } from "types/roundheader.trpc";
import { readOneBribefile } from "utils/database/bribefile.db";
import { findConfigEntry } from "utils/database/config.db";
import { getTokenPrice } from "utils/externalData/beetsBack";
import { getCoingeckoCurrentPrice } from "utils/externalData/coingecko";
import {
  getSnapshotProposal,
  getSnapshotVotes,
} from "utils/externalData/snapshot";

function timeformat(seconds: number): string {
  if (seconds < 0) return "(closed)";
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  return `${days} d ${hours % 24} h ${minutes % 60} m`;
}

export default async function getRoundHeader(
  round: number = 0
): Promise<Roundheader | null> {
  const roundNumber = !!round ? round : Number(await findConfigEntry("latest"));
  const bribefile = await readOneBribefile(roundNumber);
  if (!bribefile) return null;
  // read data from snapshot
  const proposal = bribefile.snapshot;
  const bribedOffers = bribefile.bribedata.map((x) =>
    (x.voteindex + 1).toString()
  );
  const votes = await getSnapshotVotes(proposal);
  const snapshot = await getSnapshotProposal(proposal);

  const roundName = bribefile.description;
  const voteStart = new Date(snapshot.start * 1000).toUTCString();
  const voteEnd = new Date(snapshot.end * 1000).toUTCString();
  const timeRemaining = timeformat(snapshot.end - Date.now() / 1000);

  // calculate bribed votes
  const poolVotes: { [key: string]: number } = {};
  votes.forEach(({ choice, vp }) => {
    const total = Object.values(choice).reduce((a, b) => a + b);
    for (const [key, value] of Object.entries(choice)) {
      poolVotes[key] = (poolVotes[key] || 0) + (vp * value) / total;
    }
  });
  const totalVotes = Math.round(
    Object.values(poolVotes).reduce((a, b) => a + b)
  );
  const bribedVotes = Math.round(
    bribedOffers.reduce((sum, x) => sum + (poolVotes[x] || 0), 0)
  );
  const totalVoter = votes.length;
  const bribedVoters = [] as string[];
  votes.forEach((vote) => {
    for (const [key, value] of Object.entries(vote.choice)) {
      if (bribedOffers.includes(key) && !bribedVoters.includes(vote.voter))
        bribedVoters.push(vote.voter);
    }
  });
  const bribedVoter = bribedVoters.length;

  // calculate prices
  const priceBeets = await getCoingeckoCurrentPrice("beethoven-x");

  // calculate total bribes
  const bribes = bribedOffers.map((x) => {
    const key = x;
    const votes = poolVotes[x] || 0;
    const percent = (votes * 100) / totalVotes;
    const usd = 0;
    return { key, votes, percent, usd };
  });
  for (const bribe of bribefile.bribedata) {
    const rewardcap = bribe.rewardcap || Infinity;
    let sum = 0;
    const key = (bribe.voteindex + 1).toString();
    let bribeEntry = bribes.find((x) => x.key === key);
    if (!bribeEntry) break;
    const index = bribes.indexOf(bribeEntry);
    for (const reward of bribe.reward) {
      let amount = reward.amount;
      if (!reward.isfixed) {
        if ((reward.token = "BEETS")) {
          amount *= priceBeets;
        } else {
          const tokenaddress = bribefile.tokendata.find(
            (x) => x.token === reward.token
          )?.tokenaddress;
          amount *= tokenaddress
            ? await getTokenPrice(Date.now(), tokenaddress)
            : 0;
        }
      }
      // now we have amount in USD
      if (reward.type === "fixed") {
        sum += amount;
      } else if (reward.type === "percent") {
        let percent = bribeEntry.percent;
        if (percent < 0.15 && bribe.payoutthreshold !== -1) {
          percent = 0;
        } else if (bribe.percentagethreshold) {
          percent = Math.max(0, bribeEntry.percent - bribe.percentagethreshold);
        } else if (bribe.payoutthreshold) {
          percent = Math.max(0, bribeEntry.percent - bribe.payoutthreshold);
        }
        sum += amount * percent;
      } else if (reward.type === "pervote") {
        sum += amount * bribeEntry.votes;
      }
    }
    bribeEntry.usd = Math.min(sum, rewardcap);
    bribes[index] = bribeEntry;
  }
  const totalBribes = Math.round(bribes.reduce((sum, x) => sum + x.usd, 0));

  const avgPer1000 = !bribedVotes
    ? 0
    : Number(((totalBribes / bribedVotes) * 1000).toFixed(2));

  return {
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
}
