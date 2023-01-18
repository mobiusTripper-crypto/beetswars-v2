import { Chartdata } from "../../types/chartdata.raw";
import {
  getSnapshotProposal,
  getSnapshotVotes,
} from "../externalData/snapshot";
import { getCoingeckoPrice } from "../externalData/coingecko";
import { getTokenPrice } from "../externalData/beetsBack";
import { readOneBribefile } from "utils/database/bribefile.db";
import { getEmissionForRound } from "./bribeApr.helper";

export async function getData(round: string) {
  const newData = {} as Chartdata;
  newData.round = round;

  // gather basics
  const bribefile = await readOneBribefile(+round);
  if (!bribefile) return newData; //empty
  const proposal = bribefile.snapshot;
  const bribedOffers = bribefile.bribedata.map((x) =>
    (x.voteindex + 1).toString()
  );
  const prop = await getSnapshotProposal(proposal);
  const votes = await getSnapshotVotes(proposal);
  if (!prop) return newData;
  const { end } = prop;
  const totalVoter = votes.length;

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

  // calculate prices
  const priceBeets = await getCoingeckoPrice("beethoven-x", end);
  const priceFbeets = await getTokenPrice(
    end,
    "0xfcef8a994209d6916eb2c86cdd2afd60aa6f54b1"
  );

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
          amount *= tokenaddress ? await getTokenPrice(end, tokenaddress) : 0;
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
  const emissions = await getEmissionForRound(round);
  const bribersRoi = emissions?.avgBribeRoiInPercent ?? 0;

  // fill data
  newData.totalVoter = totalVoter;
  newData.totalVotes = totalVotes;
  newData.totalBriber = bribedOffers.length;
  newData.totalBribes = totalBribes;
  newData.bribedVotes = bribedVotes;
  newData.voteEnd = end;
  newData.priceBeets = priceBeets;
  newData.priceFbeets = priceFbeets;
  newData.bribersRoi = bribersRoi;

  return newData;
}
